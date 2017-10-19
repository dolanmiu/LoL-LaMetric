import * as logger from "winston";

import { ChampDictionary } from "../../league/champ-dictionary";
import { Utility } from "../../utility";

interface ILaMetricOutput {
    frames: ILaMetricFrame[];
}

interface ILaMetricFrame {
    text: string;
    icon: string;
}

const LOGO_WARD_ICON_STRING = "i7386";
const LOGO_ICON_STRING = "i14209";

export class LaMetricFormatter {

    constructor(private champPromise: Promise<IChampTable>) {
    }

    public format(data: MatchParticipant[]): Promise<ILaMetricOutput> {
        const frames: ILaMetricFrame[] = [];
        const lastGame = data[0];
        const currentYear = Utility.currentRankedYear;

        logger.info(lastGame);

        frames.push({
            text: `${lastGame.stats.kills} Kills`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.assists} Assists`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.deaths} Deaths`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.totalDamageDealt} dmg`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.totalDamageTaken} dmg`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.wardsPlaced} wards`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `X ${lastGame.stats.wardsKilled} wards`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.goldEarned}G`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Heal ${lastGame.stats.totalHeal}HP`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Spree: ${lastGame.stats.largestKillingSpree}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Spree: ${lastGame.stats.killingSprees === undefined ? 0 : lastGame.stats.killingSprees}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `You ${lastGame.stats.win ? "won" : "lost"}`,
            icon: LOGO_ICON_STRING,
        });

        return new Promise<ILaMetricOutput>((resolve) => {
            this.champPromise.then((champTable) => {
                frames.push({
                    text: `${champTable[lastGame.championId].name}`,
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
