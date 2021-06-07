import { RmqContext } from "@nestjs/microservices";
import { Message } from "amqplib";

export const getHeadersOfRmq = (rmqContext: RmqContext) => {
    const arg: Message = rmqContext.getArgByIndex(0);
    return arg.properties.headers;
}