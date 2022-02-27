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
