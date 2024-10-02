const postModels = require('../models/postModels');
const userModels = require('../models/userModels');
const commentModels = require('../models/commentModels');
const { uploadCloudinary } = require('../utils/cloudinary');

// Create a new post
module.exports.createPost = async (req, res) => {
    const { caption } = req.body;
    const postPicture = req?.file?.path;
    const userId = req.user.id;

    try {
        // Find the user
        const user = await userModels.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User is Unauthorized"
            });
        }

        let cloudResponse;
        if (postPicture) {
            cloudResponse = await uploadCloudinary(postPicture, "Post_images");
        }

        // Create a new post
        const post = await postModels.create({
            caption,
            images: cloudResponse?.secure_url || null,
            author: userId
        });

        // Add the post ID to the user's posts array
        await userModels.findByIdAndUpdate(
            userId,
            { $push: { posts: post._id } }, // Push the post ID into the posts array
            { new: true, useFindAndModify: false } // Options to return the updated user document
        );

        return res.status(201).json({
            success: true,
            msg: "Post created successfully",
            post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

// Fetch all posts with user and comment details
module.exports.fiendPhoto = async (req, res) => {
    try {
        // Find and sort posts by creation time
        const posts = await postModels.find().sort({ createdAt: -1 }).populate({
            path: "author",
            select: "username profileImg fullName"
        }).populate({
            path: "comments",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "author",
                select: "username profileImg"
            }
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Posts not found"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Posts retrieved successfully",
            posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

module.exports.following = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the current user and get their following list
        const user = await userModels.findById(userId).select('following');
        if (!user || !user.following || user.following.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "You are not following any users"
            });
        }

        // Fetch posts from users the current user is following, excluding the logged-in user's posts
        const followedPosts = await postModels.find({
            author: { $in: user.following },
            // Exclude the logged-in user's posts
            author: { $ne: userId }
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profileImg"
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profileImg"
                }
            });

        if (!followedPosts || followedPosts.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No posts found from users you are following"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Posts retrieved successfully",
            followedPosts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

module.exports.addComment = async (req, res) => {
    const { comments } = req.body; // Ensure this matches your comment schema
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await postModels.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, msg: "Post not found" });
        }

        const newComment = await commentModels.create({
            comments, // Use the correct field name
            post: postId,
            author: userId
        });

        // Push the new comment ID to the post's comments array
        post.comments.push(newComment._id);
        await post.save();

        return res.status(201).json({
            success: true,
            msg: "Comment created successfully",
            comment: newComment
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
}
module.exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you have user authentication and the user's ID is available

    try {
        // Find the post by its ID
        const post = await postModels.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, msg: "Post not found" });
        }

        // Check if the user deleting the post is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({ success: false, msg: "Unauthorized to delete this post" });
        }

        // Delete the post
        await postModels.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            msg: "Post deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ success: false, msg: 'Failed to delete post' });
    }
};


module.exports.likeOrUnlike = async (req, res) => {
    const userId = req.user.id;  // Get the current user ID from the authenticated user
    const postId = req.params.id; // Get the post ID from request parameters

    try {
        // Find the post by its ID
        const post = await postModels.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            });
        }

        // Check if the user has already liked the post
        const isLikedPost = post.likes.includes(userId);

        if (isLikedPost) {
            // If the post is already liked, remove the user's like (unlike)
            post.likes = post.likes.filter(like => like.toString() !== userId.toString());
            await post.save();

            // Remove the post from the user's likes array
            await userModels.findByIdAndUpdate(
                userId,
                { $pull: { likes: post._id } }, // Remove post from user's likes
                { new: true } // Return the updated user document
            );

            return res.status(200).json({
                success: true,
                msg: "Post unliked successfully",
                post
            });
        } else {
            // If the post is not liked yet, add the user's like
            post.likes.push(userId);
            await post.save();

            // Add the post to the user's likes array
            await userModels.findByIdAndUpdate(
                userId,
                { $push: { likes: post._id } }, // Push the post ID into the user's likes array
                { new: true } // Return the updated user document
            );

            return res.status(200).json({
                success: true,
                msg: "Post liked successfully",
                post,
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};



module.exports.bookmarkOrRemove = async (req, res) => {
    const userId = req.user.id;  // Get the current user ID from the authenticated user
    const postId = req.params.id; // Get the post ID from request parameters

    try {
        // Check if userId is present (this might not be necessary since req.user should already be authenticated)
        if (!userId) {
            return res.status(401).json({
                success: false,
                msg: "User not found"
            });
        }

        // Find the user by their ID
        const user = await userModels.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Find the post by its ID
        const post = await postModels.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            });
        }

        // Check if the user has already bookmarked the post
        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
            // If the post is already bookmarked, remove it from the user's bookmarks array
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() !== postId.toString());
            await user.save();
            return res.status(200).json({
                success: true,
                msg: "Post removed from bookmarks successfully",
                bookmarks: user.bookmarks
            });
        } else {
            // If the post is not bookmarked yet, add it to the user's bookmarks array
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({
                success: true,
                msg: "Post bookmarked successfully",
                user
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};
