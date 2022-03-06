// vendor imports
import { Request, Response, NextFunction } from "express";

// custom imports
import loginServices from "@v1/services/LoginServices";
import { fail, success, sendJsonWithStatus } from "@v1/helpers/responses";

export default class LoginController {
    static async route(req: Request, res: Response, next: NextFunction, dependencies: any) {
        // check if user data has been sent in the body
        if (!req.body.user) {
            return sendJsonWithStatus(res, 400, fail("User data is not provided"));
        }

        // validate user data
        let requestUser = req.body.user;
        try {
            await loginServices.validateUser(requestUser);
        } catch (err: any) {
            return sendJsonWithStatus(res, 400, fail(err.details[0].message));
        }

        // check if user exists in database
        let userFromDB: any = {};
        try {
            userFromDB = await loginServices.doesUserExist(dependencies, requestUser);
            if (!userFromDB) {
                return sendJsonWithStatus(res, 404, fail("User does not exist"));
            }
        } catch (err) {
            return sendJsonWithStatus(res, 400, fail("Some error while finding user, please try again later"));
        }

        // verify user password
        try {
            if (!(await loginServices.doesPasswordMatch(requestUser, userFromDB))) {
                return sendJsonWithStatus(res, 400, fail("Passwords do not match"));
            }
        } catch (err) {
            return sendJsonWithStatus(res, 400, fail("Error comparing passwords"));
        }

        // generate jwt token
        try {
            const user = {
                username: userFromDB.username,
                uid: userFromDB._id,
            };
            const token = await loginServices.getToken(user);
            return sendJsonWithStatus(res, 200, success("Successfully logged in", { token }));
        } catch (err) {
            return sendJsonWithStatus(res, 400, fail("Cannot login currently, Please try later"));
        }
    }
}
