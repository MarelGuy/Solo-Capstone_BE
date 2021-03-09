const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        nickname: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            required: [true, "Email address is required"],
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ]
        },
        avatar: String,
        password: { type: String, required: true }
    }
)

module.exports = mongoose.model("users", userSchema)