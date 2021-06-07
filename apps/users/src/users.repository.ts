import { SpanOptions, Transaction } from "@app/apm";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(data: User, transaction: Transaction) {
    const span = transaction.startSpan(
      "apm.users.insertOne",
      "db",
      "mongodb",
      "insertOne"
    );
    return this.userModel.create(data).finally(() => span.end());
  }

  countDocuments(
    filter: FilterQuery<UserDocument>,
    transaction: Transaction,
    options?: SpanOptions
  ) {
    const span = transaction.startSpan(
      "apm.users.countDocuments",
      "db",
      "mongodb",
      "countDocuments",
      options
    );
    return this.userModel
      .countDocuments(filter)
      .exec()
      .finally(() => span.end());
  }

  find(transaction: Transaction) {
    const span = transaction.startSpan(
      "apm.users.find",
      "db",
      "mongodb",
      "find"
    );
    return this.userModel
      .find()
      .exec()
      .finally(() => span.end());
  }
}
