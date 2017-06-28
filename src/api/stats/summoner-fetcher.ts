import * as request from "request";
import * as logger from "winston";

export class SummonerFetcher {

    constructor(private apiKey: string) {
    }

    public fetchSummoner(name: string, region: Region): Promise<Summoner> {
        return new Promise<Summoner>((resolve, reject) => {
            const newName = encodeURIComponent(name);
            const url = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${newName}?api_key=${this.apiKey}`;
            request.get(url, {
                json: true,
            }, (error, response, body: Summoner & RiotError) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                if (body.status !== undefined) {
                    reject(body);
                    logger.error(JSON.stringify(body.status.message));
                    return;
                }

                if (body === undefined) {
                    reject("No summoner found");
                    logger.error("No summoner found");
                    logger.error(body.toString());
                    return;
                }

                resolve(body);
            });
        });
    }
}
