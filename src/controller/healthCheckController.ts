import express from 'express'
import { mongoose } from '../infrastructure/provider/database'
import redis from '../infrastructure/provider/redis'
class healthCheckController {
  public async getSelfHealth(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    }
    try {
      res.send(healthcheck)
    } catch (error: unknown) {
      res.status(503).send()
    }
  }

  public async getSelfAndDependencyHealth(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const healthcheck = {
      uptime: process.uptime(),
      messages: ['Express server is up'],
      timestamp: Date.now(),
    }
    try {
      if (mongoose.connection.readyState != 1) {
        healthcheck.messages.push('Mongo Db is not up')
      }

      if (!(await redis.CheckHealth())) {
        healthcheck.messages.push('Redis is not up')
      }
      res.send(healthcheck)
    } catch (error: unknown) {
      healthcheck.messages.push(error as string)
      res.status(503).send()
    }
  }
}

export default new healthCheckController()
