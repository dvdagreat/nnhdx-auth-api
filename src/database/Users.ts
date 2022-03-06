import User from "@database/models/User";
import { IGetUserOptions } from "@database/types/User";

export default class Users {
    static async getAll() {
        return await User.find({});
    }

    static async getOne(options: any) {
        return await User.findOne(options);
    }

    static async inserOne(options: any) {
        const user = new User(options);
        return await user.save();
    }
}
