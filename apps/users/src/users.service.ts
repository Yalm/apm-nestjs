import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Transaction } from "@app/apm";
import { UsersRepository } from "./users.repository";
import { UserClientService } from "@app/user-client";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userClientService: UserClientService
  ) { }

  async create(data: CreateUserDto, transaction: Transaction) {
    const user = await this.usersRepository.create(data, transaction);
    this.userClientService.userCreated({
      value: user,
      headers: { transaction: transaction.traceparent }
    });
    return user;
  }

  findAll(transaction: Transaction) {
    return this.usersRepository.find(transaction);
  }
}
