import { formatPercentage as formatPercentageBase } from "@/shared/utilities";
import {
  ExplorerFileRecordAction,
  explorerFileRecordActionEnum,
  explorerFileRecordActionValues,
  ExplorerFileRecordProps
} from "@/shared/features/explorer";
import { ANSI_COLOUR_MAP } from "@/main/shared";
import {
  DiskDriveCapacityExtraction,
  ExplorerUsageProgressSnapshot
} from "../types";

const hydrateActionBreakdown = (cb: (a: ExplorerFileRecordAction) => number) => Object.fromEntries(
  explorerFileRecordActionValues.map((action) => [action, cb(action)])
) as Record<ExplorerFileRecordAction, number>;

export const transformSnapshot = (
  allFileRecords: ExplorerFileRecordProps[]
): ExplorerUsageProgressSnapshot => {
  const aggregation = allFileRecords.reduce((acc, { isDirectory, ...record }) => {
    const action = {
      ...acc.action, [record.action]: acc.action[record.action] + 1
    };
    const scanned = record.usage !== undefined ? acc.scanned + 1 : acc.scanned;
    const total = acc.total + 1;
    const usage = acc.usage + (!isDirectory && record.usage ? record.usage : 0);
    return { action, scanned, total, usage };
  }, { action: hydrateActionBreakdown(() => 0), scanned: 0, total: 0, usage: 0 });
  const proportion = aggregation.scanned / aggregation.total;
  return {
    ...aggregation,
    proportion,
    formatted: `${(proportion * 100).toFixed(1)}%`,
  };
}

const formatQuantity = (
  quantity: number
) => {
  const colour = quantity < 0
    ? ANSI_COLOUR_MAP.red
    : quantity > 0
      ? ANSI_COLOUR_MAP.green
      : '';
  return [
    colour,
    quantity < 0 ? '' : '+',
    quantity,
    ANSI_COLOUR_MAP.reset,
  ].join('');
}
const formatDeltaPrefix = (
  quantity: number
) => {
  const colour = quantity < 0
    ? ANSI_COLOUR_MAP.red
    : quantity > 0
      ? ANSI_COLOUR_MAP.green
      : '';
  return [
    colour,
    quantity < 0 ? '' : '+',
  ].join('');
}
const formatPercentage = (quantity: number) => formatPercentageBase(
  quantity, { decimalPlaces: 1 }
);

const formatProportion = (
  proportion: number
) => {
  return [
    '(',
    formatDeltaPrefix(proportion),
    formatPercentage(proportion),
    ANSI_COLOUR_MAP.reset,
    ')',
  ].join('');
}

const formatDeltaQuantity = (
  initial: number, final: number
) => {
  if (initial === final) return final;
  return `${initial} -> ${final}`;
}

const units = [
  { label: 'GB', magnitude: 1024 * 1024 * 1024 },
  { label: 'MB', magnitude: 1024 * 1024 },
  { label: 'KB', magnitude: 1024 },
];
const getByteUnit = (bytes: number) => units.find(
  ({ magnitude }) => bytes >= magnitude
) ?? { label: 'Bytes', magnitude: 1 };
const formatBytes = (
  bytes: number
) => {
  const unit = getByteUnit(bytes);
  return [(bytes / unit.magnitude).toFixed(1), unit.label].join('');
}

const formatQuantityLine = (
  label: string,
  initial: number, final: number, progress: number, proportion: number
) => [
  label, ': ',
  formatDeltaQuantity(initial, final), ANSI_COLOUR_MAP.reset,
  `[${formatQuantity(progress)}]`,
  formatProportion(proportion)
].join('');

export const transformProgress = (
  initial: ExplorerUsageProgressSnapshot,
  final: ExplorerUsageProgressSnapshot,
  {
    formatted: diskFormatted,
    raw: { used: diskUsage }
  }: DiskDriveCapacityExtraction
) => {
  const progress = {
    total: final.total - initial.total,
    scanned: final.scanned - initial.scanned,
    usage: final.usage - initial.usage,
    action: hydrateActionBreakdown(
      (action) => final.action[action] - initial.action[action]
    ),
  };
  const proportion = {
    total: initial.total ? (progress.total / initial.total) : 0,
    scanned: initial.scanned ? (progress.scanned / initial.scanned) : 0,
    usage: initial.usage ? (progress.usage / initial.usage) : 0,
    action: hydrateActionBreakdown(
      (action) => initial.action[action] ? (progress.action[action] / initial.action[action]) : 0
    ),
  };
  const formatted = [
    formatQuantityLine(
      'Files registered',
      initial.total, final.total, progress.total, proportion.total
    ),
    // [
    //   `Files registered: ${formatDeltaQuantity(initial.total, final.total)}${ANSI_COLOUR_MAP.reset}`,
    //   `[${formatQuantity(progress.total)}]`,
    //   formatProportion(proportion.total)
    // ].join(''),
    formatQuantityLine(
      'Files scanned',
      initial.scanned, final.scanned, progress.scanned, proportion.scanned
    ),
    // [
    //   `Files scanned: ${formatDeltaQuantity(initial.scanned, final.scanned)}${ANSI_COLOUR_MAP.reset}`,
    //   `[${formatQuantity(progress.scanned)}]`,
    //   formatProportion(proportion.scanned)
    // ].join(''),
    [
      `Usage registered: ${formatBytes(final.usage)}`,
      ANSI_COLOUR_MAP.reset,
      `(${formatPercentage(final.usage / diskUsage)})`,
      `[${formatDeltaPrefix(progress.usage)}${formatBytes(progress.usage)}${ANSI_COLOUR_MAP.reset}]`,
      formatProportion(proportion.usage)
    ].join(' '),
    [
      `Disk capacity: ${diskFormatted.gb.used} / ${diskFormatted.gb.size}`,
      `(${diskFormatted.pc.used} used)`,
      ANSI_COLOUR_MAP.reset
    ].join(' '),
    ...explorerFileRecordActionValues.map((action) => formatQuantityLine(
      `Records marked ${action === 'none' ? 'no action' : action}`,
      initial.action[action], final.action[action], progress.action[action], proportion.action[action]
    )),
  ];
  return {
    formatted,
  }
};
