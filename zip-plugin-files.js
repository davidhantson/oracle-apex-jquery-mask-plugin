import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';

const ZIP_FOLDER = 'plugin';
const ZIP_OUT = ZIP_FOLDER + '/plugin-files.zip';
const DIST    = 'dist';

/* 1. controleer of dist/ bestaat ------------------------------------ */
if (!existsSync(DIST)) {
  console.error('❌  dist/ not found – run "npm run build" first.');
  process.exit(1);
}

/* 2. zorg dat doelmap bestaat --------------------------------------- */
if (!existsSync(ZIP_FOLDER)) mkdirSync(ZIP_FOLDER);

/* 3. verwijder vorige zip (indien aanwezig) ------------------------- */
execSync(`rimraf ${ZIP_OUT}`);

/* 4. zip:  -j = "junk paths"  (geen map-structuur)                   */
execSync(`zip -rqj ${ZIP_OUT} ${DIST}/*`, { stdio: 'inherit' });

console.log(`✅  ${ZIP_OUT} bijgewerkt (flattened inhoud van dist/)`);