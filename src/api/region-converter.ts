export class RegionConverter {
    public static convert(region: string): Region {
        const regionLowercase = region.toLowerCase();

        switch (regionLowercase) {
            // If they typed the < v3 version
            case "eune":
                return "EUN1";
            case "lan":
                return "LA1";
            case "na":
                return "NA1";
            case "tr":
                return "TR1";
            case "jp":
                return "JP1";
            case "kr":
                return "KR";
            case "br":
                return "BR1";
            case "oce":
                return "OC1";
            case "euw":
                return "EUW1";
            case "las":
                return "LA2";
                // If they typed the v3 version
            case "eun1":
                return "EUN1";
            case "la1":
                return "LA1";
            case "ru":
                return "RU";
            case "na1":
                return "NA1";
            case "tr1":
                return "TR1";
            case "jp1":
                return "JP1";
            case "kr1":
                return "KR";
            case "br1":
                return "BR1";
            case "oc1":
                return "OC1";
            case "euw1":
                return "EUW1";
            case "la2":
                return "LA2";
            case "pbe":
                return "PBE1";
            default:
                throw new Error(`Cannot find ${region}`);
        }
    }
}
