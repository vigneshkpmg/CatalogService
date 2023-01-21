import express from 'express';

import environment from './env';
import catalogRouter from '../../router/catalogRouter';
import mediaRouter from '../../router/mediaRouter';
import cors from "cors";
import helmet from "helmet";
import * as winston from "winston";
import * as winstonExpress from "express-winston";



class Express {
	/**
	 * Create the express object
	 */
	public express: express.Application;

	/**
	 * Initializes the express server
	 */
	constructor () {
		this.express = express();

		this.mountDotEnv();
		this.mountMiddlewares();
		this.mountRoutes();
	}

	private mountDotEnv (): void {
		this.express = environment.init(this.express);
	}


	/**
	 * Mounts all the defined middlewares
	 */
	private mountMiddlewares(): void {
		// this.express = Bootstrap.init(this.express);
		this.express.use(helmet());
		this.express.use(cors());
		this.express.use(express.json());
		// this.express.use(morgan.default("combined"));		
		this.express.use(winstonExpress.logger({
			transports: [
				new winston.transports.Console()
			],
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.json()
			),
			meta: true, // optional: control whether you want to log the meta data about the request (default to true)
			msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
			expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
			colorize: true // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
		}));
	}
		
	

	/**
	 * Mounts all the defined routes
	 */
	private mountRoutes(): void {
		this.express.use(`/${environment.config().apiPrefix}/catalog`, catalogRouter);
		this.express.use(`/${environment.config().apiPrefix}/media`, mediaRouter);
	}
	

	/**
	 * Starts the express server
	 */
	public init (): void {
		const port: number = environment.config().port;
		// Start the server on the specified port
		this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		})		
	}
}

/** Export the express module */
export default new Express();
