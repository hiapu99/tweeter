import React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUser }) => {
    return (
        <div className="flex flex-col h-screen justify-start items-start gap-6 p-4 mt-4 w-full border-gray-200">

            {/* Search Bar */}
            <div className="w-full">
                <input
                    type="text"
                    placeholder="Search Twitter"
                    className="w-full px-4 py-2 rounded-full bg-gray-100/10 text-gray-700 focus:outline-none"
                />
            </div>

            {/* What's Happening (Trends) */}
            <div className="w-full bg-gray-100/10 rounded-lg p-4">
                <h2 className="font-bold text-xl mb-4 text-white">What’s happening</h2>
                <div className="flex flex-col gap-4">
                    <div className="text-gray-400">
                        <p>Trending in Tech</p>
                        <h3 className="font-semibold text-white">#ReactJS</h3>
                        <p>100k Tweets</p>
                    </div>
                    <div className="text-gray-400">
                        <p>Trending in Sports</p>
                        <h3 className="font-semibold text-white">#WorldCup</h3>
                        <p>200k Tweets</p>
                    </div>
                    <div className="text-gray-400">
                        <p>Trending in Entertainment</p>
                        <h3 className="font-semibold text-white">#Oscars</h3>
                        <p>150k Tweets</p>
                    </div>
                </div>
            </div>
            {/* Who to Follow */}
            <div className="w-full bg-gray-100/10 rounded-lg p-4  overflow-y-auto scrollbar-none scrollbar-thumb-blue-600 scrollbar-track-gray-300 hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full">
                <h2 className="font-bold text-xl mb-4 text-white">Who to follow</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(otherUser) && otherUser.length > 0 ? (
                        otherUser.map((user) => (
                            <div
                                className="flex items-center justify-between p-1 hover:bg-gray-200/10 rounded-md transition-all duration-200 ease-in-out"
                                key={user._id}
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        src={user.profileImg.secure_url}
                                        size="35"
                                        round={true}
                                    />
                                    <div className="ml-4">
                                        <h2 className="font-bold text-sm text-white">{user.name}</h2>
                                        <p className="text-gray-500 text-sm">@{user.username}</p>
                                    </div>
                                </div>
                                <Link to={`/profile/${user._id}`}>
                                    <button
                                        className="bg-blue-500 text-white px-4 rounded-full hover:bg-blue-600 transition-all duration-200"
                                        aria-label={`View ${user.name}'s profile`}
                                    >
                                        Profile
                                    </button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No users found to follow.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
