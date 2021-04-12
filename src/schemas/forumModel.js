const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema({
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
    comments: [{
        type: new mongoose.Schema(
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            },
            {
                timestamps: true
            })
    }],
    likes: [{
        userId: mongoose.Types.ObjectId,
    },],
    categories: [{
        type: String,
        required: true,
        max: 3
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("forums", forumSchema)