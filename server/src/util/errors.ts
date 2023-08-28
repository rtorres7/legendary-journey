import { Response } from "express";
// import { logger } from "../config/logger";

/**
 * Unforutunately cannot use KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res)
 * as the client keys off the 'error' property, while standardErrorResponse() uses a 'message' property.
 */ 
export const legacyErrorResponse = (code: number, errorDetails: string, res: Response) => {
  res
    .status(code)
    .json({
      code,
      message: errorDetails,
      error: errorDetails,
      fieldName: '',
      itemId: ''
    });
};

export default legacyErrorResponse;
