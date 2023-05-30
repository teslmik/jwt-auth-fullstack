import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../exeptions/api-error.js';

function errorMiddleware(err: typeof ApiError, req: Request, res: Response, next: NextFunction) {
  console.log('err: ', err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
}

export default errorMiddleware;
