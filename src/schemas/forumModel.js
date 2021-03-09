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
    subTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        content: {
            type: String
        }
    }, {
        timestamps: true
    }],
    categories: [{
        type: String,
        required: true,
        min: 1
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("forums", forumSchema)