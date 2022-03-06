// vendor imports
import { Request, Response, NextFunction } from "express";

// custom imports
import registerServices from "@v1/services/RegisterServices";
import { fail, success, sendJsonWithStatus } from "@v1/helpers/responses";

export default class RegisterController {
    static async route(req: Request, res: Response, next: NextFunction, dependencies: any) {
        // check for user data in request
        if (!req.body.user) {
            return sendJsonWithStatus(res, 401, fail("User data not provided"));
        }

        // validate received user data
        let userFromRequest = req.body.user;
        try {
            await registerServices.validateUser(userFromRequest);
        } catch (err: any) {
            return sendJsonWithStatus(res, 401, fail(err.details[0].message));
        }

        // check if user does not exists in database
        try {
            const userToVerify = {
                username: userFromRequest.username,
                email: userFromRequest.email,
            };
            const userFromDB = await registerServices.doesUserExist(dependencies, userToVerify);
            if (userFromDB) {
                return sendJsonWithStatus(res, 401, fail("User with same username or email already exists"));
            }
        } catch (err: any) {
            return sendJsonWithStatus(res, 401, fail("Error when fetching User records. " + err));
        }

        // hash the password
        const hashedPassword = await registerServices.hashPassword(userFromRequest);

        // save the user to the database
        try {
            const userToInsert = {
                username: userFromRequest.username,
                email: userFromRequest.email,
                password: hashedPassword,
            };
            await registerServices.insertUser(dependencies, userToInsert);
            return sendJsonWithStatus(res, 200, success("Successfully registered, you can now login"));
        } catch (err: any) {
            return sendJsonWithStatus(res, 400, fail("There was some problem while registering this user: " + err));
        }
    }
}
