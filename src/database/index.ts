import mongoose from "mongoose";
import Users from "@database/Users";

const DB_HOST: string = process.env.DB_HOST!;

async function connectDatabase(host: string) {
    try {
        await mongoose.connect(host);
        console.log(
            "Auth API has successfully established connection to the database"
        );
    } catch (err) {
        console.log("AUTH API DB error: cannot start server. " + err);
    }
}

connectDatabase(DB_HOST)

export default {
    Users
}
