// Here is the current work context:
// - Files modified recently
// - Files currently staged
// - Files imported by those files
// - Files that depend on those files
// - TODO comments nearby
// - Functions with no tests
// - Functions with obvious smells (long, duplicated, unused)


// 1. Start with git status
// This gives you the “active zone” — the files you’re touching.
// 2. If nothing is staged/modified, fall back to mtimes
// Sort by fs.statSync(file).mtimeMs and take the top N.
// 3. Pull in imports
// You already have a file‑reading utility.
// Scan for:
// import ... from "..."


// Resolve relative imports.
// Add those files to the context.
// 4. Pull in dependents
// Search for files that import the ones above.
// This gives you the “blast radius”.
// 5. Pull in TODOs
// A simple regex:
// /\/\/\s*TODO[:]?(.+)/


// 6. Pull in test coverage gaps
// You already know how to detect existing test files.
// If a file has no test, flag it.
// 7. Pull in smells
// You don’t need a linter — just simple heuristics:
// - functions > 50 lines
// - files > 300 lines
// - duplicate function names
// - unused exports (via knip or your own scan)
// This is enough to give the model something meaningful.

/**
 * Scans the dirty and untracked files and suggests what to move forward with
 * next.
 */
// export const currentWorkflowCommentary = async () => {
//   console.info('Running unit test file creator.');
//   try {
//     // 1. Get all tracked files via git
//     const trackedFiles = execSync('git ls-files', { encoding: 'utf-8' })
//       .split(/\r?\n/)
//       .map(f => f.trim())
//       .filter(Boolean);

//     const unusedFiles = fetchUnusedFiles();

//     // 2. Filter for utilities/* and utilities.ts
//     const utilityFiles = trackedFiles.filter(f => {
//       // We're only interested in TS files.
//       const isTs = f.endsWith('.ts') || f.endsWith('.tsx');
//       if (!isTs) return false;

//       // We're not interested in writing tests for existing test files.
//       const isTest = f.endsWith('.test.ts') || f.endsWith('.test.tsx');
//       if (isTest) return false;

//       const parts = f.split('/');
//       const fileName = parts[parts.length - 1];

//       // Barrels shouldn't contain logic.
//       if (fileName === 'index.ts') return false;

//       const isUtilityFileName = fileName === 'utilities.ts'
//         || fileName === 'utilities.tsx';
//       const isInUtilitiesDir = parts.includes('utilities');

//       return isUtilityFileName || isInUtilitiesDir;
//     });

//     // 3. Filter for unchanged files (those not in git status)
//     const statusOutput = execSync(
//       'git status --porcelain',
//       { encoding: 'utf-8' }
//     );
//     const dirtyFiles = new Set(
//       statusOutput.split(/\r?\n/)
//         .map(line => {
//           if (!line || line.length < 4) return '';
//           // Porcelain V1: XY PATH
//           let content = line.slice(3).trim();
//           if (content.startsWith('"') && content.endsWith('"')) {
//             content = content.slice(1, -1);
//           }
          
//           if (line.startsWith('R')) {
//              const parts = content.split(' -> ');
//              return (parts[1] || parts[0]).replace(/\\/g, '/');
//           }
//           return content.replace(/\\/g, '/');
//         })
//         .filter(Boolean)
//     );

//     const unchangedFiles = utilityFiles.filter(f => !dirtyFiles.has(f));

//     const liveFiles = unchangedFiles.filter(f => !unusedFiles.includes(f));

//     // 4. Filter out files that already have tests
//     const eligibleFiles = liveFiles.filter(f => {
//       const ext = path.extname(f);
//       const base = f.slice(0, -ext.length);
      
//       const tests = [
//         `${base}.test.ts`,
//         `${base}.test.tsx`,
//       ];

//       return !tests.some(t => fs.existsSync(t) && fs.statSync(t).size > 0);
//     });

//     if (eligibleFiles.length === 0) {
//       console.info('No eligible files found.');
//       return;
//     }

//     // 5. Create test file for the first one found
//     const targetFile = eligibleFiles[0];
//     const ext = path.extname(targetFile);
//     const testFile = targetFile.replace(new RegExp(`\\${ext}$`), `.test${ext}`);

//     console.info(`Writing test file for ${targetFile} to ${testFile}.`);
    
//     const prompt = getPromptToUnitTestUtilities(targetFile, testFile);

//     const response = await analyseLanguage(prompt);

//     const cleanedResponse = extractRawCode(response);

//     // TODO: Skip for --dry-run
//     fs.writeFileSync(testFile, cleanedResponse);

//     // 6. Print the result path
//     console.log(testFile);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }
