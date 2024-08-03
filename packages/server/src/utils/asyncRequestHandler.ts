import { NextFunction, Request, Response } from 'express';

export default function asyncRequestHandler(
  callback: (...args: [Request, Response, NextFunction]) => Promise<Response | void>,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
