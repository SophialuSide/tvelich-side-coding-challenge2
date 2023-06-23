import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

/**
 * Any yup validation error is handled here and sent back to the user as a 400
 * with the validation errors array.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default function requestValidationMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Even though this is input-driven, it can be good for APM tooling to track
  // trends and spikes to alert on
  console.warn(`[${req.path}]: ${err.message}`);

  if (err instanceof ValidationError) {
    res.status(400).json({
      message: err.message,
      validationErrors: err.errors,
    });
  } else {
    next(err);
  }
}
