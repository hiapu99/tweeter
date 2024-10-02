const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true // Optional
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Basic email format validation
    },
    password: {
        type: String,
        required: true,
        // unique: true, // Not necessary
    },
    profileImg: {
        secure_url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        },
    },
    coverImg: {
        secure_url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
            default: ""
        },
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    bio: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
