import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    gender: {
        type: String
    },
    domain: {
        type: String
    },
    available: {
        type: Boolean
    }
});

const User = mongoose.model("User", userSchema);

export default User;
