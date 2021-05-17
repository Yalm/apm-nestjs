import { UsersModule } from "./users.module";
import { AppFactory } from "@app/core";
import { initializeAPMAgent } from "@app/apm";

async function bootstrap() {
  initializeAPMAgent({
    serviceName: "users",
  });
  await AppFactory.createMicroservice(UsersModule, 7000);
}
bootstrap();
