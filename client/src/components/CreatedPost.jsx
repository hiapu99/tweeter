import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { FaImages } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { setTweet, toggleRefresh, setActive } from '../redux/tweets';
import { Oval } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

const CreatePost = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user, profile } = useSelector(store => store.auth);
  const token = localStorage.getItem('token');
  const { isActive } = useSelector(store => store.tweet);
  const [caption, setCaption] = useState('');
  const [images, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    if (images) {
      formData.append('images', images);
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:9000/api/post', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        dispatch(toggleRefresh());
        toast.success('Post created successfully');
        setCaption('');
        setImage(null);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setCaption((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Set default active tab to "For You"
  return (
    <div className="w-full border-b text-white">
      <div className="flex items-center justify-between border-b">
        <div
          onClick={() => dispatch(setActive(true))}
          className={`cursor-pointer hover:bg-gray-200/10 w-full text-center text-sm font-semibold px-4 py-3 ${isActive ? 'border-b-2 border-blue-500' : ''}`}
        >
          <h1>For You</h1>
        </div>
        <div
          onClick={() => dispatch(setActive(false))}
          className={`cursor-pointer hover:bg-gray-200/10 w-full text-center text-sm font-semibold px-4 py-3 ${!isActive ? 'border-b-2 border-blue-500' : ''}`}
        >
          <h1>Following</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center mb-4">
          <Link to={`/profile/${user?._id}`}>
            <Avatar src={user?.profileImg?.secure_url} size="30" round={true} />
          </Link>
          <input
            type="text"
            placeholder="What is happening?"
            className="w-full outline-none border-none text-sm px-4 ml-2 bg-black"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-blue-500 cursor-pointer">
            <FaImages />
            <label htmlFor="image-upload" className="ml-2 cursor-pointer">
              Add Photo
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {/* Emoji Picker */}
            <div className="mb-2 relative">
              <button
                type="button"
                className="text-sm mt-2 p-1 hover:bg-gray-200 rounded"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                😀
              </button>
              {showEmojiPicker && (
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  style={{ position: 'absolute', bottom: '100%', left: 0 }}
                  theme="light"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#109BF0] px-3 py-1 text-sm text-white font-semibold rounded-full flex items-center"
            disabled={loading}
          >
            {loading ? (
              <Oval
                height={20}
                width={20}
                color="#ffffff"
                visible={true}
                ariaLabel="loading"
                secondaryColor="#ffffff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              'Tweet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
