import express, {
    Application,
    Request,
    Response,
    NextFunction,
} from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

// import route handlers
import v1 from "./v1";
import { generateResponse } from "./v1/utilities/responses";
import { ResponseStatuses } from "./v1/types/types";

// bring in environment variables
dotenv.config();

const app: Application = express();
const PORT: string = process.env.NNHDX_AUTH_PORT!;
const DB_HOST: string = process.env.DB_HOST!;

function JsonBodyParseExceptionHandler(
    middleware: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // check if request body is in application/json
    if(!req.is('application/json')) {
        const response = {
            status: "failure",
            message: "Content-Type should be set to application/json",
        };
        return res.send(response);
    }

    // check if json body is in proper format
    middleware(req, res, (err: any) => {
        if (err) {
            const response = {
                status: "failure",
                message: "Improper JSON body",
            };
            return res.send(response);
        }
        next();
    });
}

// to check if proper json body is sent in request
app.use((req: Request, res: Response, next: NextFunction) => {
    JsonBodyParseExceptionHandler(express.json(), req, res, next);
});

app.use("/v1", v1);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (!error) {
        return next()
    }

    const errorResponse = {
        code: error.statusCode,
        message: error.message
    }
    
    return res.status(errorResponse.code)
                .json(
                    generateResponse(
                        ResponseStatuses["f"],
                        errorResponse.message
                    )
                );
});

app.use((req: any, res: Response, next: NextFunction) => {
    const response = {
        code: req.statusCode || 200,
        message: req.message || 'success'
    }

    return res.status(response.code)
                .json(
                    generateResponse(
                        ResponseStatuses["s"],
                        response.message
                    )
                );
});

async function startApp(): Promise<void> {
    try {
        await mongoose.connect(DB_HOST);
        console.log(
            "Auth API has successfully established connection to the database"
        );
        app.listen(PORT, () => {
            console.log("Auth API server has started on port " + PORT);
        });
    } catch (err) {
        console.log("AUTH API DB error: cannot start server. " + err);
    }
}

startApp();
