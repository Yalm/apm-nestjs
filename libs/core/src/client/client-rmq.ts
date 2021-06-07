import {
  ClientRMQ as NestClientRMQ,
  ReadPacket,
  WritePacket,
} from "@nestjs/microservices";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { IdentitySerializer } from "../serializers/identity.serializer";

export class ClientRMQ extends NestClientRMQ {
  initializeSerializer() {
    this.serializer = new IdentitySerializer();
  }

  onApplicationBootstrap() {
    return this.connect();
  }

  protected publish(
    message: ReadPacket,
    callback: (packet: WritePacket) => any
  ): Function {
    try {
      const correlationId = randomStringGenerator();
      const listener = ({ content }: { content: any }) =>
        this.handleMessage(JSON.parse(content.toString()), callback);

      Object.assign(message, { id: correlationId });
      const serializedPacket = this.serializer.serialize(message.data);
      message.data = serializedPacket.value;
 
      this.responseEmitter.on(correlationId, listener);
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(message)),
        {
          replyTo: this.replyQueue,
          correlationId,
          persistent: this.persistent,
          headers: serializedPacket.headers,
        }
      );
      return () => this.responseEmitter.removeListener(correlationId, listener);
    } catch (err) {
      callback({ err });
    }
  }

  protected dispatchEvent(packet: ReadPacket): Promise<any> {
    const serializedPacket = this.serializer.serialize(packet.data);
    packet.data = serializedPacket.value;

    return new Promise<void>((resolve, reject) =>
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(packet)),
        { persistent: this.persistent, headers: serializedPacket.headers },
        (err: unknown) => (err ? reject(err) : resolve())
      )
    );
  }
}
