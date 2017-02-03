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
    public format(data: [AggregatedStats, ChampSummary, ChampSummary]): ILaMetricOutput {
        const frames: ILaMetricFrame[] = [];
        const aggregatedStats = data[0];
        const champStats = data[1];
        const previousChampStats = data[2];
        const currentYear = Utility.currentRankedYear;

        frames.push({
            text: `Total Assists: ${aggregatedStats.totalAssists}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Champion Kills: ${aggregatedStats.totalChampionKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Minions Kills: ${aggregatedStats.totalMinionKills}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Jungle Mobs Kills: ${aggregatedStats.totalNeutralMinionsKilled}`,
            icon: LOGO_ICON_STRING,
        });

        frames.push({
            text: `Total Turret Takedowns: ${aggregatedStats.totalTurretsKilled}`,
            icon: LOGO_ICON_STRING,
        });

        if (champStats !== undefined) {
            frames.push({
                text: `Games Played in Ranked ${currentYear}: ${champStats.summary.stats.totalSessionsPlayed}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined) {
            frames.push({
                text: `W/L Ratio in Ranked ${currentYear}: ${this.getRatio(champStats.summary.stats.totalSessionsWon, champStats.summary.stats.totalSessionsLost)}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined) {
            frames.push({
                text: `Double Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalDoubleKills}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined) {
            frames.push({
                text: `Triple Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalTripleKills}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined) {
            frames.push({
                text: `Quadra Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalQuadraKills}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined) {
            frames.push({
                text: `Penta Kills in Ranked ${currentYear}: ${champStats.summary.stats.totalPentaKills}`,
                icon: LOGO_ICON_STRING,
            });
        }

        if (champStats !== undefined && previousChampStats !== undefined) {
            frames.push(this.calculateHowManyExtraGamesWon(champStats.summary, previousChampStats.summary));
        }

        if (champStats === undefined) {
            frames.push({
                text: `For more stats, play some games in ranked`,
                icon: LOGO_ICON_STRING,
            });
        }

        return {
            frames,
        };
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
