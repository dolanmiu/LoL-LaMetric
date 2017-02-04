import * as request from "request";
import * as logger from "winston";

export class ChampDictionary {

    private promise: Promise<IChampTable>;

    constructor(private apiKey: string) {
        setInterval(() => {
            this.promise = this.createPromise();
        }, 86400000);
    }

    public fetch(): Promise<IChampTable> {
        if (this.promise !== undefined) {
            return this.promise;
        }

        this.promise = this.createPromise();
        return this.promise;
    }

    public get Promise(): Promise<IChampTable> {
        return this.promise;
    }

    private createPromise(): Promise<IChampTable> {
        return new Promise<IChampTable>((resolve, reject) => {
            request.get(`https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion?api_key=${this.apiKey}`, (error, response, body) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(error);
                    return;
                }

                const champResponse = JSON.parse(body) as ChampionResponse;
                const idDictionary = this.mapChampsToId(champResponse.data);
                resolve(idDictionary);
            });
        });
    }

    private mapChampsToId(champs: { [index: string]: Champion }): { [index: number]: Champion } {
        const newDictionary: { [index: number]: Champion } = {};

        for (const champKey in champs) {
            if (champs.hasOwnProperty(champKey)) {
                const champ = champs[champKey];
                newDictionary[champ.id] = champ;
            }
        }

        return newDictionary;
    }
}
