import { Request, Response, Router } from "express";
import * as request from "request";

export class StatsRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            res.status(200).send("works");
        });
    }
}
