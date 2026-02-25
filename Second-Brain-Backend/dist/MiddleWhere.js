import jwt, {} from "jsonwebtoken";
import { ResponseStatus } from "./index.js";
import { ENV } from "./config/env.js";
export async function MiddleWhere(req, res, next) {
    const token = req.headers.token;
    if (!token || Array.isArray(token)) {
        return res.status(ResponseStatus.NotFound).json({
            message: "Token is expired ",
        });
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_TOKEN);
        if (!decoded.userId) {
            return res.status(403).json({
                message: "Invalid token payload",
            });
        }
        console.log(decoded.userId);
        req.body.userId = decoded.userId;
        next();
    }
    catch (e) {
        return res.status(ResponseStatus.NotFound).json({
            message: "Invalid Token ",
        });
    }
}
//# sourceMappingURL=MiddleWhere.js.map