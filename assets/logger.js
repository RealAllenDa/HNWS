const callerId = require("caller-id");

const logo = Buffer.from("JWMgICAgX18gIF9fXyAgIF9fXyAgICAgICBfX19fX19fD" +
  "QogICAvIC8gLyAvIHwgLyAvIHwgICAgIC8gLyBfX18vDQogIC8gL18vIC8gIHwvIC98IHwgL" +
  "3wgLyAvXF9fIFwgDQogLyBfXyAgLyAvfCAgLyB8IHwvIHwvIC9fX18vIC8gDQovXy8gL18vX" +
  "y8gfF8vICB8X18vfF9fLy9fX19fLyAgDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgI" +
  "CAgDQo=", 'base64').toString()

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
    console.log(
      `${logo}\n` +
      `Version ${this.version}-${this.mode}. ` +
      `Powered by mighty-nuxt-core ${this.coreVersion}.`,
      `color: ${this.color}; font-size: 20px; font-weight: bold;`
    )
    if (process.mode === "development") {
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
        console.log(this.formatCaller(callerData), ": ", content);
      })
    }
  }
};

export default logger;
