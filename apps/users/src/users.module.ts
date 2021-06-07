import { Module, Scope } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { ApmModule } from "@app/apm";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "@app/common";
import { UsersRepository } from "./users.repository";
import { UserClientService } from "@app/user-client";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/apm", {
      ensureIndex: true
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ApmModule.forRoot()
  ],
  controllers: [UsersController],
  providers: [
    UserClientService,
    UsersRepository,
    UsersService,
    { 
      provide: APP_PIPE,
      scope: Scope.REQUEST,
      useClass: ValidationPipe,
    } 
  ],
})
export class UsersModule {}
