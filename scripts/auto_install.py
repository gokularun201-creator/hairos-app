import subprocess
import time

print("[AutoInstall] Starting pm install...")
proc = subprocess.Popen(["adb", "-s", "593d497c", "shell", "pm", "install", "-r", "-d", "/data/local/tmp/hair.apk"],
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

# Tap the 'Remember my choice' and 'Install' button repeatedly while popup is up
for _ in range(12):
    time.sleep(0.3)
    # Tap 'Remember my choice' (approx x=160, y=1970)
    subprocess.run(["adb", "-s", "593d497c", "shell", "input", "tap", "160", "1970"], capture_output=True)
    # Tap 'Install' (approx x=280, y=2070)
    subprocess.run(["adb", "-s", "593d497c", "shell", "input", "tap", "280", "2070"], capture_output=True)
    if proc.poll() is not None:
        break

stdout, stderr = proc.communicate(timeout=20)
print("Return code:", proc.returncode)
print("Stdout:", stdout)
print("Stderr:", stderr)
