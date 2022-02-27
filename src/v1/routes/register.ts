import { Request, Response } from "express";
import { IResponse, ResponseStatuses } from "../types/types";
import { validateRegister } from "../validators";
import User from "../../database/models/user.model";
import bcrypt from "bcryptjs";
import { generateResponse } from "../functions/responses";

export async function register(req: Request, res: Response) {
    // check for user data in request
    if (!req.body.user) {
        return res
            .status(401)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "User data not provided"
                ) as IResponse
            );
    }

    // validate received user data
    let requestUser = req.body.user;
    try {
        const userValidation: any = await validateRegister(requestUser);
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

    // check if user does not exists in database
    try {
        const dbUser = await User.findOne({
            username: requestUser.username,
            email: requestUser.email,
        });
        if (dbUser) {
            return res
                .status(401)
                .json(
                    generateResponse(
                        ResponseStatuses["f"],
                        "User with same username or email already exists"
                    ) as IResponse
                );
        }
    } catch (err: any) {
        return res
            .status(401)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "Error when fetching User records. " + err
                ) as IResponse
            );
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(requestUser.password, salt);

    const newUser = new User({
        username: requestUser.username,
        email: requestUser.email,
        password: hashedPassword,
    });

    // save the user to the database
    try {
        await newUser.save();
        return res
            .status(200)
            .json(
                generateResponse(
                    ResponseStatuses["s"],
                    "Successfully registered, you can now login"
                ) as IResponse
            );
    } catch (err: any) {
        return res
            .status(400)
            .json(
                generateResponse(
                    ResponseStatuses["f"],
                    "There was some problem while registering this user: " + err
                ) as IResponse
            );
    }
}
