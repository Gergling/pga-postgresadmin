export const ANSI_COLOUR_MAP = {
  reset: "\x1b[0m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  boldBlack: '\\e[1;30m',
  boldRed: '\\e[1;31m',
  boldGreen: '\\e[1;32m',
  boldYellow: '\\e[1;33m',
  boldBlue: '\\e[1;34m',
  boldPurple: '\\e[1;35m',
  boldCyan: '\\e[1;36m',
  boldWhite: '\\e[1;37m',
} as const;

type AnsiColourMap = typeof ANSI_COLOUR_MAP;

export const UNICODE_ICON_MAP = {
  arrowRight: '➟',
  bug: '🐛',
  chevronRight: '⪢',
  check: '✅',
  cross: '❌',
  hazard: '⚠️',
  hourglass: '⏳',
  information: 'ℹ️',
} as const;

type UnicodeIconMap = typeof UNICODE_ICON_MAP;

export const INDENT = '  ';

type ConfigTemplate = Record<string, {
  icon: keyof typeof UNICODE_ICON_MAP; colour: keyof AnsiColourMap;
}>;

const createConfig = <T extends ConfigTemplate>(
  config: T
) => Object.fromEntries(Object.entries(config).map(
  ([key, value]) => [key, {
    colour: ANSI_COLOUR_MAP[value.colour],
    icon: UNICODE_ICON_MAP[value.icon],
    name: key
  }]
)) as { [K in keyof T]: {
  colour: AnsiColourMap[T[K]['colour']];
  icon: UnicodeIconMap[T[K]['icon']];
  name: K;
} };

export const LOG_STATUS_CONFIG = createConfig({
  success: { icon: 'check', colour: 'green' },
  error: { icon: 'cross', colour: 'red' },
  debug: { icon: 'bug', colour: 'purple' },
  warning: { icon: 'hazard', colour: 'yellow' },
  information: { icon: 'information', colour: 'cyan' },
  awaiting: { icon: 'hourglass', colour: 'reset' },
});

export type TaskStatus = keyof typeof LOG_STATUS_CONFIG;
