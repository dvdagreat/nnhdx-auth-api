import { NextFunction, Response } from "express";
import { validateLogin } from "../validators";
import { loginServices } from "../services/LoginServices";

class LoginController {
    async login(req: any, res: Response, next: NextFunction) {
        // check for user data in request
        if (!req.body.user) {
            return next({message: "User data not provided", statusCode: 401 });
        }
    
        try {
            // validate received user data
            let requestUser = req.body.user;
            await validateLogin(requestUser);

            // check if user exists in database
            const dbUser = await loginServices.login(requestUser);
            if (!dbUser) {
                return next({message: "No User found", statusCode: 401 })
            }

             // validate password
            const validPassword = await loginServices.validatePassword(requestUser.password, dbUser.password);
            if (!validPassword) {
                return next({message: "Incorrect password for given user", statusCode: 401 })
            }

            const user = {
                username: dbUser.username,
                uid: dbUser._id.toString(),
            };
            
            const token = loginServices.createToken(user);
            req.statusCode = 200;
            req.message = {
                message: 'Successfully logged In',
                token
            }

        } catch (error: any) {
            return next({message: error.details[0].message, statusCode: 401 })
        }
    }
}

export const loginController = new LoginController();