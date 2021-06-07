import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserClientService } from "@app/user-client";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserClientService],
})
export class UsersModule {}
