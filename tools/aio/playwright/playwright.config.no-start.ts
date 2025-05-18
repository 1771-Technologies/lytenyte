import pwConfig from "./playwright.config.js";

const nwsConfig = { ...pwConfig };

nwsConfig.webServer = undefined;

export default nwsConfig;
