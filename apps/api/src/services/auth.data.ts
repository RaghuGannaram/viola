import { PrismaClient, type User } from "@prisma/client";

import logger from "@src/configs/logger.config";
import type { IRegistration, ILogin } from "@src/types";
import { DataError, DataErrors, processCryptoError, catchAsyncDataError, processPrismaError } from "@src/utils/application-errors";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createUserRecord = catchAsyncDataError(async function (registrationData: IRegistration): Promise<User> {
	logger.debug(`auth.data: creating new user record for user: %o`, registrationData);

	try {
		const salt = await bcrypt.genSalt(10);
		registrationData.password = await bcrypt.hash(registrationData.password, salt);
	} catch (error) {
		processCryptoError(error);
	}

	let user;
	try {
		user = await prisma.user.create({
			data: {
				email: registrationData.email,
				username: registrationData.username,
				passwordHash: registrationData.password,
				authProvider: "local",
				isVerified: false,
				isPremium: false,
			},
		});
	} catch (error) {
		processPrismaError(error);
	}

	return user;
});

const validateUserRecord = catchAsyncDataError(async function (userCredentials: ILogin): Promise<User> {
	logger.debug(`auth.data: reading user record for user: %o`, userCredentials);

	const { email, password } = userCredentials;

	let user;
	try {
		user = await prisma.user.findUnique({
			where: { email },
		});
	} catch (error) {
		throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "user not found.");
	}

	if (!user) {
		throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "user not found.");
	}

	let verified: boolean = false;

	try {
		verified = await bcrypt.compare(password, user.passwordHash ?? "");
	} catch (error) {
		processCryptoError(error);
	}

	if (!verified) {
		throw new DataError(DataErrors.DATA_INVALID_PASSWORD, "password verification failed.");
	}

	return user;
});

export default {
	createUserRecord,
	validateUserRecord,
};
