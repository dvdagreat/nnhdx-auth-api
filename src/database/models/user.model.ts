import mongoose from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true,
        min: 6,
        max: 18,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        max: 1024,
    },
});

export default mongoose.model<IUser>("User", userSchema);
