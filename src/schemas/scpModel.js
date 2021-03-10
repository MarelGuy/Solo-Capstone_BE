const mongoose = require("mongoose");

const scpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    item: {
        type: String,
        required: true,
        match: [/SCP-\w+/],
    },
    objectClass: {
        type: String,
        required: true,
        enum: [
            "Safe",
            "Euclid",
            "Keter",
            "Thaumiel",
            "Neutralized",
            "Explained",
            "Esoteric",
            "Narrative ",
            "Decommissioned",
            "Safe/Neutralized",
            "Safe/Explained",
            "Safe/Esoteric",
            "Safe/Narrative",
            "Safe/Decommissioned",
            "Euclid/Neutralized",
            "Euclid/Explained",
            "Euclid/Esoteric",
            "Euclid/Narrative",
            "Euclid/Decommissioned",
            "Keter/Neutralized",
            "Keter/Explained",
            "Keter/Esoteric",
            "Keter/Narrative",
            "Keter/Decommissioned",
            "Thaumiel/Neutralized",
            "Thaumiel/Explained",
            "Thaumiel/Esoteric",
            "Thaumiel/Narrative",
            "Thaumiel/Decommissioned",
        ],
        max: 1,
    },
    description: {
        type: String,
        required: true
    },
    containmentProcedures: {
        type: String
    },
    image: {
        type: String
    },
    likes: [{
        userId: mongoose.Types.ObjectId
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("scps", scpSchema);