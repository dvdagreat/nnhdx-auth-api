import express, { Request, Response, NextFunction } from "express";

async function validateJsonBody(middleware: any, req: Request, res: Response, next: NextFunction) {
    // check if request body is in application/json
    if (!req.is("application/json")) {
        const response = {
            status: "failure",
            message: "Content-Type should be set to application/json",
        };
        return res.status(400).send(response);
    }

    // check if json body is in proper format
    middleware(req, res, (err: any) => {
        if (err) {
            const response = {
                status: "failure",
                message: "Improper JSON body",
            };
            return res.status(400).send(response);
        }
        next();
    });
}

export default function validateJsonBodyMiddleWare(req: Request, res: Response, next: NextFunction) {
    validateJsonBody(express.json(), req, res, next);
}
