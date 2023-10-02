import express, { Request, Response } from "express";

import {
  KiwiPreconditions,
  KiwiStandardResponsesExpress,
} from "@kiwiproject/kiwi-js";
import { config } from "../config/config";
import { logger } from "../config/logger";
import { UserAlertService } from "../services/user-alert-service";
import { legacyErrorResponse } from "../util/errors";
import { pagingParams, runAsUser } from "../util/request";
import { UserAlertReadState, IUserAlert } from "../models/user_alert";

const router = express.Router();
const userAlertService = new UserAlertService();

// GET
router.get("/user_alerts/counts", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alert counts'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {
      schema: {
        total: 'total count',
        unread: 'unread count'
      }
    }
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        logger.info("GET /user_alerts/counts:  user %s");
        const counts = await userAlertService.counts(currentUser);
        KiwiStandardResponsesExpress.standardGetResponseWithMessage(
          counts,
          "error alert count",
          res,
        );
      } catch (error) {
        logger.error(error);
        const errorDetails = `Unable to get alert counts: ${error.message}`;
        // KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res);
        legacyErrorResponse(500, errorDetails, res);
      }
    },
  );
});

// GET
router.get("/user_alerts/list", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alerts paged'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definition/UserAlerts'
      }
    }
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      const { perPage, page, skip, sortDir } = pagingParams(req);
      try {
        logger.info("GET /user_alerts/list:  user %s", currentUser.id);
        const kiwiPage = await userAlertService.findByUserPaged(
          currentUser,
          perPage,
          page,
          skip,
          sortDir,
        );
        KiwiStandardResponsesExpress.standardGetResponseWithMessage(
          kiwiPage,
          "error get alert list",
          res,
        );
      } catch (error) {
        logger.error(error);
        const errorDetails = `Unable get alerts paged: ${error.message}`;
        // KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res);
        legacyErrorResponse(500, errorDetails, res);
      }
    },
  );
});

// GET
router.get("/user_alerts/id/:alertId", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alert by id'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definition/UserAlerts'
      }
    }
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        const alertId = req.params.alertId;
        logger.info("GET /user_alerts/id/%s:  user %s", alertId, currentUser.id);
        const alert = await userAlertService.findById(alertId as string);
        if (alert.userId !== currentUser.id) {
          const errorDetails = `Alert ${alert.id} user id ${alert.userId} does not match requesting user id ${currentUser.id}`;
          logger.error(errorDetails);
          legacyErrorResponse(403, errorDetails, res);
          return;
        } else {
          KiwiStandardResponsesExpress.standardGetResponseWithMessage(
            alert,
            "error get alert",
            res,
          );
        }
      } catch (error) {
        logger.error(error);
        const errorDetails = `Unable to get alert by id: ${error.message}`;
        // KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res);
        legacyErrorResponse(500, errorDetails, res);
      }
    },
  );
});

// POST
router.post("/user_alerts/", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'New alert'
    #swagger.tags = ['Alert']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definition/UserAlerts'
      }
    }
  */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        logger.info(
          "POST /user_alerts/:  user %s, alert title %s",
          currentUser.id,
          req.body.title,
        );
        const alert: IUserAlert = {
          title: req.body.title,
          message: req.body.message,
          userId: req.body.userId,
          productNumber: req.body.productNumber,
          alertType: req.body.alertType,
          readState: UserAlertReadState.UNREAD,
          eventLogId: req.body.eventLogId,
          meta: req.body.meta,
          createdBy: currentUser.id,
        };
        const alertDoc = await userAlertService.createAlert(alert);
        KiwiStandardResponsesExpress.standardPostResponse(
          `${config.basePath}/user_alerts/${alertDoc.id}`,
          alertDoc,
          res,
        );
      } catch (error) {
        logger.error(error);
        const errorDetails = `${error.message}`;
        KiwiStandardResponsesExpress.standardErrorResponse(
          500,
          errorDetails,
          res,
        );
        console.log("Unable to create alert", error);
      }
    },
  );
});

// PUT
router.put("/user_alerts/:alertId", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Update alert'
    #swagger.tags = ['Alert']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definition/UserAlerts'
      }
    }
  */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        const updates: Partial<IUserAlert> = {
          title: req.body.title,
          message: req.body.message,
          readState: req.body.readState,
          meta: { ...req.body.meta },
        };
        const alertDoc = await userAlertService.updateAlert(
          req.query.alertId as string,
          updates,
        );
        KiwiStandardResponsesExpress.standardPutResponse(alertDoc, res);
      } catch (error) {
        logger.error(error);
        const errorDetails = `${error.message}`;
        KiwiStandardResponsesExpress.standardErrorResponse(
          500,
          errorDetails,
          res,
        );
        console.log("Unable to update alert", error);
      }
    },
  );
});

export const userAlertsRouter = router;
export default router;
