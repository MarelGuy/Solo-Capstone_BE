const mongoose = require('mongoose')

const scpSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        Item: { type: String, required: true },
        objectClass: { type: String, required: true, enum: ["Safe", "Euclid", "Keter"] },
        description: { type: String, required: true },
        image: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("scps", scpSchema)