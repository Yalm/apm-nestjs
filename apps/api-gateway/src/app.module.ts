import { Module } from "@nestjs/common";
import { ApmModule } from "@app/apm";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ApmModule.forRoot({ global: true }), UsersModule],
})
export class AppModule {}
