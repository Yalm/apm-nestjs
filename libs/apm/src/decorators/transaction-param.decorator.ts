import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RmqContext } from "@nestjs/microservices";
import { Message } from "amqplib";

export const TransactionParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const rmqContext = ctx.getArgByIndex<RmqContext>(1);
    const arg: Message = rmqContext.getArgByIndex(0);
    return arg.properties.headers.transaction;
  }
);
