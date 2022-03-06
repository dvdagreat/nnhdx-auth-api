// vendor imports
import { Router, Request, Response, NextFunction } from "express";

// custom imports
import LoginController from "@v1/library/LoginController";
import RegisterController from "@v1/library/RegisterController";
import VerifyController from "@v1/library/VerifyController";
import RefreshController from "@v1/library/RefreshController";

export default function v1(dependencies: any) {
    const router = Router();

    // login route
    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
        LoginController.route(req, res, next, dependencies);
    });

    // register route
    router.post("/register", (req: Request, res: Response, next: NextFunction) => {
        RegisterController.route(req, res, next, dependencies);
    });

    // refresh token
    router.post("/refreshToken", (req: Request, res: Response, next: NextFunction) => {
        RefreshController.route(req, res, next, dependencies);
    });

    // verify token
    router.post("/verify", (req: Request, res: Response, next: NextFunction) => {
        VerifyController.route(req, res, next, dependencies);
    });

    return router;
}
