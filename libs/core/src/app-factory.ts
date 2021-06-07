import { NestFactory } from "@nestjs/core";
import {  Transport } from "@nestjs/microservices";
import { initializeAPMAgent } from "@app/apm";

export class AppFactoryStatic {
  async createMicroservice(module: unknown, options: { serviceName: string }) {
    initializeAPMAgent({ serviceName: options.serviceName });

    const app = await NestFactory.createMicroservice(module, {
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: options.serviceName,
        queueOptions: { durable: false },
      },
    });
    app.listen(() => console.log("Microservice is listening"));
    return app;
  }
}
export const AppFactory = new AppFactoryStatic();
