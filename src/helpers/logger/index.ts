import chalk from 'chalk';
import moment from 'moment';

const { cyan, green, red, yellow } = chalk;
const dot = '•';
const banner = (title: string) => `${title} ` + dot;
const greenBanner = (title: string) => green(banner(title));
const redBanner = (title: string) => red(banner(title));
const yellowBanner = (title: string) => yellow(banner(title));
const now = () => cyan(moment().format('DD-MM-YYYY HH:mm:ss.SSS (Z)').toString() + ' ' + dot);

export class Logger {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  public error(...args: any[]) {
    console.error(`${now()} ${redBanner(this.title)}`, ...args);
  }

  public info(...args: any[]) {
    console.log(`${now()} ${greenBanner(this.title)}`, ...args);
  }

  public warn(...args: any[]) {
    console.warn(`${now()} ${yellowBanner(this.title)}`, ...args);
  }
}
