import logger from "@src/configs/logger.config";
import sessionStore from "@src/configs/session.config";
import type { ITokenPayload, IAuthUser } from "@src/types";
import { DataError, DataErrors, catchAsyncDataError, processTokenError, processCacheError } from "@src/utils/application-errors";
import { getJWTInfo } from "@src/utils/env-info";
import JWT from "jsonwebtoken";
import ms from "ms";

const { accessTokenSecret, refreshTokenSecret, accessTokenValidity, refreshTokenValidity, refreshTokenMaxAge } = getJWTInfo();

const issueAccessToken = catchAsyncDataError(async (profile: IAuthUser) => {
	logger.debug(`token.service: issuing access token for user: %o`, profile);

	const payload = {
		type: "access",
		profile,
	};

	const options = {
		expiresIn: ms(accessTokenValidity) / 1000,
		issuer: "viola.raghugannaram.com",
		audience: profile.id,
	};

	const token = JWT.sign(payload, accessTokenSecret, options);

	try {
		await sessionStore.set(`access:${profile.id}`, token, ms(accessTokenValidity) / 1000);
	} catch (error) {
		processCacheError(error);
	}

	return token;
});

const issueRefreshToken = catchAsyncDataError(async (profile: IAuthUser) => {
	logger.debug(`token.service: issuing refresh token for user: %o`, profile);

	const payload = {
		type: "refresh",
		profile,
	};

	const options = {
		expiresIn: ms(refreshTokenValidity) / 1000,
		issuer: "viola.raghugannaram.com",
		audience: profile.id,
	};

	const token = JWT.sign(payload, refreshTokenSecret, options);

	try {
		await sessionStore.set(`refresh:${profile.id}`, token, ms(refreshTokenValidity) / 1000);
	} catch (error) {
		processCacheError(error);
	}

	return token;
});

const validateAccessToken = catchAsyncDataError(async (accessToken: string) => {
	logger.debug(`token.service: validating access token...`);

	let decoded;

	try {
		decoded = JWT.verify(accessToken, accessTokenSecret) as ITokenPayload;
	} catch (error) {
		processTokenError(error);
	}

	let storedAccessToken: string | null = null;
	try {
		storedAccessToken = await sessionStore.get(`access:${decoded.profile.id}`);
	} catch (error) {
		processCacheError(error);
	}

	if (accessToken !== storedAccessToken) {
		throw new DataError(DataErrors.DATA_INVALID_TOKEN, "invalid access token.");
	}

	return decoded;
});

const validateRefreshToken = catchAsyncDataError(async (refreshToken: string) => {
	logger.debug(`token.service: validating refresh token...`);

	let decoded;

	try {
		decoded = JWT.verify(refreshToken, refreshTokenSecret) as ITokenPayload;
	} catch (error) {
		processTokenError(error);
	}

	let storedRefreshToken: string | null = null;
	try {
		storedRefreshToken = await sessionStore.get(`refresh:${decoded.profile.id}`);
	} catch (error) {
		processCacheError(error);
	}

	if (refreshToken !== storedRefreshToken) {
		throw new DataError(DataErrors.DATA_INVALID_TOKEN, "incorrect refresh token.");
	}

	if (Date.now() - (decoded.iat ?? 0) * 1000 > ms(refreshTokenMaxAge)) {
		throw new DataError(DataErrors.TOKEN_EXCEEDED_MAX_AGE, "refresh token has exceeded maximum lifetime.");
	}

	return decoded;
});

const deleteUserTokens = catchAsyncDataError(async (id: string) => {
	logger.debug(`token.service: deleting user tokens...`);

	try {
		await Promise.all([await sessionStore.delete(`access:${id}`), await sessionStore.delete(`refresh:${id}`)]);
	} catch (error) {
		processCacheError(error);
	}
	return;
});

export default { issueAccessToken, issueRefreshToken, validateAccessToken, validateRefreshToken, deleteUserTokens };
