// vendor imports
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// custom imports

export default class LoginServices {
    static async validateUser(data: object) {
        const schema = Joi.object({
            username: Joi.string().required().alphanum().min(6).max(18),
            password: Joi.string().required().min(6).max(20),
        });

        return (await schema.validateAsync(data)) as object;
    }

    static async doesUserExist(dependencies: any, user: any): Promise<boolean | Object> {
        const DB = dependencies.database;
        const userFromDB = await DB.Users.getOne({ username: user.username });
        return userFromDB || false;
    }

    static async doesPasswordMatch(userInput: any, userFromDB: any) {
        return await bcrypt.compare(userInput.password, userFromDB.password);
    }

    static async getToken(user: object) {
        const token: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
        return token;
    }
}
