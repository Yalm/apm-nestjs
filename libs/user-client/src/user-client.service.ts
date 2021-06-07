import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import {
  Client,
  ClientProxy,
  CustomClientOptions,
} from "@nestjs/microservices";
import { ClientRMQ } from "@app/core";
import { CreateUserDto } from "apps/users/src/dtos/create-user.dto";
import { ConfigRequest } from "@app/core/serializers/request.serializer";

@Injectable()
export class UserClientService implements OnApplicationBootstrap {
  @Client({
    customClass: ClientRMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: "user",
      queueOptions: { durable: false },
    },
  } as CustomClientOptions)
  private readonly client: ClientProxy;

  onApplicationBootstrap() {
    return this.client.connect();
  }

  userCreate(configRequest: ConfigRequest<CreateUserDto>) {
    return this.client.send<string>("user.create", configRequest);
  }

  userCreated(configRequest: ConfigRequest<CreateUserDto>) {
    return this.client.emit("user.created", configRequest);
  }
}
