import client, { Counter, Summary } from "prom-client";
import logger from "../infrastructure/provider/logger";
import responseTime from "response-time"
import { NextFunction, Request, Response} from "express";
export const register = new client.Registry()
        /**
         * A Prometheus counter that counts the invocations of the different HTTP verbs
         * e.g. a GET and a POST call will be counted as 2 different calls
         */
const numOfRequests = new Counter({
    name: 'numOfRequest',
    help: 'Number of requests made',
    labelNames: ['method']
})

        /**
         * A Prometheus counter that counts the invocations with different paths
         * e.g. /foo and /bar will be counted as 2 different paths
         */
const pathsTaken = new Counter({
    name: 'pathsTaken',
    help: 'Paths taken in the app',
    labelNames: ['path']
        
})

//A Prometheus summary to record the HTTP method, path, response code and response time
const responses = new Summary({
    name: 'responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
})

class metricsProvider {

    /**
     * This funtion will start the collection of metrics and should be called from within in the main js file
     */
    public startCollection = function () {
        logger.info(`Starting the collection of metrics, the metrics are available on /metrics`);  
        register.setDefaultLabels({
            app: 'catalogService'
        })

        // Enable the collection of default metrics
        client.collectDefaultMetrics({ register })
    };

    /**
     * This function increments the counters that are executed on the request side of an invocation
     * Currently it increments the counters for numOfPaths and pathsTaken
     */
    public requestCounters =  function (req:Request, res:Response, next:NextFunction) {


            if (req.path != '/metrics') {
                numOfRequests.inc({ method: req.method });
                pathsTaken.inc({ path: req.path });
            }
       next();
    }

    /**
     * This function increments the counters that are executed on the response side of an invocation
     * Currently it updates the responses summary
     */
    public responseCounters =  responseTime((req: Request, res: Response, time) => {
            if (req.url != '/metrics') {
                responses.labels(req.method, req.url, res.statusCode.toString()).observe(time);
            }
    })
}
export default new metricsProvider()