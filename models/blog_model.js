
const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    image_url: {
        type: String,
        required: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("blog", blogSchema)


