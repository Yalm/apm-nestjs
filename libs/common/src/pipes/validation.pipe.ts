import {
  ArgumentMetadata,
  Inject,
  Injectable,
  Scope,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { RmqContext, RpcException } from "@nestjs/microservices";
import { getHeadersOfRmq } from "../utils/get-headers-of-rmq.util";

let classValidator: any = {};
let classTransformer: any = {};

@Injectable({ scope: Scope.REQUEST })
export class ValidationPipe extends NestValidationPipe {
  constructor(
    @Inject(REQUEST) private readonly request: { context: RmqContext }
  ) {
    super({
      validationError: { target: false, value: false },
      exceptionFactory: (errors: ValidationError[]) =>
        new RpcException({ errors, status: 400 }),
    });
    classValidator = this.loadValidator();
    classTransformer = this.loadTransformer();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { transaction } = getHeadersOfRmq(this.request.context);

    if (this.expectedType) {
      metadata = { ...metadata, metatype: this.expectedType };
    }

    const metatype = metadata.metatype;
    if (!metatype || !this.toValidate(metadata)) {
      return this.isTransformEnabled
        ? this.transformPrimitive(value, metadata)
        : value;
    }
    const originalValue = value;
    value = this.toEmptyIfNil(value);

    const isNil = value !== originalValue;
    const isPrimitive = this.isPrimitive(value);
    this.stripProtoKeys(value);
    let entity = classTransformer.plainToClass(
      metatype,
      value,
      this.transformOptions
    );

    const originalEntity = entity;
    const isCtorNotEqual = entity.constructor !== metatype;

    if (isCtorNotEqual && !isPrimitive) {
      entity.constructor = metatype;
    } else if (isCtorNotEqual) {
      // when "entity" is a primitive value, we have to temporarily
      // replace the entity to perform the validation against the original
      // metatype defined inside the handler
      entity = { constructor: metatype };
    }

    let span = undefined;
    if (transaction) {
      span = transaction.startSpan(
        `Validating ${metadata.metatype.name}`,
        "validation",
        metadata.type
      );
    }
    const errors = await classValidator.validate(entity, this.validatorOptions);
    if (errors.length > 0) {
      if (span) span.end();
      throw await this.exceptionFactory(errors);
    }
    if (isPrimitive) {
      // if the value is a primitive value and the validation process has been successfully completed
      // we have to revert the original value passed through the pipe
      entity = originalEntity;
    }
    if (this.isTransformEnabled) {
      return entity;
    }
    if (isNil) {
      // if the value was originally undefined or null, revert it back
      return originalValue;
    }
    if (span) span.end();
    return Object.keys(this.validatorOptions).length > 0
      ? classTransformer.classToPlain(entity, this.transformOptions)
      : value;
  }
}
