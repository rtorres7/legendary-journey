import express, { Request, Response } from "express";

import { KiwiStandardResponsesExpress } from "@kiwiproject/kiwi-js";

// import ProductService from '../services/product-service';
// import WorkspaceService from "../services/workspace";

import { runAsUser } from "../util/request";
import { Err } from "joi";
import { logger } from "../config/logger";

const router = express.Router();

router.post("/test/product", async (req: Request, res: Response) => {
  /*
    #swagger.summary = 'Generate a randomized product'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/FeaturesAndBriefs'
      }
    }
  */
  await runAsUser(
    req,
    res,
    async (currentUser: any, req: Request, res: Response) => {
      try {
        // req.body
        KiwiStandardResponsesExpress.standardGetResponseWithMessage(
          null,
          "not implemented exception",
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
        console.log("Unable to find features and briefs", error);
      }
    },
  );
});

export default router;
