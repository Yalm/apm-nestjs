import { start } from "elastic-apm-node";
import { Agent, AgentConfigOptions } from "./apm.interface";

export const initializeAPMAgent = (config?: AgentConfigOptions) : Agent =>
  start(config);
