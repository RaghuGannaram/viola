export enum CacheProvider {
	REDIS = "redis",
	UPSTASH = "upstash",
}

export interface IRedisParams {
	host: string;
	port: number;
	username: string;
	password: string;
}

export interface IUpstashParams {
	rest_url: string;
	token: string;
}

export type CacheParams = IRedisParams | IUpstashParams;

export interface ISessionStore {
	set(key: string, value: string, ttl?: number): Promise<void>;
	get(key: string): Promise<string | null>;
	delete(key: string): Promise<void>;
}
