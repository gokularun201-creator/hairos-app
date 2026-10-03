const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

function copyDirRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyDirRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

async function build() {
  console.log('[Build] Starting esbuild bundle for Hair OS Website & App...');

  const distDir = path.resolve(__dirname, 'dist');
  const distAssetsDir = path.resolve(distDir, 'assets');
  const apkPublicDir = path.resolve(__dirname, '../apk_extracted/assets/public');

  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }

  // 1. Bundle TypeScript / React application
  const result = await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
    bundle: true,
    format: 'esm',
    minify: false,
    target: ['es2020', 'chrome100'],
    outfile: path.resolve(distAssetsDir, 'index-DSCc7arU.js'),
    sourcemap: false,
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.svg': 'text'
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });

  console.log('[Build] esbuild bundle complete: dist/assets/index-DSCc7arU.js');

  // 2. Synchronize static assets from apk_extracted/assets/public if present
  if (fs.existsSync(apkPublicDir)) {
    // Copy CSS
    const cssSrc = path.resolve(apkPublicDir, 'assets/index-BHQlbIQx.css');
    if (fs.existsSync(cssSrc)) {
      fs.copyFileSync(cssSrc, path.resolve(distAssetsDir, 'index-BHQlbIQx.css'));
      console.log('[Build] Copied Tailwind CSS -> dist/assets/index-BHQlbIQx.css');
    }

    // Copy web helper
    const webJsSrc = path.resolve(apkPublicDir, 'assets/web-CWT58PE7.js');
    if (fs.existsSync(webJsSrc)) {
      fs.copyFileSync(webJsSrc, path.resolve(distAssetsDir, 'web-CWT58PE7.js'));
    }

    // Copy scans directory
    const scansSrc = path.resolve(apkPublicDir, 'assets/scans');
    if (fs.existsSync(scansSrc)) {
      copyDirRecursiveSync(scansSrc, path.resolve(distAssetsDir, 'scans'));
      console.log('[Build] Copied scans assets -> dist/assets/scans/');
    }

    // Copy fonts directory
    const fontsSrc = path.resolve(apkPublicDir, 'fonts');
    if (fs.existsSync(fontsSrc)) {
      copyDirRecursiveSync(fontsSrc, path.resolve(distDir, 'fonts'));
      console.log('[Build] Copied font family -> dist/fonts/');
    }

    // Copy icons and fonts css
    const localFontsCss = path.resolve(apkPublicDir, 'local-fonts.css');
    if (fs.existsSync(localFontsCss)) {
      fs.copyFileSync(localFontsCss, path.resolve(distDir, 'local-fonts.css'));
    }

    const appIcon = path.resolve(apkPublicDir, 'app_icon.png');
    if (fs.existsSync(appIcon)) {
      fs.copyFileSync(appIcon, path.resolve(distDir, 'app_icon.png'));
    }

    const favIcon = path.resolve(apkPublicDir, 'favicon.png');
    if (fs.existsSync(favIcon)) {
      fs.copyFileSync(favIcon, path.resolve(distDir, 'favicon.png'));
    }
  }

  // 3. Generate high-performance, responsive index.html
  const htmlContent = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>HAIR OS Pro — Server-Free Care Routine & Hair Lab</title>
    <meta name="description" content="100% private, server-free hair companion with AI hair diagnostic, ingredient decoder, hard water shield, daily habit tracking, and photo journal." />
    
    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="HAIR OS Pro — Private Care Routine & Hair Lab" />
    <meta property="og:description" content="100% server-free hair routine, AI scan, ingredient decoder, and private visual progress tracking." />
    <meta property="og:image" content="./app_icon.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="HAIR OS Pro — Private Care Routine & Hair Lab" />
    <meta name="twitter:description" content="100% server-free hair routine, AI scan, ingredient decoder, and private visual progress tracking." />
    <meta name="twitter:image" content="./app_icon.png" />

    <meta name="theme-color" content="#020617" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="icon" type="image/png" href="./favicon.png" />
    <link rel="apple-touch-icon" href="./app_icon.png" />
    <link rel="manifest" href="./manifest.json" />
    <link rel="stylesheet" href="./local-fonts.css" />
    <style>
      :root {
        color-scheme: dark;
      }
      html, body {
        background-color: #020617;
        margin: 0;
        padding: 0;
        min-height: 100vh;
      }
      body {
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        user-select: none;
        overscroll-behavior-y: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      }
      .pt-safe {
        padding-top: env(safe-area-inset-top, 16px);
      }
      .pb-safe {
        padding-bottom: env(safe-area-inset-bottom, 24px);
      }
      .app-screen-container {
        padding-top: 56px !important;
        padding-bottom: 140px !important;
      }
      .app-nav-container {
        padding-bottom: 24px !important;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 9999px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Desktop presentation enhancement */
      @media (min-width: 768px) {
        body {
          background: radial-gradient(circle at 50% 0%, #0d1e33 0%, #020617 70%);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }
        #root {
          width: 100%;
          max-width: 480px;
          min-height: 100vh;
          box-shadow: 0 0 50px -12px rgba(13, 148, 136, 0.15), 0 0 0 1px rgba(30, 41, 59, 0.8);
          background-color: #020617;
          position: relative;
        }
      }
    </style>
    <script type="module" crossorigin src="./assets/index-DSCc7arU.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-BHQlbIQx.css" />
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950 min-h-screen overflow-x-hidden">
    <div id="root"></div>
  </body>
</html>
`;
  fs.writeFileSync(path.resolve(distDir, 'index.html'), htmlContent);
  console.log('[Build] Generated dist/index.html');

  // 4. Generate Web App Manifest
  const manifestContent = {
    name: "HAIR OS Pro",
    short_name: "HAIR OS",
    description: "Server-Free Hair Care Routine & Hair Lab",
    start_url: "./index.html",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "./app_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "./favicon.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.resolve(distDir, 'manifest.json'), JSON.stringify(manifestContent, null, 2));
  console.log('[Build] Generated dist/manifest.json');

  // 5. Keep backward-compatibility by copying bundle to apk_extracted
  const apkTarget = path.resolve(__dirname, '../apk_extracted/assets/public/assets/index-DSCc7arU.js');
  if (fs.existsSync(path.dirname(apkTarget))) {
    fs.copyFileSync(path.resolve(distAssetsDir, 'index-DSCc7arU.js'), apkTarget);
    console.log('[Build] Synced bundle to apk_extracted/assets/public/assets/index-DSCc7arU.js');
  }

  console.log('✨ [Build] Hair OS Website & App Build complete in dist/ ✨');
}

build().catch((err) => {
  console.error('[Build] Build Failed:', err);
  process.exit(1);
});
