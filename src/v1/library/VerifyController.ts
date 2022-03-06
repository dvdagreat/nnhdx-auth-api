// vendor imports
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// custom imports
import { fail, success, sendJsonWithStatus } from "@v1/helpers/responses";

export default class VerifyController {
    static route(req: Request, res: Response, next: NextFunction, dependencies: any) {
        const token = req.body.token;
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
            return sendJsonWithStatus(res, 200, success("This token is valid"));
        } catch (err) {
            return sendJsonWithStatus(res, 400, fail("This token is invalid"));
        }
    }
}
