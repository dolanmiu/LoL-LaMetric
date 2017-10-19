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
const LOGO_WARD__DESTROY_ICON_STRING = "i14221";
const LOGO_HEALING_ICON_STRING = "i14222";
const LOGO_DEATH_ICON_STRING = "i14223";

export class LaMetricFormatter {

    constructor(private champPromise: Promise<IChampTable>) {
    }

    public format(data: MatchParticipant[]): Promise<ILaMetricOutput> {
        const frames: ILaMetricFrame[] = [];
        const lastGame = data[0];
        const currentYear = Utility.currentRankedYear;

        logger.debug(lastGame);

        frames.push({
            text: `${lastGame.stats.kills} Kills`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.assists} Asst`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.deaths} dths`,
            icon: LOGO_DEATH_ICON_STRING,
        });

        frames.push({
            text: `${this.kFormatter(lastGame.stats.totalDamageDealt)} dmg`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${this.kFormatter(lastGame.stats.totalDamageTaken)} dmg`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.wardsPlaced} ward`,
            icon: LOGO_WARD_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.wardsKilled} ward`,
            icon: LOGO_WARD__DESTROY_ICON_STRING,
        });

        frames.push({
            text: `${this.kFormatter(lastGame.stats.goldEarned)} G`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `${this.kFormatter(lastGame.stats.totalHeal)} HP`,
            icon: LOGO_HEALING_ICON_STRING,
        });

        frames.push({
            text: `${lastGame.stats.largestKillingSpree} Spree`,
            icon: LOGO_DEATH_ICON_STRING,
        });

        if (!!lastGame.stats.killingSprees && lastGame.stats.killingSprees > 1) {
            frames.push({
                text: `${this.fetchSpree(lastGame.stats.killingSprees)}`,
                icon: LOGO_DEATH_ICON_STRING,
            });
        }

        frames.push({
            text: `${lastGame.stats.win ? "won" : "lost"}`,
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

                logger.info(frames);
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

    // tslint:disable-next-line:no-any
    private kFormatter(input: any): string | number {
        const num = isNaN(input) ? parseInt(input, 10) : input;

        return num > 999 ? (num / 1000).toFixed(0) + "k" : num;
    }

    private fetchSpree(kills: number) {
        switch (kills) {
            case 2:
                return "double kill";
            case 3:
                return "triple kill";
            case 4:
                return "quadra kill";
            case 5:
                return "penta kill";
            case 6:
                return "hexa kill";
            default:
                return "";
        }
    }
}
