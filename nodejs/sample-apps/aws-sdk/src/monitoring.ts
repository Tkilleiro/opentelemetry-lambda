import { Counter } from "@opentelemetry/api-metrics";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics-base";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

const metricExporter = new OTLPMetricExporter({});
const meterProvider = new MeterProvider({});

meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 1000,
  })
);
const meter = meterProvider.getMeter("example-meter");
const counter = meter.createCounter("metric_name");

const requestCount: any = meter.createCounter("requests", {
  description: "Count all incoming requests",
});

const boundInstruments = new Map<string, Counter>();

export const countAllRequests = () => {
  return (req: any, res: any, next: any) => {
    console.log("TEST!!!");

    console.log(JSON.stringify(req));
    if (!boundInstruments.has(req.path)) {
      requestCount.route = req.path;
      boundInstruments.set(req.path, requestCount);
    }

    boundInstruments.get(req.path)!.add(1);
    counter.add(10, { key: "value" });
    next();
  };
};
