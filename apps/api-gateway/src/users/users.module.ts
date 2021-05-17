import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "users",
        transport: Transport.TCP,
        options: { port: 7000, host: "0.0.0.0" },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
