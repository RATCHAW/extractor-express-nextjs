import { auth } from "../utils/auth";
import { type Request, type Response, type NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { ServiceResponse } from "@/common/utils/response";
import { StatusCodes } from "http-status-codes";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const user = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!user) {
    const serviceResponse = ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED);
    res.status(serviceResponse.statusCode).json(serviceResponse);
    return;
  }
  req.user = user;
  next();
}
