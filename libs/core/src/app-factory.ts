import { ValidationError, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RpcException, Transport } from "@nestjs/microservices";

export class AppFactoryStatic {
  async createMicroservice(module: unknown, port: number) {
    const app = await NestFactory.createMicroservice(module, {
      transport: Transport.TCP,
      options: { host: "0.0.0.0", port },
    });
    app.useGlobalPipes(
      new ValidationPipe({
        validationError: { target: false, value: false },
        exceptionFactory: (errors: ValidationError[]) =>
          new RpcException({ errors, status: 400 }),
      })
    );
    app.listen(() => console.log("Microservice is listening"));
    return app;
  }
}
export const AppFactory = new AppFactoryStatic();
