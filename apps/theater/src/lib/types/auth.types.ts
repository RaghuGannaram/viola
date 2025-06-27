export enum AccessLevel {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	PROTECTED = "PROTECTED",
}

export enum UserRole {
	GUEST = "GUEST",
	MEMBER = "MEMBER",
	ARTIST = "ARTIST",
}

export interface IEnforceAccessProps {
	profile: IProfile | null;
	requiredAccessLevel: AccessLevel;
	redirectPath?: string;
	ownerId?: string;
}

export interface IProfile {
	id: string;
	email: string;
	username: string;
	authProvider: string;
	avatarUrl: string;
	verified: boolean;
	premium: boolean;
	role: UserRole;
	settings: Record<string, any>;
	createdAt: string;
	lastLoginAt?: string;
}

export interface IRegisterRequest {
	email: string;
	username: string;
	password: string;
}

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IAuthResponse {
	message: string;
	profile: IProfile;
	accessToken: string;
	cookies: string[];
}

export interface IRefreshResponse {
	message: string;
	accessToken: string;
	cookies: string[];
}

export interface ILogoutResponse {
	message: string;
}

export interface IApiErrorResponse {
	message: string;
	type?: string;
	statusCode?: number;
}
