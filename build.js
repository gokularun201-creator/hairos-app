const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('[Build] Starting esbuild bundle for Hair OS...');

  const outDir = path.resolve(__dirname, 'dist/assets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const result = await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/main.tsx')],
    bundle: true,
    format: 'esm',
    minify: false, // keep readable/debuggable or true for production
    target: ['es2020', 'chrome100'],
    outfile: path.resolve(outDir, 'index-DSCc7arU.js'),
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

  console.log('[Build] Bundle complete! Output written to dist/assets/index-DSCc7arU.js');

  // Copy bundle to apk_extracted/assets/public/assets/index-DSCc7arU.js
  const apkTarget = path.resolve(__dirname, '../apk_extracted/assets/public/assets/index-DSCc7arU.js');
  fs.copyFileSync(path.resolve(outDir, 'index-DSCc7arU.js'), apkTarget);
  console.log('[Build] Copied to apk_extracted/assets/public/assets/index-DSCc7arU.js');
}

build().catch((err) => {
  console.error('[Build] Failed:', err);
  process.exit(1);
});
