const callerId = require("caller-id");

const logger = {
  mode: process.mode,
  color: process.mode==="production" ? "#43bb88" : "orange",
  version: process.env.version ? process.env.version : "DEV_TEST",
  coreVersion: process.env.coreVersion ? process.env.coreVersion : "DEV_TEST",
  apiUrl: process.mode==="production" ?
    "https://api.daziannetwork.com" :
    "http://127.0.0.1:5000",
  initialize() {
    window.logger = logger;
    // eslint-disable-next-line no-console
    console.log(
      `${process.env.logo}\n` +
      `Version ${this.version}-${this.mode}. ` +
      `Powered by mighty-nuxt-core ${this.coreVersion}.`,
      `color: ${this.color}; font-size: 20px; font-weight: bold;`
    )
    if (process.mode === "development") {
      // eslint-disable-next-line no-console
      console.warn("%c!!! Development Mode: " +
        "Outputting debugging messages. " +
        "Make sure it has been set to production mode when generating.",
        "color: orange; font-size: 20px; font-weight: bold;")
    }
  },
  formatCaller(callerData) {
    if (process.mode === "development") {
      return "[" + callerData.filePath + ":" + callerData.lineNumber + "] " +
        "[" + callerData.typeName + " " + callerData.functionName + "]";
    }
  },
  debug(...text) {
    if (process.mode === "development") {
      const callerData = callerId.getData(this.debug);
      text.forEach((content) => {
        // eslint-disable-next-line no-console
        console.log(`${this.formatCaller(callerData)}: ${content}`);
      })
    }
  },
  error(...messageList) {
    const callerData = callerId.getData(this.error);
    let errorContent = "";
    messageList.forEach((content) => {
      errorContent = String.prototype.concat(errorContent, content);
    });
    // eslint-disable-next-line no-console
    console.log(`${this.formatCaller(callerData)}: ${errorContent}`);
  }
};

export default logger;
