const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comments: {
        type: String,
        required: true,
        trim: true // Trim whitespace
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Ensure that each comment has an author
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);
