/* tslint:disable */
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
    public format(data: [any]): ILaMetricOutput {
        const frames: ILaMetricFrame[] = [];
        const aggregatedStats = data[0];

        frames.push({
            text: ``,
            icon: LOGO_ICON_STRING,
        });

        return {
            frames,
        };
    }
}
