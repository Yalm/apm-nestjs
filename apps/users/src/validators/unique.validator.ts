import { getHeadersOfRmq } from "@app/common";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { RmqContext } from "@nestjs/microservices";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { UsersRepository } from "../users.repository";

const VALIDATOR_NAME = "EmailUniqueUser";

@ValidatorConstraint({ name: VALIDATOR_NAME, async: true })
@Injectable({ scope: Scope.REQUEST })
export class EmailUniqueRule implements ValidatorConstraintInterface {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(REQUEST) private readonly request: { context: RmqContext }
  ) {}

  async validate(value: string) {
    const { transaction } = getHeadersOfRmq(this.request.context);

    const span = transaction.startSpan(
      VALIDATOR_NAME,
      "validation",
      "custom",
      "validate"
    );

    const countDocuments = await this.usersRepository
      .countDocuments({ email: value }, transaction, { childOf: span })
      .finally(() => span.end());
    return !!countDocuments;
  }

  defaultMessage(args: ValidationArguments) {
    return "User doesn't exist";
  }
}
