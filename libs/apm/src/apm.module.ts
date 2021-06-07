import { DynamicModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ApmInterceptor } from "./apm.interceptor";
import { ApmService } from "./apm.service";

@Module({})
export class ApmModule {
  static forRoot(
    options?: { global?: boolean }
  ): DynamicModule {
    return {
      global: options?.global ?? true,
      module: ApmModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: ApmInterceptor,
        },
        ApmService,
      ],
      exports: [ApmService],
    };
  }
}
