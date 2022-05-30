const callerId = require("caller-id");
class Logger {
  constructor(useProductionAPI=false) {
    this.mode = process.mode
    this.color = process.mode === "production" ? "#43bb88" : "orange"
    this.version = process.env.version ? process.env.version : "DEV_TEST"
    this.coreVersion = process.env.coreVersion ? process.env.coreVersion : "DEV_TEST"
    this.useProductionAPI = useProductionAPI
    if (process.mode === "development") {
      if (!useProductionAPI) {
        this.apiUrl = "http://127.0.0.1:5000"
      } else {
        this.apiUrl = "https://api.daziannetwork.com"
      }
    } else {
      this.apiUrl = "https://api.daziannetwork.com"
    }
  };

  initialize() {
    // eslint-disable-next-line no-console
    console.log(
      `${process.env.logo}\n` +
      `Version ${this.version}-${this.mode}. ` +
      `Powered by mighty-nuxt-core ${this.coreVersion}.`,
      `color: ${this.color}; font-size: 20px; font-weight: bold;`
    )
    if (process.mode === "development") {
      if (this.useProductionAPI) {
        // eslint-disable-next-line no-console
        console.warn("%c!!! Using (Overridden) Production API Server: " +
          "It can cause unexpected behaviors.",
          "color: orange; font-size: 20px; font-weight: bold;")
      }
    }
  };

  static #formatCaller(callerData) {
    if (process.mode === "development") {
      return "[" + callerData.filePath + ":" + callerData.lineNumber + "] " +
        "[" + callerData.typeName + " " + callerData.functionName + "]";
    } else {
      return "[Production Mode]"
    }
  };

  debug(...text) {
    if (process.mode === "development") {
      const callerData = callerId.getData(this.debug);
      text.forEach((content) => {
        // eslint-disable-next-line no-console
        console.log(`${Logger.#formatCaller(callerData)}: ${content}`);
      })
    }
  };

  error(...messageList) {
    const callerData = callerId.getData(this.error);
    let errorContent = "";
    messageList.forEach((content) => {
      errorContent = String.prototype.concat(errorContent, content);
    });
    // eslint-disable-next-line no-console
    console.log(`${Logger.#formatCaller(callerData)}: ${errorContent}`);
  }
}

const logger = new Logger();

export default logger;
