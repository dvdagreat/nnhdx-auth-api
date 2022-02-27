import { Request, Response } from "express";
import { IResponse, ResponseStatuses } from "../types/types";
import { validateLogin } from "../validators";
import jwt from "jsonwebtoken";
import User from "../../database/models/user.model";
import bcrypt from "bcryptjs";
import { generateResponse } from "../functions/responses";

export async function login (req: Request, res: Response) {
    // check for user data in request
    if (!req.body.user) {
        return res
            .status(401)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "User data not provided"
                )
            );
    }

    // validate received user data
    let requestUser = req.body.user;
    try {
        await validateLogin(requestUser);
    } catch (err: any) {
        return res
            .status(401)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    err.details[0].message
                ) as IResponse
            );
    }

    // check if user exists in database
    let dbUser: any = {};
    try {
        dbUser = await User.findOne({ username: requestUser.username });
        if (!dbUser) {
            return res
                .status(401)
                .json(
                    generateResponse(
                        ResponseStatuses["f"],
                        "No User found"
                    ) as IResponse
                );
        }
    } catch (err: any) {
        const response: IResponse = {
            status: ResponseStatuses["f"],
            message: err.errors[0].message,
        };
        return res
            .status(400)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    err.errors[0].message
                ) as IResponse
            );
    }

    // validate password
    try {
        const validPassword = await bcrypt.compare(
            requestUser.password,
            dbUser.password
        );
    } catch (err) {
        return res
            .status(401)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "Incorrect password for given user"
                ) as IResponse
            );
    }

    const user = {
        username: dbUser.username,
        uid: dbUser._id,
    };

    // create jwt token
    const token: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
    return res.status(200).json(
        generateResponse(ResponseStatuses["s"], "Successfully logged In", {
            token,
        }) as IResponse
    );
}
