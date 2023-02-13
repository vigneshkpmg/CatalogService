import Redis from 'ioredis'
import environment from './env'
import logger from '../provider/logger'

class RedisClient {
  private redis: Redis | undefined

  public async Init(): Promise<void> {
    try {
      this.redis = new Redis({
        port: environment.config().redisHttpPort,
        host: environment.config().redisHttpHost,
      })
      if (!(await this.CheckHealth())) {
        throw new Error('Redis connection error.')
      }
    } catch (error) {
      logger.error('Error while connecting to Redis', { error })
    }
  }
  async getCachedData(key = 'catalog'): Promise<any> {
    try {
      const result = await this.redis?.get(key)
      if (result) {
        return JSON.parse(result)
      }
      return null
    } catch (error) {
      logger.error(`Error while getting a cache for key : ${key}`, { error })
    }
  }

  async setCacheData(
    value: any,
    key = 'catalog',
    expiration = 3600
  ): Promise<void> {
    try {
      await this.redis?.setex(key, expiration, JSON.stringify(value))
    } catch (error) {
      logger.error(
        `Error while setting cache for key : ${key} and value : ${value}`,
        { error }
      )
    }
  }

  async deleteCacheData(key = 'catalog'): Promise<void> {
    try {
      await this.redis?.del(key)
    } catch (error) {
      logger.error(`Error while deleteing cache for key : ${key}`, { error })
    }
  }

  async clearCache(): Promise<void> {
    await this.redis?.flushdb()
  }

  async CheckHealth(): Promise<boolean> {
    try {
      await this.redis?.ping()
      return true
    } catch (error) {
      logger.error(`Error while connecting to redis`, { error } )
      return false
    }
  }
}
export default new RedisClient()
