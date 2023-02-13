import {
  createLogger,
  format,
  transports,
  addColors,
  Logger as winstonLogger
} from 'winston'
import loggerUtil from '../../utils/logger'
const { combine, errors} = format

class Logger {
 
  public static Init = (): winstonLogger => {

    const exceptionTransport = new transports.File({
      filename: `./logs/exceptions.log`,
    })

    const rejectionTransport = new transports.File({
      filename: `./logs/rejections.log`,
    })

    const logger= createLogger({
      level: process.env.NODE_ENV === 'PROD' ? 'info' : 'debug',
      format: combine(errors({ stack: true })),
      transports: [loggerUtil.initializeLoggerComponents().consoleTransport, loggerUtil.initializeLoggerComponents().grafanalokiTransport],
      exceptionHandlers: [loggerUtil.initializeLoggerComponents().grafanalokiTransport,exceptionTransport],
      rejectionHandlers: [loggerUtil.initializeLoggerComponents().grafanalokiTransport,rejectionTransport],
      handleExceptions: true,
      handleRejections: true
    })

    addColors({
      debug: 'yellow',
      info: 'blue',
      error:'red'
    })
    return logger
  }
}
export default Logger.Init()
