import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { toggleRefresh } from '../redux/tweets';
import { ImUpload } from 'react-icons/im';

const EditProfile = ({ toggleEditProfile, profile }) => {
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        website: profile?.website || '',
    });
    const [loading, setLoading] = useState(false);
    const [profileImg, setProfileImg] = useState(null);
    const [coverImg, setCoverImg] = useState(null);
    const [profileImgPreview, setProfileImgPreview] = useState(profile?.profileImg.secure_url || '');
    const [coverImgPreview, setCoverImgPreview] = useState(profile?.coverImg.secure_url || '');

    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading before the request

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (profileImg) submissionData.append('profileImg', profileImg);
        if (coverImg) submissionData.append('coverImg', coverImg);

        try {
            const response = await axios.put('http://localhost:9000/api/profile/', submissionData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                dispatch(toggleRefresh());
                toggleEditProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false); // Stop loading after the request is complete
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-black/40 border rounded-lg shadow-sm p-8 w-full max-w-md">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <button
                        type="button"
                        onClick={toggleEditProfile}
                        className="py-1 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Cover Image */}
                    <div className="mb-6">
                        <label htmlFor="coverPic" className="block text-sm font-medium text-gray-700">
                            Cover Picture
                        </label>
                        <div className="relative mt-2 flex items-center justify-center rounded-lg h-32 -mb-[135px]">
                            <input
                                id="coverPic"
                                type="file"
                                onChange={(e) => handleImageChange(e, setCoverImg, setCoverImgPreview)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <ImUpload className="text-3xl text-gray-100" />
                        </div>
                        {coverImgPreview && (
                            <img
                                src={coverImgPreview}
                                alt="Cover Preview"
                                className="mt-2 w-full h-32 object-cover rounded-lg shadow-md"
                            />
                        )}
                    </div>

                    {/* Profile Image */}
                    <div className="mb-6 z-10 px-5 mt-12">
                        <div className="relative -mt-28 flex items-center justify-center rounded-full h-32 w-32 ">
                            <input
                                id="profilePic"
                                type="file"
                                onChange={(e) => handleImageChange(e, setProfileImg, setProfileImgPreview)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <ImUpload className="text-3xl text-gray-100" />
                        </div>
                        {profileImgPreview && (
                            <div className='-mt-[137px]'>
                                <img
                                    src={profileImgPreview}
                                    alt="Profile Preview"
                                    className="mt-2 w-32 h-32 rounded-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mt-2 bg-black block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <input
                            id="bio"
                            name="bio"
                            type="text"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Enter your bio"
                            className="mt-2 bg-black block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter your location"
                            className="mt-2 bg-black block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website
                        </label>
                        <input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Enter your website"
                            className="mt-2 bg-black block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="py-2 px-4 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="text-white text-lg font-bold">Loading...</div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
