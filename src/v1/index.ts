import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IResponse, ResponseStatuses } from "./types/types";
import { generateResponse } from "./functions/responses";
import { login } from "./routes/login";
import { register } from "./routes/register";

const router = Router();

// @route: login route
router.post("/login", login);

// @route: register route
router.post("/register", register);

// @route: refresh token
router.post("/refreshToken", (req: Request, res: Response) => {});

// @route: verify token
router.post("/verify", (req: Request, res: Response) => {
    const token = req.body.token;
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        const response: IResponse = {
            status: ResponseStatuses["s"],
            message: "This token is valid",
        };
        return res
            .status(200)
            .json(
                generateResponse(
                    ResponseStatuses["s"],
                    "This token is valid"
                ) as IResponse
            );
    } catch (err) {
        return res
            .status(400)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "This token is invalid"
                ) as IResponse
            );
    }
});

export default router;
