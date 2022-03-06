import express, { Application } from "express";
import * as dotenv from "dotenv";

// import route handlers
import v1 from "@v1/index";

// middleware imports
import validateJsonBodyMiddleWare from "@src/middleware/JsonBodyValidator";

// bring in environment variables
dotenv.config();

export default function getApp(dependencies: object) {
    const app: Application = express();

    // add json body validator for all 'post' requests
    app.post("*", validateJsonBodyMiddleWare);
    app.use("/v1", v1(dependencies));
    return app;
}
