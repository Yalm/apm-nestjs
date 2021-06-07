import { Serializer } from "@nestjs/microservices";
import { isNil, isObject } from "@nestjs/common/utils/shared.utils";

export class IdentitySerializer implements Serializer {
  serialize(value: any) {
    const isNotKafkaMessage =
      isNil(value) ||
      !isObject(value) ||
      (!("key" in value) && !("value" in value));

    if (isNotKafkaMessage) {
      value = { value };
    }

    if (isNil(value.headers)) {
      value.headers = {};
    }
    return value;
  }
}
