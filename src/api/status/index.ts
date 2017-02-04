import { Request, Response, Router } from "express";
import * as request from "request";
import * as logger from "winston";
import { LaMetricFormatter } from "./lametric-formatter";
import { StatusFetcher } from "./status-fetcher";

export class StatusRouter {
    public router: Router;
    public statusFetcher: StatusFetcher;
    public laMetricFormatter: LaMetricFormatter;

    constructor(private apiKey: string) {
        this.router = Router();
        this.init();
        this.statusFetcher = new StatusFetcher(apiKey);
        this.laMetricFormatter = new LaMetricFormatter();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            const region: string = req.query.region;

            if (region === undefined) {
                res.status(400).send("name and region cannot be empty");
                return;
            }

            const statusPromise = this.statusFetcher.fetch(region);

            statusPromise.then((status) => {
                // const laMetricFrames = this.laMetricFormatter.format(status);
                res.status(200).send(status);
            });
        });
    }
}
