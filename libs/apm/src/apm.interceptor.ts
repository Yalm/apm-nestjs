import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { RmqContext } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ApmService } from "./apm.service";
import { Message } from "amqplib";
import { Transaction } from "./apm.interface";
@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmService: ApmService) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    const rmqContext = context.getArgByIndex<RmqContext>(1);
    let transaction: Transaction = undefined;

    if (rmqContext instanceof RmqContext) {
      const pattern: string = rmqContext.getArgByIndex(2);
      const arg: Message = rmqContext.getArgByIndex(0);
      transaction = this.apmService.startTransaction(
        pattern,
        "messaging",
        "rabbitmq",
        arg.properties.correlationId ? "rcp" : "event",
        { childOf: arg.properties.headers.transaction }
      );
      arg.properties.headers.transaction = transaction;
    }

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          this.apmService.captureError(error.message);
        } else {
          this.apmService.captureError(error);
        }
        if (transaction) transaction.end('failure');
        throw error;
      }),
      tap(() => {
        if (transaction) transaction.end();
      })
    );
  }
}
