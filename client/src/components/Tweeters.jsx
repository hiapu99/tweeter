import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegBookmark, FaRegComment, FaBookmark } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import Avatar from 'react-avatar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRefresh } from '../redux/tweets';
import CommentPopup from './CommentPopup';
import { Link } from 'react-router-dom';

const Tweeters = ({ tweet }) => {
    const [commentPopupOpen, setCommentPopupOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(tweet.comments || []);
    const { user, profile } = useSelector((store) => store.auth);
    const [liked, setLiked] = useState(tweet.likes.includes(user?._id));
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFollowing, setFollowing] = useState(false);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    // Check if the tweet is bookmarked in localStorage
    useEffect(() => {
        const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        setIsBookmarked(storedBookmarks.includes(tweet._id));
    }, [tweet._id]);

    // Helper function to make API requests
    const handleApiRequest = async (url, method, data = {}) => {
        try {
            const res = await axios({
                method,
                url: `http://localhost:9000/api/${url}`,
                data,
                headers: { Authorization: token },
            });
            return res.data;
        } catch (error) {
            console.error(`Error with ${method} request to ${url}:`, error);
            return null;
        }
    };

    // Toggle comments section visibility
    const toggleComments = () => setCommentPopupOpen((prev) => !prev);

    // Add a new comment
    const addComment = async () => {
        if (!newComment.trim()) return;

        const res = await handleApiRequest(`post/${tweet._id}/comment`, 'post', { comment: newComment });
        if (res?.success) {
            setComments((prevComments) => [...prevComments, res.comment]);
            setNewComment('');
            dispatch(toggleRefresh());
        }
    };

    // Handle tweet deletion
    const handleDelete = async (e) => {
        e.preventDefault();
        const res = await handleApiRequest(`post/${tweet._id}/delete`, 'delete');
        if (res?.success) {
            dispatch(toggleRefresh());
        }
    };

    // Toggle like status
    const handleLike = async () => {
        const res = await handleApiRequest(`post/${tweet._id}/like`, 'post');
        if (res?.success) {
            setLiked((prev) => !prev);
            dispatch(toggleRefresh());
        }
    };

// Toggle bookmark status
const handleBookmark = async () => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    // Toggle bookmark status in the frontend
    if (isBookmarked) {
        // Remove the tweet from bookmarks locally
        const updatedBookmarks = storedBookmarks.filter((id) => id !== tweet._id);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
    } else {
        // Add the tweet to bookmarks locally
        storedBookmarks.push(tweet._id);
        localStorage.setItem('bookmarks', JSON.stringify(storedBookmarks));
        setIsBookmarked(true);
    }

    // API request to update the bookmark status in the backend
    try {
        const res = await axios.post(
            `http://localhost:9000/api/post/${tweet._id}/bookmark`, 
            {}, // No data is necessary for this request
            {
                headers: {
                    "Authorization": token,
                },
            }
        );

        if (res.data.success) {
            // Optionally, you can handle success response here if needed
            dispatch(toggleRefresh());
        } else {
            console.error('Error updating bookmark status:', res.data.message);
        }
    } catch (error) {
        console.error('Error with API request:', error);
    }
};


    useEffect(() => {
        if (profile && user) {
            setFollowing(profile?.followers?.includes(user?._id));
        }
    }, [profile, user]);

    const handleFollowOrUnfollow = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/api/follow/${tweet?.author?._id}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (res?.data?.success) {
                setFollowing(!isFollowing);
                dispatch(toggleRefresh());
            }
        } catch (error) {
            console.error('Error following/unfollowing user', error);
        }
    };

    // Format tweet creation date
    const formattedDate = new Date(tweet.createdAt).toLocaleDateString();

    return (
        <div className="p-4 border-b border-gray-300 w-full max-w-3xl mx-auto text-white">
            <div className="flex flex-row">
                <Link to={`profile/${tweet?.author?._id}`}>
                    <Avatar src={tweet?.author?.profileImg?.secure_url} size="35" round />
                </Link>
                <div className="ml-4 w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-sm">{tweet?.author?.fullName}</h1>
                            <p className="text-gray-500 text-sm">
                                <span>@{tweet?.author?.username}</span> · {formattedDate}
                            </p>
                        </div>
                        {user?._id === tweet?.author?._id ? (
                            <button
                                className="px-2 py-1 rounded-full cursor-pointer text-sm font-semibold transition-colors duration-300 hover:bg-blue-500"
                                aria-label="Delete Tweet"
                                onClick={handleDelete}
                            >
                                <MdDeleteOutline size="24px" />
                            </button>
                        ) : null}
                    </div>
                    <p className="mt-2 text-gray-800">{tweet.caption}</p>
                    {tweet.images && (
                        <img
                            src={tweet.images}
                            alt="Tweet"
                            className="w-full h-56 lg:h-72 object-cover rounded-md border border-yellow-400 mt-2"
                        />
                    )}
                    <div className="flex justify-between mt-3 text-gray-500">
                        <div className="flex items-center cursor-pointer" onClick={handleLike}>
                            <div className="rounded-full p-1">
                                {liked ? <FaHeart size="25px" className="text-red-500" /> : <CiHeart size="25px" />}
                            </div>
                            <span className="ml-1">{tweet.likes.length}</span>
                        </div>
                        <button className="flex items-center" onClick={toggleComments}>
                            <div className="p-2 hover:bg-green-200/20 rounded-full">
                                <FaRegComment size="20px" />
                            </div>
                            <span className="ml-1">{tweet?.comments?.length}</span>
                        </button>
                        <div className="flex items-center cursor-pointer" onClick={handleBookmark}>
                            <div className={`rounded-full p-1 ${isBookmarked ? 'text-blue-600' : ''}`}>
                                {isBookmarked ? <FaBookmark size="20px" /> : <FaRegBookmark size="20px" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {commentPopupOpen && (
                <CommentPopup
                    comments={comments}
                    tweet={tweet}
                    newComment={newComment}
                    handleCommentChange={(e) => setNewComment(e.target.value)}
                    addComment={addComment}
                    onClose={toggleComments}
                />
            )}
        </div>
    );
};

export default Tweeters;
