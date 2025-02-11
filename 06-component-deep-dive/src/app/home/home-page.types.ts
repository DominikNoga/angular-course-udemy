export type TrafficDataPoint = {
    id: string;
    value: number;
};

export type TrafficData = TrafficDataPoint[];

export type ServerStatus = 'online' | 'offline';