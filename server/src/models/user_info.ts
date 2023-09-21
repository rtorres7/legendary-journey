import _ from "lodash";
import { Document, Model, Schema, model } from "mongoose";

/** */
export interface IUserInfo {
  userId: string;
  meta?: Record<string, any>;
}

/** static methods or properties */
interface UserInfoModel extends Model<IUserInfo> {
  findByUserId(userId: string): Promise<UserInfoDoc>;
}

/** instance methods, virtual methods or properties and overrides */
export interface UserInfoDoc extends IUserInfo, Document {
  getMeta<V>(key: string): V;
  setMeta<V>(key: string, value: V): never;
}

/** */
const schema = new Schema<UserInfoDoc, UserInfoModel>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
      index: false,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    methods: {
      getMeta<V>(key: string): V {
        return this.meta[key];
      },
      setMeta<V>(key: string, value: V) {
        // must replace object
        if (value === undefined || value === null) {
          this.meta = _.omit(this.meta, key);
        } else {
          this.meta = { ...this.meta, [key]: value};
        }
      },
    },
    // virtuals: { abc: { get() { return this.xyz; }, set(v) { this.xyz = v; } } },
    statics: {
      async findByUserId(userId: string): Promise<UserInfoDoc> {
        const found = await this.findOne({ userId });
        if (found) {
          return found;
        } else {
          await new UserInfo({ userId }).save();
          return await this.findOne({ userId });
        }
      }
    },
    timestamps: false,
    strict: true,
  },
);

export const UserInfo = model<UserInfoDoc, UserInfoModel>("UserStatus", schema, "user_status");

export default UserInfo;
