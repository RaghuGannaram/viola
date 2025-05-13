import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

export enum LogLevel {
	ERROR = "error",
	WARN = "warn",
	INFO = "info",
	HTTP = "http",
	VERBOSE = "verbose",
	DEBUG = "debug",
	SILLY = "silly",
}

export const colorCode: Record<LogLevel, string> = {
	[LogLevel.ERROR]: "red",
	[LogLevel.WARN]: "yellow",
	[LogLevel.INFO]: "green",
	[LogLevel.HTTP]: "magenta",
	[LogLevel.VERBOSE]: "cyan",
	[LogLevel.DEBUG]: "blue",
	[LogLevel.SILLY]: "pink",
};

export const levelCode: Record<LogLevel, number> = {
	[LogLevel.ERROR]: 0,
	[LogLevel.WARN]: 1,
	[LogLevel.INFO]: 2,
	[LogLevel.HTTP]: 3,
	[LogLevel.VERBOSE]: 4,
	[LogLevel.DEBUG]: 5,
	[LogLevel.SILLY]: 6,
};

export enum ErrorExposureDepth {
	HTTP = "HTTP",
	BUSINESS = "BUSINESS",
	DATA = "DATA",
	COMPLETE = "COMPLETE",
}

export const errorExposureDepthCode: Record<ErrorExposureDepth, number> = {
	[ErrorExposureDepth.HTTP]: 1,
	[ErrorExposureDepth.BUSINESS]: 2,
	[ErrorExposureDepth.DATA]: 3,
	[ErrorExposureDepth.COMPLETE]: Number.MAX_SAFE_INTEGER,
};

export interface ApplicationError extends Error {
	status: number;
	message: string;
	type: string;
	cause?: ApplicationError | Error | null;
	stack?: string;
}

export interface IController {
	(req: Request, res: Response, next: NextFunction): Promise<void>;
}

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

//####################################### Entity Data Types ####################################
//User
export interface IUser {
	id: string;
	fullname: string;
	handle: string;
	email: string;
	password: string;
	avatar: string;
	background: string;
	bio: string;
	city: string;
	from: string;
	role: "user" | "moderator" | "admin";
	followers: string[] | Pick<IUser, "id" | "fullname" | "handle" | "avatar">[];
	followees: string[] | Pick<IUser, "id" | "fullname" | "handle" | "avatar">[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IRegistration {
	fullname: string;
	handle: string;
	email: string;
	password: string;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface ITokenPayload extends JwtPayload {
	id: string;
	fullname: string;
	handle: string;
	email: string;
	role: "user" | "moderator" | "admin";
}

export interface IAuthUser {
	id: string;
	fullname: string;
	handle: string;
	email: string;
	role: "user" | "moderator" | "admin";
}

export interface IVerifiedRequest extends Request {
	user: IAuthUser;
}

export interface IUserUpdate {
	fullname: string;
	bio: string;
	city: string;
	from: string;
}

export interface IUserFileUpdate {
	type: "avatar" | "background";
	file: Express.Multer.File;
}

//Post
export interface IPost {
	id: string;
	author: string | Pick<IUser, "id" | "fullname" | "handle" | "avatar">;
	description: string;
	image: {
		thumbnail: string;
		original: string;
	};
	likes: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IPostCreate {
	description: string;
	image: string | Express.Multer.File;
}

export interface IPostUpdate {
	description?: string;
	image?: string;
	file?: Express.Multer.File;
}

export interface IComment {
	id: string;
	post: string;
	author: string | Pick<IUser, "id" | "fullname" | "handle" | "avatar">;
	description: string;
	likes: string[];
	hidden: boolean;
	createdAt: Date;
	updatedAt: Date;
}
