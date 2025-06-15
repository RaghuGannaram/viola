import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "@src/configs/aws.config";
import logger from "@src/configs/logger.config";
import { AssetCategory } from "@src/types";
import { catchAsyncDataError, processAWSError } from "@src/utils/application-errors";
import ms from "ms";
import { v4 as uuid } from "uuid";

const getFile = catchAsyncDataError(async (key: string): Promise<string> => {
	logger.debug(`aws.service: getting signed URL for file: %s from s3 bucket`, key);

	let fileURL = "";
	const params = {
		Bucket: AWS.bucket,
		Key: key,
	};

	try {
		fileURL = await getSignedUrl(AWS.s3ClientInstance, new AWS.GetObjectCommand(params), {
			expiresIn: ms(AWS.signedUrlValidity) / 1000,
		});
	} catch (error) {
		processAWSError(error);
	}

	return fileURL;
});

const presignPutUrl = catchAsyncDataError(async (category: AssetCategory, fileName: string, contentType: string): Promise<{ presignedUrl: string; s3Key: string }> => {
	const s3Key = `${category}/${uuid()}_${fileName}`;

	logger.debug(`aws.service: generating presigned PUT URL for key: %s`, s3Key);

	const params = {
		Bucket: AWS.bucket,
		Key: s3Key,
		ContentType: contentType,
	};

	let presignedUrl = "";
	try {
		presignedUrl = await getSignedUrl(AWS.s3ClientInstance, new AWS.PutObjectCommand(params), {
			expiresIn: ms(AWS.signedUrlValidity) / 1000,
		});
	} catch (error) {
		processAWSError(error);
	}

	return { presignedUrl, s3Key };
});

const uploadFile = catchAsyncDataError(async (imageCategory: string, imageBuffer: Buffer): Promise<string> => {
	logger.debug(`aws.service: uploading %s file to s3 bucket`, imageCategory);

	const uniqueFileName = imageCategory + "_" + uuid();
	const params = {
		Bucket: AWS.bucket,
		Key: uniqueFileName,
		Body: imageBuffer,
		ContentType: "image/webp",
	};

	try {
		await AWS.s3ClientInstance.send(new AWS.PutObjectCommand(params));
	} catch (error) {
		processAWSError(error);
	}

	return uniqueFileName;
});

const generateCloudFrontUrl = (s3Key: string): string => {
	const cloudFrontUrl = AWS.cloudFrontUrl;

	if (!cloudFrontUrl) {
		throw new Error("CloudFront URL is not configured in AWS settings.");
	}

	return `${cloudFrontUrl}/${s3Key}`;
};

const deleteFile = catchAsyncDataError(async (key: string): Promise<void> => {
	logger.debug(`aws.service: deleting file: %s from s3 bucket`, key);

	const params = {
		Bucket: AWS.bucket,
		Key: key,
	};

	try {
		await AWS.s3ClientInstance.send(new AWS.DeleteObjectCommand(params));
	} catch (error) {
		processAWSError(error);
	}
});

export default {
	getFile,
	presignPutUrl,
	uploadFile,
	generateCloudFrontUrl,
	deleteFile,
};
