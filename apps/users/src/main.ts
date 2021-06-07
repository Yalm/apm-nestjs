import { UsersModule } from "./users.module";
import { AppFactory } from "@app/core";

AppFactory.createMicroservice(UsersModule, {
  serviceName: "user",
});
