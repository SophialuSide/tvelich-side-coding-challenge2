import { NextFunction, Request, Response } from 'express';

/**
 * Any unexpected error should send a 500 back as json and log the error on the
 * backend to avoid sending any sensitive information.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default function unexpectedErrorHandler(
  err: Error,
  req: Request,
  res: Response,
) {
  console.error(err);

  res.status(500).json({ message: 'Unexpected error occurred' });
}
