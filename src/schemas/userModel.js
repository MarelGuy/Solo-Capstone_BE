const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
        favourites: [{ scpId: { type: mongoose.Schema.Types.ObjectId, ref: "scps", required: true } }],
        refreshToken: [{ token: { type: String } }],
        avatar: String,
        password: { type: String, required: true },
        role: {
            type: String, required: true, enum: ["Admin", "User"]
        }
    }
)

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    delete userObject.refreshTokens;
    return userObject;
};

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) return user;
        else return null;
    } else {
        return null;
    }
};

userSchema.pre("save", async function (next) {
    const user = this;
    const plainPW = user.password;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(plainPW, 10);
    }
    next();
});

module.exports = mongoose.model("users", userSchema)