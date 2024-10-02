const express = require('express');
const { signIn, signUp, getUserProfile, SuggestedUser, followIngOrUnfolow, updateUser, editProfile } = require('../controller/userController');
const authorization = require('../middleware/auth');
const upload = require('../middleware/multer');
const { createPost, fiendPhoto, following, addComments, addComment, likeOrUnlike, bookmarkOrRemove, deletePost } = require('../controller/postController');
signIn
const router = express.Router();
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/profile/:id", authorization, getUserProfile);
router.get("/user/:id", authorization, SuggestedUser);
router.get("/follow/:id", authorization, followIngOrUnfolow);

router.put(
    '/profile',
    authorization,
    upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]),
    editProfile
);
router.post("/post",upload.single("images"), authorization, createPost)
router.get("/post", authorization, fiendPhoto)
router.get("/post/follow", authorization, following);
router.post("/post/:id/comments", authorization, addComment);
router.post("/post/:id/like", authorization, likeOrUnlike);
router.post("/post/:id/bookmark", authorization, bookmarkOrRemove);
router.delete("/post/:id/delete", authorization, deletePost);
module.exports = router