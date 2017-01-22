export class ChampsTransformer {

    constructor(private champPromise: Promise<{ [index: string]: Champion; }>) {

    }

    public transform(champions: AggregatedChampStats[], callback: (stats: ChampSummary) => void): void {
        champions.sort((a, b) => {
            return b.stats.totalSessionsPlayed - a.stats.totalSessionsPlayed;
        });

        const summary = champions.find((a) => {
            return a.id === 0;
        });

        champions = champions.filter((a) => {
            return a.id !== 0;
        });

        const topThreeChamps = champions.slice(0, 3);

        this.champPromise.then((champDictionary) => {
            for (const champ of topThreeChamps) {
                champ.name = champDictionary[champ.id].name;
            }

            callback({
                favorite: topThreeChamps,
                summary: summary,
            });
        });
    }
}
