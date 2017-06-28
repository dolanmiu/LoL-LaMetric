import { ChampDictionary } from "../../league/champ-dictionary";
import { Utility } from "../../utility";

interface ILaMetricOutput {
    frames: ILaMetricFrame[];
}

interface ILaMetricFrame {
    text: string;
    icon: string;
}

const LOGO_ICON_STRING = "i7386";

export class LaMetricFormatter {

    constructor(private champPromise: Promise<IChampTable>) {
    }

    public format(data: MatchParticipant[]): Promise<ILaMetricOutput> {
        const frames: ILaMetricFrame[] = [];
        const lastGame = data[0];
        const currentYear = Utility.currentRankedYear;

        frames.push({
            text: `Last Game Kills: ${lastGame.stats.kills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Last Game Assists: ${lastGame.stats.assists}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Last Game Deaths: ${lastGame.stats.deaths}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Last Game you dealt ${lastGame.stats.totalDamageDealt} damage`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Last Game you taken ${lastGame.stats.totalDamageTaken} damage`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Last Game killing spree: ${lastGame.stats.killingSprees === undefined ? 0 : lastGame.stats.killingSprees}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `You ${lastGame.stats.win ? "won" : "lost"} your last game`,
            icon: LOGO_ICON_STRING,
        });

        return new Promise<ILaMetricOutput>((resolve) => {
            this.champPromise.then((champTable) => {
                frames.push({
                    text: `Last Game you played as ${champTable[lastGame.championId].name}`,
                    icon: LOGO_ICON_STRING,
                });

                resolve({
                    frames,
                });
            });
        });
    }

    private getRatio(firstNumber: number, secondNumber: number): string {
        const rawRatio = firstNumber / secondNumber;

        if (isNaN(rawRatio)) {
            return "1.00";
        }
        return rawRatio.toFixed(2);
    }

    private calculateHowManyExtraGamesWon(thisSeasonStats: AggregatedChampStats, lastSeasonStats: AggregatedChampStats): ILaMetricFrame {
        const thisSeasonWinRatio = this.getRatio(thisSeasonStats.stats.totalSessionsWon, thisSeasonStats.stats.totalSessionsLost);
        const lastSeasonWinRatio = this.getRatio(lastSeasonStats.stats.totalSessionsWon, lastSeasonStats.stats.totalSessionsLost);

        const totalWonRatio = this.getRatio(parseFloat(thisSeasonWinRatio), parseFloat(lastSeasonWinRatio));
        const totalWonRatioNumber = parseFloat(totalWonRatio);

        if (totalWonRatioNumber > 1) {
            return {
                text: `You have won ${totalWonRatio} times compared to Ranked ${Utility.currentRankedYear - 1}`,
                icon: LOGO_ICON_STRING,
            };
        } else {
            return {
                text: `You have lost ${totalWonRatio} times compared to Ranked ${Utility.currentRankedYear - 1}`,
                icon: LOGO_ICON_STRING,
            };
        }
    }
}
