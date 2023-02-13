import opneTelemetryTracer from './utils/tracing'
import express from './infrastructure/provider/express'
import database from './infrastructure/provider/database'
import logger from './infrastructure/provider/logger'
import redis from './infrastructure/provider/redis'



class StartUp {
  public static async init(): Promise<void> {
    try {
      await opneTelemetryTracer.initializeTracer()
      await database.Init()
      await redis.Init()
      express.init()

    } catch (error) {
      logger.error('Error while initializing the application', { error })
      await opneTelemetryTracer.flushTracer()
      process.exit()
    }
  }
}

StartUp.init()
