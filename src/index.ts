import * as logger from "winston";
import { StatsRouter } from "./api/stats";
import { StatusRouter } from "./api/status";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { Config, IConfig } from "./config/index";

const config: IConfig = new Config();

const appWrapper = new ApplicationWrapper(config);

appWrapper.configure((app) => {
    logger.info("Configuring application routes");
    app.use("/stats", new StatsRouter(config.apiKey).router);
    app.use("/status", new StatusRouter(config.apiKey).router);
});

appWrapper.start();
