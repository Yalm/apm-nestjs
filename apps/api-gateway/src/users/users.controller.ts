import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller("users")
export class UsersController {
  constructor(@Inject("users") private client: ClientProxy) {}

  @Get()
  getHello(@Query() query: object) {
    return this.client.send<string>({ cmd: "user.find" }, query);
  }

  @Post()
  getProducts(@Body() body: object) {
    return this.client.send<string>({ cmd: "user.create" }, body);
  }
}
