import Joi from "joi";
import { Document, Model, Schema, Types, model } from "mongoose";

/** */
export enum UserAlertType {
  PRODUCT_PUBLISHED = "PRODUCT_PUBLISHED",
}

/** */
export enum UserAlertReadState {
  READ = "READ",
  UNREAD = "UNREAD",
}

/** */
export interface IUserAlert {
  // mongo id
  title: string;                    // title varchar(100)
  message?: string;                 // message varchar(4000)
  userId: string;                   // user_id int(11)
  productNumber: string;            // document_id varchar(200)
  alertType: UserAlertType;         // alert_type varchar(20)
  readState?: UserAlertReadState;   // read_state varchar(20)
  eventLogId?: string;              // document_views_id varchar(20)
  meta?: Record<string, any>;
  createdBy?: string;               // created_by_id int(11)
  createdAt?: Date;                 // auto generated by Schema with option { timestamps: true }
  updatedAt?: Date;                 // auto generated by Schema with option { timestamps: true }
}

/** static methods or properties */
interface UserAlertModel extends Model<IUserAlert> {
  build(partial: Partial<IUserAlert>): UserAlertDoc;
}

/** instance methods, virtual methods or properties and overrides */
export interface UserAlertDoc extends IUserAlert, Document {
}

/** joi */
export const UserAlertValidator = Joi.object<IUserAlert>().keys({
  title: Joi.string().required().allow(""),
  message: Joi.string().optional(),
  userId: Joi.string().required().optional(),
  createdBy: Joi.string().optional(),
  alertType: Joi.string().required().valid(...Object.values(UserAlertType)),
  readState: Joi.string().required().valid(...Object.values(UserAlertReadState)).default(UserAlertReadState.UNREAD),
  productNumber: Joi.string().optional(),
  eventLogId: Joi.string(),
  meta: Joi.object().optional(),
});

/** */
const schema = new Schema<UserAlertDoc, UserAlertModel>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: String,
      index: false,
    },
    alertType: {
      type: String,
      enum: Object.values(UserAlertType),
      required: true,
      index: true,
    },
    readState: {
      type: String,
      enum: Object.values(UserAlertReadState),
      default: UserAlertReadState.UNREAD,
      required: true,
      index: true,
    },
    productNumber: {
      type: String,
      required: false,
      index: true,
    },
    eventLogId: {
      type: String,
      required: false,
      index: false,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
      required: false,
      index: false,
    },
  },
  {
    toObject: {
      virtuals: false,
    },
    toJSON: {
      transform(doc, ret) {
        // console.log("doc", doc);
        // console.log("ret", ret);
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    // methods: {},
    virtuals: {
      // abc: { get() { return this.xyz; }, set(v) { this.xyz = v; } }
    },
    statics: {
      build: (partial: Partial<IUserAlert>) => {
        return new UserAlert(partial);
      },
    },
    timestamps: true,
    strict: true,
  },
);

export const UserAlert = model<UserAlertDoc, UserAlertModel>("UserAlert", schema, "user_alert");

export default UserAlert;
