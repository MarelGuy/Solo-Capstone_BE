const mongoose = require("mongoose");

const scpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
    },
    item: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        userId: mongoose.Types.ObjectId,
    },],
    linked_Documents: [{
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("scps", scpSchema);