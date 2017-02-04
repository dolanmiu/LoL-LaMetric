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
    public format(serverStatus: ServerStatus): ILaMetricOutput {
        const frames: ILaMetricFrame[] = [];

        for (const service of serverStatus.services) {
            frames.push({
                text: `${service.name} status: ${service.status}`,
                icon: LOGO_ICON_STRING,
            });
        }

        return {
            frames,
        };
    }
}
