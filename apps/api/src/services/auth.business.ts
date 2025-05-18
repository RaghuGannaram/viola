import logger from "@src/configs/logger.config";
import authDataService from "@src/services/auth.data";
import awsDataService from "@src/services/aws.data";
import tokenDataService from "@src/services/token.data";
import type { IRegistration, ILogin, ITokenPayload } from "@src/types";
import hideSensitiveInfo from "@src/utils";
import { catchAsyncBusinessError } from "@src/utils/application-errors";

const createUser = catchAsyncBusinessError(async function (registrationData: IRegistration) {
	logger.info(`auth.business: creating new user with email: %s`, registrationData.email);

	let user = await authDataService.createUserRecord(registrationData);

	if (user.avatarUrl) {
		user.avatarUrl = await awsDataService.getFile(user.avatarUrl);
	}

	const payload: ITokenPayload = {
		id: user.id,
		username: user.username,
		email: user.email,
	};

	const [accessToken, refreshToken] = await Promise.all([tokenDataService.issueAccessToken(payload), tokenDataService.issueRefreshToken(payload)]);

	const safeResponse = hideSensitiveInfo(user, "passwordHash");

	return { data: safeResponse, accessToken, refreshToken };
});

const validateUser = catchAsyncBusinessError(async function (userCredentials: ILogin) {
	logger.info(`auth.business: validating user with email: %s`, userCredentials.email);

	const user = await authDataService.validateUserRecord(userCredentials);

	if (user.avatarUrl) {
		user.avatarUrl = await awsDataService.getFile(user.avatarUrl);
	}

	const payload: ITokenPayload = {
		id: user.id,
		username: user.username,
		email: user.email,
	};

	const [accessToken, refreshToken] = await Promise.all([tokenDataService.issueAccessToken(payload), tokenDataService.issueRefreshToken(payload)]);

	const safeResponse = hideSensitiveInfo(user, "passwordHash");

	return { data: safeResponse, accessToken, refreshToken };
});

const refreshUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
	logger.info(`auth.business: refreshing user tokens`);

	const user = await tokenDataService.validateRefreshToken(refreshToken);

	const [newAccessToken, newRefreshToken] = await Promise.all([tokenDataService.issueAccessToken(user), tokenDataService.issueRefreshToken(user)]);

	return { newAccessToken, newRefreshToken };
});

const clearUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
	logger.info(`auth.business: clearing user tokens`);

	const user = await tokenDataService.validateRefreshToken(refreshToken);

	await tokenDataService.deleteUserTokens(user.id);

	return;
});

export default { createUser, validateUser, refreshUserTokens, clearUserTokens };
