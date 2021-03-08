const mongoose = require('mongoose')

const forumSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        title: { type: String, required: true },
        subTitle: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("forums", forumSchema)