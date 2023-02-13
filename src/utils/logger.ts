import {format,transports} from 'winston'
import lokiTransport from "winston-loki"
const { combine, timestamp, printf, label } = format
import tracer from "cls-rtracer"

export default class loggerUtil {

    public static initializeLoggerComponents(): any {
        
        const customFormat = printf(i => {
            // const { timestamp, message, level, label, ...meta } = i
            // const rid = tracer.id()
            // // if (level == 'error') {
            // //     return `[${timestamp}] [${level}] [${rid ?? 'No-correlationId'}]  [${label ?? ''}]: ${JSON.stringify(message)}  ${JSON.stringify(meta.error.message) ?? ''}  ${JSON.stringify(meta.error.stack) ?? ''}`
            // // }
            return JSON.stringify(i)
        })

    
        const grafanalokiTransport = new lokiTransport({
            host: "http://localhost:3100",//TODO: need to read from config
            interval: 5,
            gracefulShutdown: true,
            clearOnError: true,
            batching: true,
            replaceTimestamp: true,
            json: true,
            onConnectionError: (err) => { console.error(err) },
            format: combine(
                label({ label: 'CatalogService' }),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                customFormat
            )
        })

        //transport
        const consoleTransport = new transports.Console({
            format: combine(
                label({ label: 'CatalogService' }),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                customFormat
            )
        })
        return {
            consoleTransport,
            grafanalokiTransport,
            customFormat
        }
    }

}

        