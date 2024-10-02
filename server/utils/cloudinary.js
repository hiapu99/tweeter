const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadCloudinary = async (filepath, folderName) => {
    try {
        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            folder: folderName
        });

        // Remove the local file after successful upload
        try {
            fs.unlinkSync(filepath);
        } catch (error) {
            console.error("Error deleting local file:", error);
        }

        // Return the upload result containing secure URL and public ID
        return {
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error('Cloudinary upload failed'); // Optional: Rethrow or handle the error as needed
    }
}

module.exports = { uploadCloudinary };
