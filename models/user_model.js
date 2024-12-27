
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    user_name: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    profile_photo: {
        type: String,
        required: false
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("user", userSchema)