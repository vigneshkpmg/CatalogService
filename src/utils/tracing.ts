import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
//Exporter
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
//instrumentations
import { ExpressInstrumentation } from "opentelemetry-instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import * as opentelemetryInstrumentationKafkajs from "opentelemetry-instrumentation-kafkajs";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { IORedisInstrumentation } from "@opentelemetry/instrumentation-ioredis";
import { MongooseInstrumentation } from "@opentelemetry/instrumentation-mongoose";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";


// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

class opneTelemetryTracer {
  private sdk: opentelemetry.NodeSDK
  constructor() {
    this.sdk = new opentelemetry.NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'catalogService',
      }),
      traceExporter: new OTLPTraceExporter({
        url: "http://localhost:4318/v1/traces",

      }),
      // traceExporter: new ConsoleSpanExporter(),
      instrumentations: [ 
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new KafkaJsInstrumentation(),     
      new IORedisInstrumentation(),
      new MongooseInstrumentation(),
      new WinstonInstrumentation()
      ]
    })
  }
 
  public async initializeTracer(): Promise<void> {
    try {
      await this.sdk.start()
    }
    catch (error) {
      console.log('Error initializing tracing', error)
    }
  }

    public async flushTracer(): Promise<void> {
    try {
      await this.sdk.shutdown()
    }
    catch (error) {
      console.log('Error initializing tracing', error)
    }
  }
}

export default new opneTelemetryTracer()
//Exporter
// export default function enableTracing(serviceName:string):Tracer {
//  const exporter = new OTLPTraceExporter({
//    url: "http://localhost:4318/v1/traces",

//  });
//   const provider = new NodeTracerProvider({
//    resource: new Resource({
//      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
//    })
//  });
//   provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
//      // The maximum queue size. After the size is reached spans are dropped.
//   maxQueueSize: 1000,
//   // The interval between two consecutive exports
//   scheduledDelayMillis: 3000,
//  }));
//  provider.register();
//  registerInstrumentations({
//    instrumentations: [
//      new HttpInstrumentation(),
//      new ExpressInstrumentation(),
//      new MongoDBInstrumentation(),
//      new KafkaJsInstrumentation()
//    ],
//    tracerProvider: provider,
//  });
//  return trace.getTracer(serviceName);
// };

// export const addTraceId = (req:any, res:any, next:any) => {
//     const spanContext = getSpanContext(context.active());
//     req.traceId = spanContext && spanContext.traceId;    
//     next();
// };