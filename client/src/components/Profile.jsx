import React, { useEffect, useState } from 'react';
import { FaRegComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useGetProfile from '../hook/useGetProfile';
import EditProfile from './EditProfile';
import axios from 'axios';
import { toggleRefresh } from '../redux/tweets';
import { format } from 'date-fns';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, profile } = useSelector(store => store.auth);
  const { tweet } = useSelector(store => store.tweet);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [likedPosts, setLikedPosts] = useState({});

  const accountCreatedAt = profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy') : 'Unknown';
  const token = localStorage.getItem('token');

  useGetProfile(id);

  useEffect(() => {
    if (profile && user) {
      setIsFollowing(profile?.followers?.includes(user._id));
    }
  }, [profile, user]);

  const toggleEditProfile = () => setEditProfile(prev => !prev);

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/api/follow/${id}`, {
        headers: { "Authorization": token },
      });

      if (res?.data?.success) {
        setIsFollowing(prev => !prev);
        dispatch(toggleRefresh());
      }
    } catch (error) {
      console.error('Error following/unfollowing user', error);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:9000/api/like/${postId}`, {}, {
        headers: { "Authorization": token },
      });

      if (res?.data?.success) {
        setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
        dispatch(toggleRefresh());
      }
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  const displayTabContent = activeTab === "posts" ? profile?.posts
    : activeTab === "saved" ? profile?.bookmarks
      : profile?.likes;

  return (
    <div className="bg-black text-white font-sans h-screen max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky bg-black py-2 px-4 flex items-center">
        <button className="text-white mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div className="flex-grow">
          <h1 className="text-lg font-bold">{profile?.fullName}</h1>
          <p className="text-sm text-gray-500">{profile?.posts?.length} post</p>
        </div>
      </header>

      {/* Profile Section */}
      <div className="flex flex-col">
        <div className="bg-gray-800 h-40">
          <img
            src={profile?.coverImg?.secure_url}
            alt="Cover"
            className="w-full h-[199px] object-cover rounded-b-lg"
          />
        </div>

        <div className="bg-black py-10 px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-4">
              <img
                src={profile?.profileImg?.secure_url}
                alt="Profile"
                className="rounded-full w-[133px] h-[133px] -mt-28 border-2 border-gray-600"
              />
            </div>
            <div>
              {user?._id === profile?._id ? (
                <button
                  onClick={toggleEditProfile}
                  className="ml-4 px-4 py-2 bg-transparent border border-gray-600 rounded-full text-sm font-medium hover:bg-gray-700"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowOrUnfollow}
                  className={`px-6 py-2 text-sm font-semibold rounded-full ${isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} hover:opacity-90 transition duration-200`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-10">
              <h2 className="text-xl font-bold">{profile?.fullName}</h2>
              <button className="mt-2 px-3 py-1 rounded-full bg-transparent border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-600 hover:text-white">
                Get Verified
              </button>
            </div>
            <p className="text-gray-500">{profile?.username}</p>
          </div>

          <p className="mt-4 text-gray-500">
            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Joined {accountCreatedAt}
          </p>
          <p className="mt-4">{profile?.bio?.trim().substring(0, 100)}</p>
          <p className="mt-4">{profile?.location?.trim().substring(0, 100)}</p>
          <p className="mt-4">{profile?.website?.trim().substring(0, 100)}....</p>

          <div className="mt-4 flex space-x-4">
            <div>
              <span className="font-bold mr-1">{profile?.following?.length}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div>
              <span className="font-bold mr-1">{profile?.followers?.length}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-black border-t border-gray-700 px-4 py-3 flex space-x-6">
          {['posts', 'saved', 'likes'].map(tab => (
            <button
              key={tab}
              className={`text-gray-400 hover:text-white font-medium ${activeTab === tab ? "border-b-2 border-blue-500 text-white" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='grid grid-cols-2 gap-6 px-7'>
          {displayTabContent && displayTabContent.length > 0 ? (
            displayTabContent.map(item => (
              <div key={item._id} className='relative items-center justify-center rounded-md group border'>
                <img src={item.images} alt="" className='h-64 w-64 object-cover rounded-md' />
                <div className='absolute inset-0 hidden group-hover:flex items-center justify-center bg-black bg-opacity-50'>
                  <div className='text-white flex gap-10'>
                    <p className='flex items-center gap-1'>
                      <FaRegComment className='cursor-pointer' />
                      {item.comments.length}
                    </p>
                    <p className='flex items-center gap-1'>
                      <CiHeart className={`cursor-pointer ${likedPosts[item._id] ? 'text-red-500' : ''}`} onClick={() => handleLike(item._id)} />
                      {item.likes.length}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No content available in this section.</p>
          )}
        </div>
      </div>

      {editProfile && <EditProfile toggleEditProfile={toggleEditProfile} profile={profile} />}
    </div>
  );
};

export default Profile;
