import chalk from 'chalk';
import moment from 'moment';

const { cyan, green, red, yellow } = chalk;
const dot = '•';
const banner = (title: string) => `${title} ` + dot;
const greenBanner = (t = 'App') => green(banner(t));
const redBanner = (t = 'App') => red(banner(t));
const yellowBanner = (t = 'App') => yellow(banner(t));
const now = () => cyan(moment().format('DD-MM-YYYY HH:mm:ss.SSS (Z)').toString() + ' ' + dot);

export class Logger {
  private title?: string;

  constructor(title?: string) {
    this.title = title;
  }

  public error(...args: any[]) {
    console.error.call(undefined, `${now()} ${redBanner(this.title)}`, ...args);
  }

  public info(...args: any[]) {
    console.log(`${now()} ${greenBanner(this.title)}`, ...args);
  }

  public warn(...args: any[]) {
    console.warn(`${now()} ${yellowBanner(this.title)}`, ...args);
  }
}
