import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Scans for utility files that are tracked and unchanged in git, 
 * ensures they don't have existing tests, and creates a test skeleton 
 * for the first one found.
 */
function main() {
  try {
    // 1. Get all tracked files via git
    const trackedFiles = execSync('git ls-files', { encoding: 'utf-8' })
      .split(/\r?\n/)
      .map(f => f.trim())
      .filter(Boolean);

    // 2. Filter for utilities/* and utilities.ts
    const utilityFiles = trackedFiles.filter(f => {
      const isTs = f.endsWith('.ts') || f.endsWith('.tsx');
      if (!isTs) return false;

      const parts = f.split('/');
      const fileName = parts[parts.length - 1];
      const isUtilityFileName = fileName === 'utilities.ts' || fileName === 'utilities.tsx';
      const isInUtilitiesDir = parts.includes('utilities');

      return isUtilityFileName || isInUtilitiesDir;
    });

    // 3. Filter for unchanged files (those not in git status)
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
    const dirtyFiles = new Set(
      statusOutput.split(/\r?\n/)
        .map(line => {
          if (!line || line.length < 4) return '';
          // Porcelain V1: XY PATH
          let content = line.slice(3).trim();
          if (content.startsWith('"') && content.endsWith('"')) {
            content = content.slice(1, -1);
          }
          
          if (line.startsWith('R')) {
             const parts = content.split(' -> ');
             return (parts[1] || parts[0]).replace(/\\/g, '/');
          }
          return content.replace(/\\/g, '/');
        })
        .filter(Boolean)
    );

    const unchangedFiles = utilityFiles.filter(f => !dirtyFiles.has(f));

    // 4. Filter out files that already have tests
    const eligibleFiles = unchangedFiles.filter(f => {
      const ext = path.extname(f);
      const base = f.slice(0, -ext.length);
      
      const tests = [
        `${base}.test.ts`,
        `${base}.test.tsx`,
        `${base}.spec.ts`,
        `${base}.spec.tsx`,
      ];

      return !tests.some(t => fs.existsSync(t));
    });

    if (eligibleFiles.length === 0) {
      return;
    }

    // 5. Create test file for the first one found
    const targetFile = eligibleFiles[0];
    const ext = path.extname(targetFile);
    const fileName = path.basename(targetFile, ext);
    const testFile = targetFile.replace(new RegExp(`\\${ext}$`), `.test${ext}`);

    const template = `import { describe, it, expect } from 'vitest';
// import {} from './${fileName}';

describe('${fileName}', () => {
  it('should be tested', () => {
    expect(true).toBe(true);
  });
});
`;

    fs.writeFileSync(testFile, template);

    // 6. Print the result path
    console.log(testFile);
  } catch (err) {
    process.exit(1);
  }
}

main();
