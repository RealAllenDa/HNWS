const callerId = require("caller-id");

const logo = Buffer.from("JWMgIF8gIF8gICAgICAgICAgICA" +
  "gICAgICAgICAgICBfICAgICAgICAgICAgICAgICAg" +
  "XyAgICAgICBfICBfICAgICAgICAgXyAgIAogfCB8f" +
  "CB8X19fIF8gX18gIF9fXyBfIF8gIF9fX3wgfF9fX" +
  "yBfXyBfX19fXyBfIF98IHxfX19fX3wgXHwgfF9fX1" +
  "9fIF98IHxfIAogfCBfXyAvIF8gXCAnICBcLyAtXyk" +
  "gJyBcLyAtXykgIF9cIFYgIFYgLyBfIFwgJ198IC8g" +
  "L19fX3wgLmAgLyAtXykgXCAvICBffAogfF98fF9cX1" +
  "9fL198X3xfXF9fX3xffHxfXF9fX3xcX198XF8vXF8vXF" +
  "9fXy9ffCB8X1xfXCAgIHxffFxfXF9fXy9fXF9cXF9ffA" +
  "ogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg" +
  "ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg" +
  "ICAgICAgIAo=", 'base64').toString()

const logger = {
  mode: process.mode,
  color: process.mode==="production" ? "#43bb88" : "orange",
  version: process.env.version ? process.env.version : "DEV_TEST",
  coreVersion: process.env.coreVersion ? process.env.coreVersion : "DEV_TEST",
  apiUrl: process.mode==="production" ?
    "https://api.daziannetwork.com" :
    "http://127.0.0.1:5000",
  map: undefined,
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
    return "[" + callerData.filePath + ":" + callerData.lineNumber + "] " +
    "[" + callerData.typeName + " " + callerData.functionName + "]";
  },
  debug(...text) {
    if (process.mode === "development") {
      const callerData = callerId.getData(this.debug);
      text.forEach((content) => {
        console.log(this.formatCaller(callerData), ": ", content);
      })
    }
  },
  saveMap(map) {
    this.map = map
  },
  getMap() {
    return this.map
  }
};

export default logger;
