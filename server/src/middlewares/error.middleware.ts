import { Request, Response } from "express";

import { ApiError } from "../exeptions/api-error.js";

const errorMiddleware = (err: typeof ApiError, req: Request, res: Response) => {
  console.log(err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};

export { errorMiddleware };
