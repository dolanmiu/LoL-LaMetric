import * as logger from "winston";
import { StatsRouter } from "./api/stats";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { Config, IConfig } from "./config/index";

const config: IConfig = new Config();

const appWrapper = new ApplicationWrapper(config);

appWrapper.configure((app) => {
    logger.info("Configuring application routes");
    app.use("/stats", new StatsRouter(config.apiKey).router);
});

appWrapper.start();
