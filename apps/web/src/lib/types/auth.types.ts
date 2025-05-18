// 📁 src/lib/types/user.types.ts

export interface IProfile {
	id: string;
	email: string;
	username: string;
	authProvider: string;
	providerId?: string;
	avatarUrl: string;
	isVerified: boolean;
	isPremium: boolean;
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
