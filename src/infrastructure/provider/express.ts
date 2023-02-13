import express from 'express'
import environment from './env'
import catalogRouter from '../../router/catalogRouter'
import mediaRouter from '../../router/mediaRouter'
import cors from 'cors'
import helmet from 'helmet'
import healthCheckRouter from '../../router/healthCheckRouter'
import metricsProvider from '../../middleware/metricsMiddleware'
import promo from "express-prometheus-middleware"
import audit from "express-requests-logger"
import logger from './logger'
import tracer from "cls-rtracer"
//import { addTraceId } from '../../utils/tracing'




class Express {
  /**
   * Create the express object
   */
  public express: express.Application

  /**
   * Initializes the express server
   */
  constructor() {
    this.express = express()
    this.mountDotEnv()
    this.mountMiddlewares()
    this.mountRoutes()
  }

  private mountDotEnv(): void {
    this.express = environment.init(this.express)
  }

  /**
   * Mounts all the defined middlewares
   */
  private async mountMiddlewares(): Promise<void> {

    // this.express.use(tracer.expressMiddleware({
    //    useHeader: true,
    //    headerName: 'x-correlation-id',
    //    echoHeader:true
    // }))
    //this.express.use(addTraceId)
    this.express.use(promo({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400]
    }))

    this.express.use(helmet())
    this.express.use(cors())
    this.express.use(express.json())
    this.express.use(audit({
    logger: logger, // Existing bunyan logger
    excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
    request: {
        maskBody: ['password'], // Mask 'password' field in incoming requests
        excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
    }
}))
   
    this.express.use(metricsProvider.requestCounters)
    this.express.use(metricsProvider.responseCounters)
    metricsProvider.startCollection()
  }

  /**
   * Mounts all the defined routes
   */
  private mountRoutes(): void {
    this.express.use(
      `/${environment.config().apiPrefix}/catalog`,
      catalogRouter
    )
    this.express.use(`/${environment.config().apiPrefix}/media`, mediaRouter)
    this.express.use('/', healthCheckRouter)
    // this.express.use(`/metrics`, metricsRouter )
  }

  /**
   * Starts the express server
   */
  public init(): void {
    const port: number = environment.config().port
    // Start the server on the specified port
    this.express
      .listen(port, () => {
        return console.log(
          '\x1b[33m%s\x1b[0m',
          `Server :: Running @ 'http://localhost:${port}'`
        )
      })
      .on('error', _error => {
        return console.log('Error: ', _error.message)
      })
  }
}

/** Export the express module */
export default new Express()
function uuidv4() {
  throw new Error('Function not implemented.')
}

