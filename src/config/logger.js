const chalk = require('chalk');
const moment = require('moment');

const Info = (info) => {
  const now = moment().format('DD/MM/YYYY HH:mm:ss');
  console.log(chalk.cyan.bold(`[INFO ${now}]: `) + info);
};

const Warning = (warning) => {
  const now = moment().format('DD/MM/YYYY HH:mm:ss');
  console.log(chalk.yellow.bold(`[WARNING ${now}]: `) + warning);
};

const Error = (error) => {
  const now = moment().format('DD/MM/YYYY HH:mm:ss');
  console.log(chalk.red.bold(`[ERROR ${now}]: `) + error);
};

module.exports = {
  Info,
  Warning,
  Error,
};
