import express, { Request, Response } from "express";

import {
  KiwiPreconditions,
  KiwiStandardResponsesExpress,
} from "@kiwiproject/kiwi-js";
import { config } from "../config/config";
import { logger } from "../config/logger";
import { AlertService } from "../services/alert-service";
import { legacyErrorResponse } from "../util/errors";
import { pagingParams, runAsUser } from "../util/request";
import { AlertReadState, IAlert } from "../models/alert";

const router = express.Router();
const alertService = new AlertService();

// GET
router.get("/alert/counts", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alert counts'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {}
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        logger.info("GET /alert/counts:  user %s");
        const counts = await alertService.counts(currentUser);
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
router.get("/alert/list", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alerts paged'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {}
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      const { perPage, page, skip, sortDir } = pagingParams(req);
      try {
        logger.info("GET /alert/list:  user %s", currentUser.id);
        const kiwiPage = await alertService.findByUserPaged(
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
router.get("/alert/id/:alertId", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Get alert by id'
    #swagger.tags = ['Alerts']
    #swagger.responses[200] = {}
   */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        const alertId = req.params.alertId;
        logger.info("GET /alert/id/%s:  user %s", alertId, currentUser.id);
        const alert = await alertService.findById(alertId as string);
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
router.post("/alert/", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'New alert'
    #swagger.tags = ['Alert']
    #swagger.responses[200] = {}
  */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        logger.info(
          "POST /alert/:  user %s, alert title %s",
          currentUser.id,
          req.body.title,
        );
        const alert: IAlert = {
          title: req.body.title,
          message: req.body.message,
          userId: req.body.userId,
          productNumber: req.body.productNumber,
          createdBy: currentUser.id,
          type: req.body.type,
          readState: AlertReadState.UNREAD,
          meta: req.body.meta,
        };
        const alertDoc = await alertService.createAlert(alert);
        KiwiStandardResponsesExpress.standardPostResponse(
          `${config.basePath}/alert/${alertDoc.id}`,
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
router.put("/alert/:alertId", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Update alert'
    #swagger.tags = ['Alert']
    #swagger.responses[200] = {}
  */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        const updates: Partial<IAlert> = {
          title: req.body.title,
          message: req.body.message,
          productNumber: req.body.productNumber,
          readState: req.body.readState,
          meta: { ...req.body.meta },
        };
        const alertDoc = await alertService.updateAlert(
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

export const alertsRouter = router;
export default router;
