type FileGroups = Record<string, string[]>;

function groupFilesByFolders(filePaths: string[], folderPaths: string[]): FileGroups {
  // Initialize groups with empty arrays
  const groups: FileGroups = { unmatched: [] };
  folderPaths.forEach(folder => groups[folder] = []);

  // Sort folders by length (descending) so most specific paths match first
  const sortedFolders = [...folderPaths].sort((a, b) => b.length - a.length);

  filePaths.forEach(filePath => {
    // Find the first (most specific) folder that matches the start of the path
    const match = sortedFolders.find(folder => filePath.startsWith(folder));
    
    if (match) {
      groups[match].push(filePath);
    } else {
      groups.unmatched.push(filePath);
    }
  });

  return groups;
}

// Example Usage:
const targetFolders = [
  "src/components",
  "src/components/common",
  "src/hooks",
  "tests"
];

const dirtyFiles = [
  "src/components/Button.tsx",
  "src/components/common/Icon.tsx",
  "src/hooks/useAuth.ts",
  "tests/app.spec.ts",
  "package.json"
];

const result = groupFilesByFolders(dirtyFiles, targetFolders);
console.log(result);
