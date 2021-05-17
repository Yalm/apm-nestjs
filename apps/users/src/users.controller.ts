import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, MessagePattern } from "@nestjs/microservices";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: "user.find" })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: "user.create" })
  create(data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @EventPattern("user.created")
  handleUserCreated() {
    // business logic
  }
}
