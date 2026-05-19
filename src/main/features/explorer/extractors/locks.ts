import { execFile } from 'child_process';
import { promisify } from 'util';
import { LockingProcess } from '../../../../shared/features/explorer/types';

const execFileAsync = promisify(execFile);

/**
 * Finds all processes locking a specific file or folder path.
 * @param targetPath The absolute path to the file or directory.
 */
export async function findLockingProcesses(targetPath: string): Promise<LockingProcess[]> {
  // A clean PowerShell script that yields only "ProcessName,PID" lines
  console.log('targetPath', targetPath)
  const cleanPath = targetPath.endsWith('\\') ? targetPath : `${targetPath}\\`;
  console.log('cleaned path', cleanPath)
  const script = `
    Get-Process | Where-Object {
      $proc = $_;
      try {
        $proc.Modules | Where-Object { $_.FileName -like "${cleanPath}*" } | ForEach-Object {
          "$($proc.Name),$($proc.Id),$($_.FileName)"
        }
      } catch {}
    }
  `;

  try {
    const { stdout, stderr } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-Command', script
    ]);
    console.log('locking output', stdout)

    if (stderr) throw new Error(stderr);

    if (!stdout.trim()) return [];

    const results: LockingProcess[] = [];
    const seenPids = new Set<number>();

    stdout.trim().split('\n').forEach(line => {
      if (!line.includes(',')) return;
      const [processName, pidStr, lockedFile] = line.split(',');
      const pid = parseInt(pidStr.trim(), 10);

      if (!seenPids.has(pid)) {
        seenPids.add(pid);
        results.push({
          processName: processName.trim(),
          pid,
          fileName: lockedFile.trim()
        });
      }
    });

    return results;

    // return stdout
    //     .trim()
    //     .split('\n')
    //     .map(line => {
    //         const [processName, pidStr] = line.split(',');
    //         return {
    //             processName: processName.trim(),
    //             pid: parseInt(pidStr.trim(), 10)
    //         };
    //     });
  } catch (error) {
    console.error("Failed to query file locks:", error);
    throw error;
  }
}
