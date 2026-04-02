import ts from "typescript";
import path from "node:path";
import fs from "node:fs";
import { OrchestratorReport } from "./types";

// type ReportKey = keyof OrchestratorReport;
// const reportKeys: ReportKey[] = [
//   '_description',
//   'current',
//   'files',
//   'summary',
// ];

// export const validateReport = (data: any) => {
  
// };

export const getOrchestratorRunState = ({
  current: { last: { ended, started } }
}: OrchestratorReport) => {
  const isFirstRun = ended === 0;
  const hasRunBefore = started > 0;
  const isRunning = started > ended;
  return {
    hasRunBefore,
    isFirstRun,
    isRunning,
  };
};

export function getImportedFilesRecursive(entryFile: string): string[] {
  const visited = new Set<string>();
  const results: string[] = [];

  function visit(filePath: string) {
    const abs = path.resolve(filePath);
    if (visited.has(abs)) return;
    visited.add(abs);

    if (!fs.existsSync(abs)) return;

    const source = fs.readFileSync(abs, "utf8");
    const sourceFile = ts.createSourceFile(
      abs,
      source,
      ts.ScriptTarget.Latest,
      true
    );

    const imports = getImportsFromSourceFile(sourceFile, abs);

    for (const imported of imports) {
      results.push(imported);
      visit(imported);
    }
  }

  visit(entryFile);
  return results;
}

function getImportsFromSourceFile(sourceFile: ts.SourceFile, basePath: string): string[] {
  const imports: string[] = [];

  function resolveImport(specifier: string): string | null {
    // Only follow relative imports
    if (!specifier.startsWith(".")) return null;

    const full = path.resolve(path.dirname(basePath), specifier);

    // Try .ts, .tsx, .js, .mjs, .cjs, index.ts, etc.
    const candidates = [
      full,
      full + ".ts",
      full + ".tsx",
      full + ".js",
      full + ".mjs",
      full + ".cjs",
      path.join(full, "index.ts"),
      path.join(full, "index.tsx"),
      path.join(full, "index.js"),
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }

    return null;
  }

  ts.forEachChild(sourceFile, node => {
    // import ... from "x"
    if (ts.isImportDeclaration(node)) {
      const spec = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
      const resolved = resolveImport(spec);
      if (resolved) imports.push(resolved);
    }

    // export ... from "x"
    if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const spec = node.moduleSpecifier.text;
      const resolved = resolveImport(spec);
      if (resolved) imports.push(resolved);
    }

    // require("x")
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(sourceFile) === "require" &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const spec = node.arguments[0].text;
      const resolved = resolveImport(spec);
      if (resolved) imports.push(resolved);
    }
  });

  return imports;
}
