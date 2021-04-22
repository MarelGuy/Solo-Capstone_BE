const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    for: { type: mongoose.Types.ObjectId },
    likes: [{
        userId: mongoose.Types.ObjectId,
    },]
}, {
    timestamps: true
})

module.exports = mongoose.model("docs", docSchema)