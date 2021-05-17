import { Injectable } from "@nestjs/common";
import * as apm from "elastic-apm-node";
import {
  Agent,
  CaptureErrorCallback,
  CaptureErrorOptions,
  FilterFn,
  Labels,
  LabelValue,
  Outcome,
  ParameterizedMessageObject,
  PatchHandler,
  SpanOptions,
  TransactionOptions,
  UserObject,
} from "./apm.interface";

@Injectable()
export class ApmService {
  apm: Agent;

  constructor() {
    this.apm = apm;
  }

  isStarted() {
    return this.apm.isStarted();
  }

  getServiceName() {
    return this.apm.getServiceName();
  }

  setFramework(options: {
    name?: string;
    version?: string;
    overwrite?: boolean;
  }) {
    return this.apm.setFramework(options);
  }

  addPatch(modules: string | Array<string>, handler: string | PatchHandler) {
    return this.apm.addPatch(modules, handler);
  }

  removePatch(modules: string | Array<string>, handler: string | PatchHandler) {
    return this.apm.removePatch(modules, handler);
  }

  clearPatches(modules: string | Array<string>) {
    return this.apm.clearPatches(modules);
  }

  handleUncaughtExceptions(fn?: (err: Error) => void) {
    return this.apm.handleUncaughtExceptions(fn);
  }

  captureError(
    err: Error | string | ParameterizedMessageObject,
    options?: CaptureErrorOptions,
    callback?: CaptureErrorCallback
  ) {
    return this.apm.captureError(err, options, callback);
  }

  startTransaction(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: TransactionOptions
  ) {
    return this.apm.startTransaction(name, type, subtype, action, options);
  }

  setTransactionName(name: string) {
    return this.apm.setTransactionName(name);
  }

  endTransaction(result?: string | number, endTime?: number) {
    return this.apm.endTransaction(result, endTime);
  }

  startSpan(
    name: string | null,
    type: string | null,
    subtype: string | null,
    action: string | null,
    options?: SpanOptions
  ) {
    return this.apm.startSpan(name, type, subtype, action, options);
  }

  // Context
  setLabel(name: string, value: LabelValue) {
    return this.apm.setLabel(name, value);
  }

  addLabels(labels: Labels) {
    return this.apm.addLabels(labels);
  }

  setUserContext(user: UserObject) {
    return this.apm.setUserContext(user);
  }

  setCustomContext(custom: object) {
    return this.apm.setCustomContext(custom);
  }

  // Transport
  addFilter(fn: FilterFn) {
    return this.apm.addFilter(fn);
  }

  addErrorFilter(fn: FilterFn) {
    return this.apm.addErrorFilter(fn);
  }

  addSpanFilter(fn: FilterFn) {
    return this.apm.addSpanFilter(fn);
  }

  addTransactionFilter(fn: FilterFn) {
    return this.apm.addTransactionFilter(fn);
  }

  addMetadataFilter(fn: FilterFn) {
    return this.apm.addMetadataFilter(fn);
  }

  flush(callback?: Function) {
    return this.apm.flush(callback);
  }

  destroy() {
    return this.apm.destroy();
  }

  // Custom metrics

  registerMetric(name: string, labels: Labels, callback: Function) {
    return this.apm.registerMetric(name, labels, callback);
  }

  setTransactionOutcome(outcome: Outcome) {
    return this.apm.setTransactionOutcome(outcome);
  }

  setSpanOutcome(outcome: Outcome) {
    return this.apm.setSpanOutcome(outcome);
  }
}
