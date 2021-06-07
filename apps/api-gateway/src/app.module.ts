import { ApmModule } from "@app/apm";
import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule, ApmModule.forRoot({ global: true })],
})
export class AppModule {}
