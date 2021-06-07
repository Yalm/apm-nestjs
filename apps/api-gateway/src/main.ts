import { NestFactory } from "@nestjs/core";
import { initializeAPMAgent } from "@app/apm";
import { AppModule } from "./app.module";

async function bootstrap() {
  initializeAPMAgent({ serviceName: "api-gateway", captureBody: "all" });
  const app = await NestFactory.create(AppModule);
  await app.listen(4200);
}
bootstrap();
