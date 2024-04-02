import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    members: {
        // Array of type ObjectId that references the User model
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        required: true
    }
});

const Team = mongoose.model("Team", teamSchema);

export default Team;