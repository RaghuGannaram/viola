import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import logger from "@src/configs/logger.config";
import { getAWSParams } from "@src/utils/env-info";

const { accessKey, secretAccessKey, region, bucket, signedUrlValidity } = getAWSParams();

const s3ClientInstance = new S3Client({
	region: region,
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
});

logger.info(`aws s3 client: instance created successfully... ☁️`);

export default {
	s3ClientInstance,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	bucket,
	signedUrlValidity,
};
