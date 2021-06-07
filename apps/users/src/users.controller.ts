import { Transaction, TransactionParam } from "@app/apm";
import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserDocument } from "./schemas/user.schema";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern("user.find")
  findAllUsers(@TransactionParam() transaction: Transaction) {
    return this.usersService.findAll(transaction);
  }

  @MessagePattern("user.create")
  create(
    @Payload() message: CreateUserDto,
    @TransactionParam() transaction: Transaction
  ) {
    return this.usersService.create(message, transaction);
  }

  @EventPattern("user.created")
  handleUserCreated(
    @Payload() user: UserDocument,
    @TransactionParam() transaction: Transaction
  ) {
    console.log('hola');
  }
}
