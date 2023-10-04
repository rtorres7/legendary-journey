// import { KiwiPreconditions } from "@kiwiproject/kiwi-js";

// import { config } from "../config/config";
import { logger } from "../config/logger";

import { KiwiPage, KiwiPreconditions, KiwiSort } from "@kiwiproject/kiwi-js";
import {
  UserAlert,
  IUserAlert,
  UserAlertDoc,
  UserAlertValidator,
  UserAlertReadState,
  UserAlertType,
} from "../models/user_alert";
import { UserInfo } from "../models/user_info";
import AggregatedMetricsService from "./aggregated-metrics-service";

/** */
export class UserAlertService {
  private aggregatedMetricsService: AggregatedMetricsService;

  constructor() {
    this.aggregatedMetricsService = new AggregatedMetricsService();
  }

  /***/
  async counts(user: any): Promise<{ total: number; unread: number }> {
    KiwiPreconditions.checkArgumentDefined(user.id);
    const total = await UserAlert.countDocuments({ userId: user.id }).exec();
    const unread = await UserAlert.countDocuments({
      userId: user.id,
      readState: UserAlertReadState.UNREAD,
    }).exec();
    return { total, unread };
  }

  /** */
  async findByUserPaged(
    user: any,
    perPage = 10,
    page = 1,
    skip = 0,
    sortDir = "desc",
  ): Promise<KiwiPage> {
    KiwiPreconditions.checkArgumentDefined(user.id);
    const total: number = await UserAlert.countDocuments({ userId: user.id });
    const alerts: UserAlertDoc[] = await UserAlert.find({ userId: user.id })
      .sort({ createdAt: sortDir === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(perPage)
      .exec();
    return KiwiPage.of(page, perPage, total, alerts)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("createdAt", sortDir));
  }

  /** */
  async findById(userAlertId: string): Promise<UserAlertDoc> {
    KiwiPreconditions.checkArgumentNotBlank(userAlertId);
    const ret = await UserAlert.findById(userAlertId);
    if (!ret) {
      logger.error(`UserAlertService.findById:  userAlertId ${userAlertId} not found`);
    }
    return ret;
  }

  /** */
  async createAlert(userAlert: Partial<IUserAlert>): Promise<UserAlertDoc> {
    KiwiPreconditions.checkArgumentDefined(userAlert);
    const { value, error } = UserAlertValidator.validate(userAlert);
    if (error) {
      logger.info(error);
      throw new Error(`UserAlertService.createAlert`, { cause: error });
    }
    return await new UserAlert({ ...value }).save();
  }

  /** */
  async updateAlert(id: string, updates: Partial<IUserAlert>): Promise<UserAlertDoc> {
    return await UserAlert.findByIdAndUpdate({ _id: id }, updates, {
      new: true,
    }).exec();
  }

  /** */
  async findProcessedEventIds(
    user: any,
    alertType: UserAlertType,
    gteDate: Date,
  ): Promise<Set<string>> {
    const userAlerts = await UserAlert.find({
      userId: user.id,
      alertType,
      createdAt: { $gte: gteDate },
    }).exec();
    return new Set(userAlerts.map((i: UserAlertDoc) => i.eventLogId).filter((i) => i));
  }

  /** */
  async createAlertsFromPublishedEventLogs(user: any): Promise<UserAlertDoc[]> {
    KiwiPreconditions.checkArgumentDefined(user);
    KiwiPreconditions.checkArgumentDefined(user.organization);
    const KEY = "lastSearchProductPublishEventDate";
    const userInfo = await UserInfo.findByUserId(user.id);
    const searchDate: Date = userInfo.getMeta(KEY);
    const newSearchDate = Date.now();
    const events = await this.aggregatedMetricsService.getRecentPublishedForOrg(
      user.organization,
      searchDate,
    );
    const existingEventIds = await this.findProcessedEventIds(
      user,
      UserAlertType.PRODUCT_PUBLISHED,
      searchDate,
    );
    const userAlerts = [];
    for (const e of events) {
      if (existingEventIds.has(e.eventLogId)) {
        logger.info(`skipping event ${e.eventLogId}`);
        continue;
      }
      const userAlert = await this.createAlert({
        title: `Product published on ${e.datePublished}`,
        message: e.title,
        userId: user.id,
        productNumber: e.productId,
        alertType: UserAlertType.PRODUCT_PUBLISHED,
        readState: UserAlertReadState.UNREAD,
        eventLogId: e.eventLogId,
        // meta: {},
        createdBy: user.id,
      });
      logger.info(`created user alert ${userAlert.id} from event ${e.eventLogId}`);
      userAlerts.push(userAlert);
    }
    userInfo.setMeta(KEY, newSearchDate);
    return Promise.resolve(userAlerts);
  }
}

export default UserAlertService;
