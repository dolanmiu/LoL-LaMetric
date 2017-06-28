declare interface Champion {
    id: number;
    title: string;
    name: string;
    key: string;
}

declare interface ChampionResponse {
    data: {
        [index: string]: Champion;
    };
    type: string,
    version: string;
}

declare interface IChampTable {
    [index: string]: Champion;
}