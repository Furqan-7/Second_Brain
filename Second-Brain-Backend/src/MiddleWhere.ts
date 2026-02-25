import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {ResponseStatus} from "./index.js";
import { ENV } from "./config/env.js";



export async function MiddleWhere(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token;

  if (!token || Array.isArray(token)) {
    return res.status(ResponseStatus.NotFound).json({
      message: "Token is expired ",
    });
  }

  interface TokenPayload{
    userId:string;
  }

   try{
       const decoded = jwt.verify(token,ENV.JWT_TOKEN) as TokenPayload;

       if(!decoded.userId){
         return res.status(403).json({
             message:"Invalid token payload",
         });
       }
       console.log(decoded.userId);
       req.body.userId = decoded.userId;
       next();
   }
   catch(e){
       return res.status(ResponseStatus.NotFound).json({
        message:"Invalid Token ",
       });
   }
}