declare interface Message {
    author: string;
    content: string;
    created_at: string;
    id: string;
    severity: string;
    updated_at: string;
}

declare interface Incident {
    active: boolean;
    created_at: string;
    id: number;
    updates: Message[];
}

declare interface ServerStatus {
    region_tag: string,
    services: [{
        incidents: Incident[],
        status: string,
        name: string,
        slug: string,
    }],
    locales: string[];
    name: string;
    hostname: string;
    slug: string;
}