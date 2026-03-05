import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ResponseStatus } from "./index.js";
import { ENV } from "./config/env.js";

export async function MiddleWhere(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Extract token from request headers
  const token = req.headers.token;

  // Reject if token is missing or sent as an array
  if (!token || Array.isArray(token)) {
    return res.status(ResponseStatus.NotFound).json({
      message: "Token is expired ",
    });
  }



  interface TokenPayload {
    userId: string;
  }

  try {
    // Verify token signature and decode payload
    const decoded = jwt.verify(token, ENV.JWT_TOKEN) as TokenPayload;

    // Reject if token decoded to a plain string instead of an object
    if (typeof decoded === "string") {
      return res.status(403).json({
        message: "Invalid token format",
      });
    }

    // Reject if userId is missing from the payload
    if (!decoded.userId) {
      return res.status(403).json({
        message: "Invalid token payload",
      });
    }

  

      

    // Attach userId to request body and proceed to next middleware
     res.locals.userId = decoded.userId;
    next();
  } catch (e) {
    // Handle expired or tampered tokens
    return res.status(ResponseStatus.NotFound).json({
      message: "Invalid Token",
    });
  }
}
