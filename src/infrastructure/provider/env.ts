/**
 * Define App Locals & Configs
 */

import { Application } from 'express';
import * as dotenv from 'dotenv';

export default class environment {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static config(): any{
		if(process.env)
			dotenv.config({ path: `${process.env.NODE_ENV}.env` });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 7001;
		const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		const mongooseUrl = process.env.MONGOOSE_URL;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';

		const name = process.env.APP_NAME || 'NodeTS Dashboard';
		const keywords = process.env.APP_KEYWORDS || 'somethings';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
		const company = process.env.COMPANY_NAME || 'RentIt';
		const description = process.env.APP_DESCRIPTION || 'Here goes the app description';

		const isCORSEnabled = process.env.CORS_ENABLED || true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		const apiPrefix = process.env.API_PREFIX || 'api';

		const logDays = process.env.LOG_DAYS || 10;

		const queueMonitor = process.env.QUEUE_HTTP_ENABLED || true;
		const queueMonitorHttpPort = process.env.QUEUE_HTTP_PORT || 5550;

		const redisHttpPort = process.env.REDIS_QUEUE_PORT || 6379;
		const redisHttpHost = process.env.REDIS_QUEUE_HOST || '127.0.0.1';
		const redisPrefix = process.env.REDIS_QUEUE_DB || 'q';
		const redisDB = process.env.REDIS_QUEUE_PREFIX || 3;
		const azureStorageAccount = process.env.AZURE_STORAGE_ACCOUNT_NAME || "rentitmedia";
		const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
		const schemaRegistryUrl = process.env.SCHEMA_REGISTRY_URL;

		return {
			appSecret,
			apiPrefix,
			company,
			copyright,
			description,
			isCORSEnabled,
			jwtExpiresIn,
			keywords,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			mongooseUrl,
			name,
			port,
			redisDB,
			redisHttpPort,
			redisHttpHost,
			redisPrefix,
			url,
			queueMonitor,
			queueMonitorHttpPort,
			azureStorageAccount,
			azureStorageConnectionString,
			schemaRegistryUrl
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static init (_express: Application): Application {
		_express.locals.app = this.config();
		return _express;
	}
}

