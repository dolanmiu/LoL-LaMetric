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
            const url = `https://euw1.api.riotgames.com/lol/static-data/v3/champions?api_key=${this.apiKey}`;
            request.get(url, {
                json: true,
            }, (error, response, body: ChampionResponse & RiotError) => {
                if (response === undefined || (error && response.statusCode !== 200)) {
                    reject(error);
                    logger.error(body.toString());
                    return;
                }

                if (body.status !== undefined) {
                    reject(body);
                    logger.error(JSON.stringify(body.status.message));
                    return;
                }

                const idDictionary = this.mapChampsToId(body.data);
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
