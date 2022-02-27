import { NextFunction, Request, Response } from "express";
import { IResponse, ResponseStatuses } from "../types/types";
import { validateLogin } from "../validators";
import jwt from "jsonwebtoken";
import User from "../../database/models/user.model";
import bcrypt from "bcryptjs";
import { generateResponse } from "../utilities/responses";

class LoginServices {
    async login(requestUser: any) {  
        try {
            return User.findOne({ username: requestUser.username });
        } catch (err: any) {
           console.error(err);
        }
    }

    async validatePassword(userPassword: string, dbPassword: string): Promise<boolean> {
        return bcrypt.compare(
            userPassword,
            dbPassword
        );
    }

    createToken(user: { username: string,uid: string }): string {
       return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
    }
}

export const loginServices = new LoginServices();