const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Ensuring the post has an author
    },
    caption: {
        type: String,
        default: ""
    },
    images: [
        {
            type: String, // Array to store multiple image URLs
            default: ""
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Post", postSchema);
