const chalk = require("chalk");

const Info = (info) => {
    const now = new Date().toLocaleString("th-TH", { timeZone: "UTC" });
    console.log(chalk.cyan.bold("[INFO " + now + "]: ") + info);
};

const Warning = (warning) => {
    const now = new Date().toLocaleString("th-TH", { timeZone: "UTC" });
    console.log(chalk.yellow.bold("[WARNING " + now + "]: ") + warning);
};

const Error = (error) => {
    const now = new Date().toLocaleString("th-TH", { timeZone: "UTC" });
    console.log(chalk.red.bold("[ERROR " + now + "]: ") + error);
};

module.exports = {
    Info,
    Warning,
    Error,
};
