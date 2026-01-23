const ansi = {
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
};

const colours = {
  success: ansi.green,
  error: ansi.red,
  warn: ansi.yellow,
  info: ansi.cyan,
  default: 'default',
};

type Colours = keyof typeof colours;

export const log = (
  message: string,
  colour: Colours = 'default'
) => console.log([
  `[${new Date().toLocaleString()}]:`,
  [
    colours[colour],
    message,
    ansi.reset
  ].join(''),
].join(' '));
