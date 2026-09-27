import os
import sys
import zipfile
import subprocess

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_apk = os.path.join(base_dir, "HairOS-installable-release.apk")
    unaligned_apk = os.path.join(base_dir, "HairOS-unaligned.apk")
    aligned_apk = os.path.join(base_dir, "HairOS-aligned.apk")
    final_apk = os.path.join(base_dir, "HairOS-upgraded-release.apk")

    index_html_path = os.path.join(base_dir, "apk_extracted", "assets", "public", "index.html")
    index_js_path = os.path.join(base_dir, "apk_extracted", "assets", "public", "assets", "index-DSCc7arU.js")

    if not os.path.exists(source_apk):
        print(f"Error: {source_apk} not found!")
        sys.exit(1)

    with open(index_html_path, "rb") as f:
        new_index_html = f.read()

    with open(index_js_path, "rb") as f:
        new_index_js = f.read()

    print("[Packager] Repacking APK with upgraded assets...")

    # Files that should NOT be compressed in APK according to Android spec
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

                if item.filename == "assets/public/index.html":
                    print("  Replacing assets/public/index.html")
                    zout.writestr(item.filename, new_index_html, compress_type=compress_type)
                elif item.filename == "assets/public/assets/index-DSCc7arU.js":
                    print(f"  Replacing assets/public/assets/index-DSCc7arU.js ({len(new_index_js)} bytes)")
                    zout.writestr(item.filename, new_index_js, compress_type=compress_type)
                else:
                    data = zin.read(item.filename)
                    zout.writestr(item.filename, data, compress_type=compress_type)

    print("[Packager] Unaligned APK created successfully.")

    # Run zipalign
    build_tools = r"C:\Users\gokularun\AppData\Local\Android\Sdk\build-tools\35.0.0"
    zipalign_bin = os.path.join(build_tools, "zipalign.exe")
    apksigner_bin = os.path.join(build_tools, "apksigner.bat")

    print("[Packager] Running zipalign 4...")
    align_cmd = [zipalign_bin, "-p", "-f", "4", unaligned_apk, aligned_apk]
    subprocess.check_call(align_cmd)

    # Sign with debug.keystore
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

    # Verify signature
    print("[Packager] Verifying APK signature...")
    verify_cmd = [apksigner_bin, "verify", "--verbose", final_apk]
    subprocess.check_call(verify_cmd)

    print(f"\n[SUCCESS] Upgraded APK built and verified: {final_apk}")
    print(f"File size: {os.path.getsize(final_apk):,} bytes")

if __name__ == "__main__":
    main()
