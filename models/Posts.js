const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Posts', PostsSchema)