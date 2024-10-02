const userModels = require('../models/userModels');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { uploadCloudinary } = require('../utils/cloudinary');

module.exports.signUp = async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // Check if all required fields are provided
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    }

    try {
        // Check if the email already exists in the database
        const existingEmail = await userModels.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                msg: 'Email already exists'
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await userModels.create({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        // Respond with success message and created user data
        return res.status(201).json({
            success: true,
            msg: "User registered successfully",
            user
        });

    } catch (error) {
        // Log the error and respond with a 500 status code for server errors
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};


module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "All fields are required"
        });
    }

    try {
        // Find the user by email
        const user = await userModels.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User does not exist"
            });
        }

        // Compare provided password with the stored hashed password
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                msg: "Invalid password"
            });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return success response with token and user info (excluding password)
        return res.status(201).json({
            success: true,
            msg: "User logged in successfully",
            token,
            user
        });

    } catch (error) {
        // Log the error and return a server error message
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

module.exports.getUserProfile = async (req, res) => {
    const userId = req.params.id; // Get the user ID from request parameters

    try {
        // Find the user by ID and populate posts, bookmarks, and likes
        const user = await userModels.findById(userId)
            .populate({ path: 'posts', options: { sort: { createdAt: -1 } } }) // Sort posts by creation date
            .populate('bookmarks') // Populate the bookmarks
            .populate('likes'); // Populate the likes

        // Check if the user was not found, and return a 404 error if so
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Return the user profile in a success response
        res.status(200).json({
            success: true,
            msg: "User profile successfully retrieved",
            user
        });
    } catch (error) {
        // Log the error and return a 500 status for server errors
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};


module.exports.SuggestedUser = async (req, res) => {
    const userId = req.params.id; // Correct the variable name for better readability

    try {
        // Find user by ID and exclude the password from the response
        const user = await userModels.find({ _id: { $ne: userId } }).select("-password");

        // If user is not found, return 404 Not Found
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Return success response with the user profile
        res.status(200).json({
            success: true,
            msg: "User other successfully retrieved",
            user
        });
    } catch (error) {
        // Handle any server errors
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
};

module.exports.followIngOrUnfolow = async (req, res) => {
    const loggedUserId = req.user.id;
    const targetedUserId = req.params.id;

    try {
        // Find both users
        const loggedUser = await userModels.findById(loggedUserId);
        const targetedUser = await userModels.findById(targetedUserId);

        // Check if both users exist
        if (!loggedUser || !targetedUser) {
            return res.status(404).json({
                success: false,
                msg: "Users not found"
            });
        }

        // Check if the logged user is already following the targeted user
        const isFollowing = loggedUser.following.includes(targetedUserId);

        if (isFollowing) {
            // Unfollow
            await userModels.findByIdAndUpdate(loggedUserId, { $pull: { following: targetedUserId } });
            await userModels.findByIdAndUpdate(targetedUserId, { $pull: { followers: loggedUserId } });

            return res.status(200).json({
                success: true,
                msg: `Unfollowed ${targetedUser.username}` // Add a label with the targeted user's name
            });
        } else {
            // Follow
            await userModels.findByIdAndUpdate(loggedUserId, { $push: { following: targetedUserId } });
            await userModels.findByIdAndUpdate(targetedUserId, { $push: { followers: loggedUserId } });

            return res.status(200).json({
                success: true,
                msg: `Followed ${targetedUser.username}` // Add a label with the targeted user's name
            });
        }
    } catch (error) {
        console.error("Error in follow/unfollow operation:", error);
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};

module.exports.editProfile = async (req, res) => {
    const userId = req.user.id;
    const { fullName, bio, location, website } = req.body;
    const profilePicturePath = req.files?.profileImg?.[0]?.path || null;
    const coverImgPicturePath = req.files?.coverImg?.[0]?.path || null;

    try {
        const user = await userModels.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "User is Unauthorized"
            });
        }

        // Handle profile picture upload
        if (profilePicturePath) {
            // Delete the old profile image if it exists
            if (user.profileImg?.public_id) {
                await cloudinary.uploader.destroy(user.profileImg.public_id);
            }
            // Upload the new profile image
            const uploadResult = await uploadCloudinary(profilePicturePath, "Profile_pic");
            user.profileImg = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        }

        // Handle cover image upload
        if (coverImgPicturePath) {
            // Delete the old cover image if it exists
            if (user.coverImg?.public_id) {
                await cloudinary.uploader.destroy(user.coverImg.public_id);
            }
            // Upload the new cover image
            const uploadResult = await uploadCloudinary(coverImgPicturePath, "cover_img");
            user.coverImg = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        }

        // Update user fields directly
        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (location) user.location = location;
        if (website) user.website = website;

        // Save the updated user to the database
        await user.save();

        return res.status(200).json({ success: true, msg: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ success: false, msg: "Internal Server Error", error: error.message });
    }
};
