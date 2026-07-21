import { MultiBar, Presets } from "cli-progress";
import { readAllExplorerRecords } from "./crud";
import { transformExplorerFileRecordReport } from "./transformers";
import { readExplorerDriveData } from "./extractors";
import { LogApi } from "@/main/shared";

export const statusSummary = async ({ log }: LogApi) => {
  const [recordReport, { capacity }] = await Promise.all([
    log('Reading explorer records', async ({ setStatus }) => {
      const records = await readAllExplorerRecords();
      const report = transformExplorerFileRecordReport(records);
      setStatus('information', [
        `There are records for ${report.records.total} files,`,
        `${report.records.status.scan} remaining files to scan,`,
        `and ${report.records.status.traverse} to traverse.`,
      ].join(' '));
      return report;
    }),
    log('Getting disk capacity', readExplorerDriveData)
  ]);
  // const [
  //   { result: recordReport },
  //   { result: { capacity } },
  //   // { result: windowsFileCount }
  // ] = await task.group((task) => [
  //   task('Reading explorer records', async ({ setOutput }) => {
  //     const records = await readAllExplorerRecords();
  //     const report = transformExplorerFileRecordReport(records);
  //     setOutput([
  //       `There are records for ${report.records.total} files,`,
  //       `${report.records.status.scan} remaining files to scan,`,
  //       `and ${report.records.status.traverse} to traverse.`,
  //     ].join(' '));
  //     return report;
  //   }),
  //   task('Getting disk capacity', readExplorerDriveData),
  //   // task('Counting files', extractWindowsFileCount),
  // ]);
  const {
    records: { latest, remaining, total },
    usage,
  } = recordReport;
  // const windowsFileCount = await extractWindowsFileCount();
  // const usagePc = ((usage / capacity) * 100).toFixed(3);

  // const numerator = Math.min(total, windowsFileCount);
  // const denominator = Math.max(total, windowsFileCount);
  // const insertion = (numerator / denominator).toFixed(3);
  const showCapacity = total / 1 >= 0.99;
  const summary = {
    // (Scanned + toScan) / total is the amount of files we have as records.
    files: {
      // insertion: total / windowsFileCount, // Insertion progress
      // Progress bar is basically scanned vs recorded, and recorded vs total
      recorded: total,
      remaining,
      scanned: total - remaining, // Files already scanned.
      // toScan: remaining, // Files to scan.
      // total: windowsFileCount, // All files on the drive.
    },
    latest,
    // If > 99% of files are recorded, we can probably conclude that 
    space: {
      capacity,
      showCapacity,
      usage,
    },
  };

  return summary;
};

const printProgress = (bars: { label: string; value: number; maximum: number; }[]) => {
  const multibar = new MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: ' {bar} | {label} | {percentage}% | {value}/{maximum}',
  }, Presets.shades_grey);
  bars.forEach(({ label, value, maximum }) => {
    const percentage = ((value / maximum) * 100).toFixed(3)
    multibar.create(maximum, 0).update(value, { label, maximum, percentage, value });
  });
  // const recordedFiles = multibar.create(total, 0);
  // recordedFiles.update(recorded, { label: 'Recorded files', percentage: ((recorded / total) * 100).toFixed(3) });
  // const scannedFiles = multibar.create(total, 0);
  // scannedFiles.update(scanned, { label: 'Scanned files', percentage: ((scanned / total) * 100).toFixed(3) });
  // const spaceUsageRecorded = multibar.create(capacity, 0);
  // spaceUsageRecorded.update(usage, { label: 'Space usage recorded', percentage: ((usage / capacity) * 100).toFixed(3) });
  // const spaceUsageProjected = multibar.create(capacity, 0);
  // spaceUsageProjected.update(usage, { label: 'Space usage recorded', percentage: ((usage / capacity) * 100).toFixed(3) });
  multibar.stop();
};

export const printSummary = ({
  files: { recorded, remaining, scanned },
  latest, space: { capacity, usage, showCapacity }
}: Awaited<ReturnType<typeof statusSummary>>) => {
  console.log(`Last updated ${latest.relative} ago @ ${latest.absolute.toLocaleString()}`)
  // console.table([
  //   { "": "Files", value: progress, pc: remaining, maximum: total },
  //   { "": "Disk", value: usage, pc: usagePc, maximum: capacity },
  // ]);
  printProgress([
    { label: 'Scanned records', value: scanned, maximum: recorded },
    // { label: 'Recorded files', value: recorded, maximum: remaining },
    // { label: 'Scanned files', value: scanned, maximum: total },
    { label: 'Space usage recorded', value: usage, maximum: capacity },
    // { label: 'Space usage projected', value: usage, maximum: capacity },
  ]);
  // const multibar = new MultiBar({
  //   clearOnComplete: false,
  //   hideCursor: true,
  //   format: ' {bar} | {label} | {percentage}% | {value}/{total}',
  // }, Presets.shades_grey);
  // const scannedRecords = multibar.create(recorded, 0);
  // scannedRecords.update(scanned, { label: 'Scanned records', percentage: ((scanned / recorded) * 100).toFixed(3) });
  // const recordedFiles = multibar.create(total, 0);
  // recordedFiles.update(recorded, { label: 'Recorded files', percentage: ((recorded / total) * 100).toFixed(3) });
  // const scannedFiles = multibar.create(total, 0);
  // scannedFiles.update(scanned, { label: 'Scanned files', percentage: ((scanned / total) * 100).toFixed(3) });
  // const spaceUsageRecorded = multibar.create(capacity, 0);
  // spaceUsageRecorded.update(usage, { label: 'Space usage recorded', percentage: ((usage / capacity) * 100).toFixed(3) });
  // const spaceUsageProjected = multibar.create(capacity, 0);
  // spaceUsageProjected.update(usage, { label: 'Space usage recorded', percentage: ((usage / capacity) * 100).toFixed(3) });

  // // control bars
  // b1.increment();
  // b2.update(20, {filename: "test1.txt"});
  // b1.update(20, {filename: "helloworld.txt"});

  // // stop all bars
  // multibar.stop();
  // console.log(`Latest: ${summary.latest}`);
  // console.log(`Progress: ${summary.progress}`);
  // console.log(`Total: ${summary.total}`);
  // console.log(`Usage: ${summary.usage}`);
  // console.log(`Capacity: ${summary.capacity}`);
  // console.log(`Usage Pc: ${summary.usagePc}`);
};
