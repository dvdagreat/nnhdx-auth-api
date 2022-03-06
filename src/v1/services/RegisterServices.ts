import Joi from "joi";
import bcrypt from "bcryptjs";

export default class RegisterServices {
    static async validateUser(data: object) {
        const schema = Joi.object({
            username: Joi.string().alphanum().min(6).max(18),
            email: Joi.string().email().min(3),
            password: Joi.string().min(6).max(20),
        });

        return (await schema.validateAsync(data)) as object;
    }

    static async doesUserExist(dependencies: any, userFromRequest: any) {
        const DB = dependencies.database;
        const userFromDB = await DB.Users.getOne({ $or: [{ username: userFromRequest.username }, { email: userFromRequest.email }] });
        return userFromDB || false;
    }

    static async hashPassword(userFromRequest: any) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(userFromRequest.password, salt);
    }

    static async insertUser(dependencies: any, userObject: any) {
        const DB = dependencies.database;
        return await DB.Users.insertUser(userObject);
    }
}
