import { createParamDecorator } from "@nestjs/common";
import * as apm from "elastic-apm-node";

export const ApmTransaction = createParamDecorator(() => {
    return apm.currentTraceparent;
  }
);
