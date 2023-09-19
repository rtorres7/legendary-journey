// import { KiwiPreconditions } from "@kiwiproject/kiwi-js";

// import { config } from "../config/config";
import { logger } from "../config/logger";

import { KiwiPage, KiwiPreconditions, KiwiSort } from "@kiwiproject/kiwi-js";
import { Alert, IAlert, AlertDoc, AlertValidator, AlertReadState, AlertType } from "../models/alert";
import { UserInfo } from "../models/user_info";
import AggregatedMetricsService from "./aggregated-metrics-service";


/** */
export class AlertService {

  private aggregatedMetricsService: AggregatedMetricsService;

  constructor() {
    this.aggregatedMetricsService = new AggregatedMetricsService();
  }

  /***/
  async counts(user: any): Promise<{ "total": number, "unread": number }> {
    KiwiPreconditions.checkArgumentDefined(user.id);
    const total = await Alert.countDocuments({ userId: user.id }).exec();
    const unread = await Alert.countDocuments({ userId: user.id, readState: AlertReadState.UNREAD }).exec();
    return { total, unread };
  }

  /** */
  async findByUserPaged(user: any, perPage = 10, page = 1, skip = 0, sortDir = "desc"): Promise<KiwiPage> {
    KiwiPreconditions.checkArgumentDefined(user.id);
    const total: number = await Alert.countDocuments({ userId: user.id });
    const alerts: AlertDoc[] = await Alert.find({ userId: user.id })
      .sort({ "createdAt": sortDir === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(perPage)
      .exec();
    return KiwiPage.of(page, perPage, total, alerts).usingOneAsFirstPage().addKiwiSort(KiwiSort.of("createdAt", sortDir));      
  }

  /** */
  async findById(alertId: string): Promise<AlertDoc> {
    KiwiPreconditions.checkArgumentNotBlank(alertId);
    const ret = await Alert.findById(alertId);
    if (!ret) {
      logger.error(`AlertService.findById:  alertId ${alertId} not found`);
    }
    return ret;
  }

  /** */
  async createAlert(alert: Partial<IAlert>): Promise<AlertDoc> {
    KiwiPreconditions.checkArgumentDefined(alert);
    const { value, error } = AlertValidator.validate(alert);
    if (error) {
      logger.info(error);
      throw new Error(`AlertService.createAlert`, { cause: error });
    }
    return await new Alert({ ...value }).save();
  }  

  /** */
  async updateAlert(id: string, updates: Partial<IAlert>): Promise<AlertDoc> {
    return await Alert.findByIdAndUpdate({ _id: id }, updates, { new: true }).exec();
  }

  /** */
  async findProcessedEventIds(user: any, type: AlertType, gteDate: Date): Promise<Set<string>> {
    const events = await Alert.find({
      userId: user.id,
      type,
      createdAt : { $gte : gteDate }
    }).exec();
    return new Set(events.map(i => i.meta?.eventId).filter(i => i));
  }

  /** */
  async createAlertsFromPublishedEventLogs(user: any): Promise<AlertDoc[]> {
    KiwiPreconditions.checkArgumentDefined(user);
    KiwiPreconditions.checkArgumentDefined(user.organization);
    const KEY = "lastSearchProductPublishEventDate";
    const userInfo = await UserInfo.findByUserId(user.id);
    const searchDate: Date = userInfo.getMeta(KEY);
    const newSearchDate = Date.now();
    const events = await this.aggregatedMetricsService.getRecentPublishedForOrg(user.organization, searchDate);
    const existingEventIds = await this.findProcessedEventIds(user, AlertType.PRODUCT_PUBLISHED, searchDate);
    const alerts = [];
    for (const e of events) {
      if (existingEventIds.has(e.eventId)) {
        logger.info(`skipping event ${e.eventId}`);
        continue;
      }
      const alert = await this.createAlert({
        title: `Product published on ${e.datePublished}`,
        message: e.title,
        userId: user.id,
        createdBy: user.id,
        type: AlertType.PRODUCT_PUBLISHED,
        readState: AlertReadState.UNREAD,
        productNumber: e.productId,
        meta: {
          eventId: e.eventId
        }
      });
      logger.info(`created alert ${alert.id} from event ${e.eventId}`);
      alerts.push(alert);
    }
    userInfo.setMeta(KEY, newSearchDate);
    return Promise.resolve(alerts);
  }
}

export default AlertService;
