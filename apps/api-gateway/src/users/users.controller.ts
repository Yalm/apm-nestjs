import { Body, Controller, Post } from "@nestjs/common";
import { UserClientService } from "@app/user-client";
import { ApmTransaction } from "@app/apm";
@Controller("users")
export class UsersController {
  constructor(private userClientService: UserClientService) { }

  @Post()
  getProducts(
    @Body() body: Record<string, any>,
    @ApmTransaction() transaction: string
  ) {
    return this.userClientService.userCreate({
      value: { email: body.email, name: body.name },
      headers: { transaction },
    });
  }
}
