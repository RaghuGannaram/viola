import logger from "@src/configs/logger.config";
import authDataService from "@src/services/auth.data";
import awsDataService from "@src/services/aws.data";
import tokenDataService from "@src/services/token.data";
import type { IRegistration, ILogin, IAuthUser, ISettings } from "@src/types";
import hideSensitiveInfo from "@src/utils";
import { catchAsyncBusinessError } from "@src/utils/application-errors";

const createUser = catchAsyncBusinessError(async function (registrationData: IRegistration) {
	logger.info(`auth.business: creating new user with email: %s`, registrationData.email);

	let user = await authDataService.createUserRecord(registrationData);

	if (user.avatarUrl) {
		user.avatarUrl = await awsDataService.getFile(user.avatarUrl);
	}

	const profile: IAuthUser = {
		id: user.id,
		email: user.email,
		username: user.username,
		authProvider: user.authProvider,
		avatarUrl: user.avatarUrl,
		verified: user.verified,
		premium: user.premium,
		role: user.role,
		settings: user.settings as ISettings,
		createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
		lastLoginAt: user.lastLoginAt instanceof Date ? user.lastLoginAt.toISOString() : "",
	};

	const [accessToken, refreshToken] = await Promise.all([tokenDataService.issueAccessToken(profile), tokenDataService.issueRefreshToken(profile)]);

	const safeResponse = hideSensitiveInfo(user, "password");

	return { data: safeResponse, accessToken, refreshToken };
});

const validateUser = catchAsyncBusinessError(async function (userCredentials: ILogin) {
	logger.info(`auth.business: validating user with email: %s`, userCredentials.email);

	const user = await authDataService.validateUserRecord(userCredentials);

	if (user.avatarUrl) {
		user.avatarUrl = await awsDataService.getFile(user.avatarUrl);
	}

	const profile: IAuthUser = {
		id: user.id,
		email: user.email,
		username: user.username,
		authProvider: user.authProvider,
		avatarUrl: user.avatarUrl,
		verified: user.verified,
		premium: user.premium,
		role: user.role,
		settings: user.settings as ISettings,
		createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
		lastLoginAt: user.lastLoginAt instanceof Date ? user.lastLoginAt.toISOString() : "",
	};

	const [accessToken, refreshToken] = await Promise.all([tokenDataService.issueAccessToken(profile), tokenDataService.issueRefreshToken(profile)]);

	const safeResponse = hideSensitiveInfo(user, "password");

	return { data: safeResponse, accessToken, refreshToken };
});

const refreshUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
	logger.info(`auth.business: refreshing user tokens`);

	const user = await tokenDataService.validateRefreshToken(refreshToken);

	const [newAccessToken, newRefreshToken] = await Promise.all([tokenDataService.issueAccessToken(user.profile), tokenDataService.issueRefreshToken(user.profile)]);

	return { newAccessToken, newRefreshToken };
});

const clearUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
	logger.info(`auth.business: clearing user tokens`);

	const user = await tokenDataService.validateRefreshToken(refreshToken);

	await tokenDataService.deleteUserTokens(user.profile.id);

	return;
});

export default { createUser, validateUser, refreshUserTokens, clearUserTokens };
