import Redis from 'ioredis';
import environment from "./env";
import logger from "../provider/logger";

class RedisClient {
    private redis;
    constructor() {
        this.redis = new Redis({ port: environment.config().redisHttpPort, host: environment.config().redisHttpHost });
    }
    async getCachedData(key: string="catalog"): Promise<any> {
        try {
            const result = await this.redis.get(key);
            if (result) {
                return JSON.parse(result);
            }
            return null;
        }
        catch (error) {
            logger.error(`Error while getting a cache for key : ${key}`, error);
        }
    }


    async setCacheData(value: any, key: string="catalog", expiration:number=3600): Promise<void> {
        try {
            await this.redis.setex(key,expiration, JSON.stringify(value));
        }
        catch (error) {
            logger.error(`Error while setting cache for key : ${key} and value : ${value}`, error);
        }
    }

    async deleteCacheData(key: string="catalog"): Promise<void> {
        try {
            await this.redis.del(key);
        }
        catch (error) {
            logger.error(`Error while deleteing cache for key : ${key}`, error);
        }
    }

    async clearCache(): Promise<void> {
        await this.redis.flushdb();
    
   }
    
}
export default new RedisClient();