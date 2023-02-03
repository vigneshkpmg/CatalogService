import {
  createLogger,
  format,
  transports,
  addColors,
  Logger as winstonLogger,
  level,
} from 'winston'
const { combine, timestamp, printf, errors, colorize, label } = format

class Logger {
  // This method set the current severity based on
  // the current NODE_ENV: show all the log levels
  // if the server was run in development mode; otherwise,
  // if it was run in production, show only warn and error messages.
  private static level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
  }

  public static Init = (): winstonLogger => {
    const httpRequestFormat = printf(info => {
      const { timestamp, message } = info
      const parsedMessage = JSON.parse(message)
      const { ip, method, url, httpVersion, headers } = parsedMessage
      return `[${timestamp}]:  ${method}  ${url}  HTTP/${httpVersion}  ${
        headers.referrer ?? '-'
      }  ${headers['user-agent']}  ${ip}`
    })

    const errorFormat = printf(i => {
      const { timestamp, message, label, ...meta } = i
      return `[${timestamp}] [${label ?? ''}]: ${message}  ${meta.error.stack ?? ''}`
    })
    const consoleFormat = printf(info => {
      return info.level == 'error' ?`${info.timestamp} [${info.label}] ${info.level} : ${info.message} ${info.meta.error}`:
        `${info.timestamp} [${info.label}] ${info.level} : ${info.message}`
    })

    //filter
    const httpFilter = format((info) => {
      return info.level == 'http' ? info : false
    })

    const errorFilter = format((info) => {
      return info.level == 'error' ? info : false
    })
    //transport
    const consoleTransport = new transports.Console({
      format: combine(
        colorize(),
        label({ label: 'CatalogService' }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        consoleFormat
      ),
    })
    const httpRequestTransport = new transports.File({
      level: 'http',
      filename: `./logs/httpRequests.log`,
      format: combine(
        label({ label: 'CatalogService' }),
        httpFilter(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        httpRequestFormat
      ),
    })
    const errorTransport = new transports.File({
      level: 'error',
      filename: `./logs/errors.log`,
      format: combine(
        label({ label: 'CatalogService' }),
        errorFilter(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        errorFormat
      ),
    })
    const exceptionTransport = new transports.File({
      filename: `./logs/exceptions.log`,
    })

    const rejectionTransport = new transports.File({
      filename: `./logs/rejections.log`,
    })

    const logger = createLogger({
      level: process.env.NODE_ENV === 'PROD' ? 'info' : 'debug',
      format: combine(errors({ stack: true })),
      transports: [httpRequestTransport, errorTransport, consoleTransport],
      exceptionHandlers: [exceptionTransport],
      rejectionHandlers: [rejectionTransport],
      handleExceptions: true,
      handleRejections: true,
    })

    addColors({
      debug: 'yellow',
      info: 'blue',
    })
    return logger
  }
}
export default Logger.Init()
