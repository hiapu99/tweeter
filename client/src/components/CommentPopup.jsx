import React, { useState } from 'react';
import Comment from './Comment';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRefresh } from '../redux/tweets';

const CommentPopup = ({ onClose, tweet }) => {
  const [comments, setComments] = useState(''); // State to hold the current comment input
  const [commentses, setCommentses] = useState(tweet.comments || []); // Initialize comments with tweet comments
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { user } = useSelector(store => store.auth); // Access logged-in user data

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:9000/api/post/${tweet._id}/comments`,
        {
          userId: user._id, // Send user ID
          comments, // Send the new comment
        },
        {
          headers: {
            "Authorization": token, // Use Bearer token for Authorization header
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(toggleRefresh()); // Trigger refresh or update action in Redux
        onClose()
        setCommentses((prevCommentses) => [...prevCommentses, res.data.comment]); // Add new comment to the list
        setComments(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      {/* Popup Container */}
      <div className="bg-gray-900 text-white w-full max-w-lg mx-4 rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 focus:outline-none"
          aria-label="Close comments"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">
          Comments for Post
        </h2>

        {/* Comments Section */}
        <div className="space-y-4 overflow-y-auto max-h-60 pr-2">
          {commentses.length ? (
            commentses.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700"
              >
                <Comment comment={comment} tweet={tweet} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments available.</p>
          )}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <input
            type="text"
            value={comments} // Use the comments state for input
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentPopup;
