import os
import sys
import zipfile
import subprocess
import shutil

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_apk = os.path.join(base_dir, "HairOS-installable-release.apk")
    unaligned_apk = os.path.join(base_dir, "HairOS-unaligned.apk")
    aligned_apk = os.path.join(base_dir, "HairOS-aligned.apk")
    final_apk = os.path.join(base_dir, "HairOS-upgraded-release.apk")
    final_aab = os.path.join(base_dir, "HairOS-release.aab")

    build_tools = r"C:\Users\gokularun\AppData\Local\Android\Sdk\build-tools\35.0.0"
    aapt2_bin = os.path.join(build_tools, "aapt2.exe")
    zipalign_bin = os.path.join(build_tools, "zipalign.exe")
    apksigner_bin = os.path.join(build_tools, "apksigner.bat")
    bundletool_jar = os.path.join(base_dir, "bundletool-all.jar")

    manifest_path = os.path.join(base_dir, "apk_extracted", "AndroidManifest.xml")
    index_html_path = os.path.join(base_dir, "apk_extracted", "assets", "public", "index.html")
    index_js_path = os.path.join(base_dir, "apk_extracted", "assets", "public", "assets", "index-DSCc7arU.js")
    local_fonts_css_path = os.path.join(base_dir, "apk_extracted", "assets", "public", "local-fonts.css")
    fonts_dir = os.path.join(base_dir, "apk_extracted", "assets", "public", "fonts")

    if not os.path.exists(source_apk):
        print(f"Error: {source_apk} not found!")
        sys.exit(1)

    with open(manifest_path, "rb") as f:
        new_manifest = f.read()

    with open(index_html_path, "rb") as f:
        new_index_html = f.read()

    with open(index_js_path, "rb") as f:
        new_index_js = f.read()

    with open(local_fonts_css_path, "rb") as f:
        new_local_fonts_css = f.read()

    # Collect local fonts to inject
    local_fonts = {}
    if os.path.exists(fonts_dir):
        for fname in os.listdir(fonts_dir):
            fpath = os.path.join(fonts_dir, fname)
            if os.path.isfile(fpath):
                with open(fpath, "rb") as f:
                    local_fonts[f"assets/public/fonts/{fname}"] = f.read()

    print("[Packager] Repacking APK with upgraded assets and v2.0.0 metadata...")

    uncompressed_exts = {".png", ".jpg", ".jpeg", ".webp", ".arsc", ".so"}

    with zipfile.ZipFile(source_apk, 'r') as zin:
        with zipfile.ZipFile(unaligned_apk, 'w') as zout:
            for item in zin.infolist():
                # Skip old signatures in META-INF
                if item.filename.startswith("META-INF/") and (
                    item.filename.endswith(".SF") or
                    item.filename.endswith(".RSA") or
                    item.filename.endswith(".MF") or
                    item.filename.endswith(".DSA") or
                    item.filename.endswith(".EC")
                ):
                    continue

                _, ext = os.path.splitext(item.filename.lower())
                compress_type = zipfile.ZIP_STORED if ext in uncompressed_exts else zipfile.ZIP_DEFLATED

                if item.filename == "AndroidManifest.xml":
                    print("  Replacing AndroidManifest.xml (versionCode=2, versionName=2.0.0)")
                    zout.writestr(item.filename, new_manifest, compress_type=compress_type)
                elif item.filename == "assets/public/index.html":
                    print("  Replacing assets/public/index.html")
                    zout.writestr(item.filename, new_index_html, compress_type=compress_type)
                elif item.filename == "assets/public/assets/index-DSCc7arU.js":
                    print(f"  Replacing assets/public/assets/index-DSCc7arU.js ({len(new_index_js)} bytes)")
                    zout.writestr(item.filename, new_index_js, compress_type=compress_type)
                else:
                    data = zin.read(item.filename)
                    zout.writestr(item.filename, data, compress_type=compress_type)

            # Inject local fonts and fonts css
            print("  Injecting assets/public/local-fonts.css")
            zout.writestr("assets/public/local-fonts.css", new_local_fonts_css, compress_type=zipfile.ZIP_DEFLATED)

            for font_zip_path, font_bytes in local_fonts.items():
                print(f"  Injecting {font_zip_path} ({len(font_bytes)} bytes)")
                zout.writestr(font_zip_path, font_bytes, compress_type=zipfile.ZIP_STORED)

    print("[Packager] Unaligned APK created successfully.")

    # 1. Run zipalign 4
    print("[Packager] Running zipalign 4...")
    align_cmd = [zipalign_bin, "-p", "-f", "4", unaligned_apk, aligned_apk]
    subprocess.check_call(align_cmd)

    # 2. Sign with debug.keystore
    keystore_path = r"C:\Users\gokularun\.android\debug.keystore"
    print(f"[Packager] Signing with apksigner ({keystore_path})...")
    sign_cmd = [
        apksigner_bin,
        "sign",
        "--ks", keystore_path,
        "--ks-pass", "pass:android",
        "--key-pass", "pass:android",
        "--ks-key-alias", "androiddebugkey",
        "--out", final_apk,
        aligned_apk
    ]
    subprocess.check_call(sign_cmd)

    # 3. Verify APK signature
    print("[Packager] Verifying APK signature...")
    verify_cmd = [apksigner_bin, "verify", "--verbose", final_apk]
    subprocess.check_call(verify_cmd)

    # 4. Check APK badging with aapt2
    print("[Packager] Verifying package metadata with aapt2 dump badging...")
    dump_res = subprocess.run([aapt2_bin, "dump", "badging", final_apk], capture_output=True, text=True)
    if dump_res.stdout:
        print("  " + dump_res.stdout.splitlines()[0])

    print(f"\n[SUCCESS] Upgraded APK built: {final_apk} ({os.path.getsize(final_apk):,} bytes)")

    # 5. Build Android App Bundle (.aab)
    print("\n[Packager] Building release-ready Android App Bundle (.aab)...")
    proto_apk = os.path.join(base_dir, "proto_temp.apk")
    base_zip = os.path.join(base_dir, "base_module.zip")

    try:
        # Step A: Convert aligned APK to proto format via aapt2
        convert_cmd = [aapt2_bin, "convert", "--output-format", "proto", "-o", proto_apk, aligned_apk]
        subprocess.check_call(convert_cmd)

        # Step B: Pack module zip (base_module.zip) with bundle layout
        with zipfile.ZipFile(proto_apk, 'r') as p_in:
            with zipfile.ZipFile(base_zip, 'w', compression=zipfile.ZIP_DEFLATED) as b_out:
                for item in p_in.infolist():
                    name = item.filename
                    data = p_in.read(name)
                    if name == 'AndroidManifest.xml':
                        b_out.writestr('manifest/AndroidManifest.xml', data)
                    elif name.startswith('classes') and name.endswith('.dex'):
                        b_out.writestr(f'dex/{name}', data)
                    elif name == 'resources.pb' or name.startswith('res/') or name.startswith('assets/') or name.startswith('lib/'):
                        b_out.writestr(name, data)

        # Step C: Run bundletool build-bundle
        bundle_cmd = [
            "java", "-jar", bundletool_jar,
            "build-bundle",
            f"--modules={base_zip}",
            f"--output={final_aab}",
            "--overwrite"
        ]
        subprocess.check_call(bundle_cmd)

        # Step D: Verify bundle manifest
        print("[Packager] Verifying App Bundle manifest...")
        manifest_res = subprocess.run([
            "java", "-jar", bundletool_jar,
            "dump", "manifest",
            f"--bundle={final_aab}"
        ], capture_output=True, text=True)

        for line in manifest_res.stdout.splitlines()[:2]:
            if "versionCode" in line or "versionName" in line or "manifest" in line:
                print(f"  {line.strip()[:100]}...")

        print(f"\n[SUCCESS] Release-ready Android App Bundle built: {final_aab} ({os.path.getsize(final_aab):,} bytes)")

    finally:
        # Cleanup intermediate build artifacts
        for temp_file in [proto_apk, base_zip]:
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except Exception:
                    pass

if __name__ == "__main__":
    main()
