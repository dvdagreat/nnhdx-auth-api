// vendor imports
import { Request, Response, NextFunction } from "express";

// custom imports

export default class RefreshController {
    static route(req: Request, res: Response, next: NextFunction, dependencies: any) {
        const database: unknown = dependencies.database;
    }
}
