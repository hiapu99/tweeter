import React, { useState } from 'react';
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Home, Search, PlusCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

const LeftSidebar = () => {
    const { user } = useSelector(store => store.auth);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { to: '/', icon: <FaHome />, label: 'Home' },
        { to: '/explore', icon: <FaHashtag />, label: 'Explore' },
        { to: '/notifications', icon: <FaBell />, label: 'Notifications' },
        { to: '/messages', icon: <FaEnvelope />, label: 'Messages' },
        { to: '/bookmarks', icon: <FaBookmark />, label: 'Bookmarks' },
        { to: `/profile/${user?._id}`, icon: <FaUser />, label: 'Profile' }
    ];

    return (
        <div>
            {/* Desktop Sidebar */}
            <div className=" fixed hidden sm:flex flex-col h-screen justify-start items-start gap-6 p-4 mt-4 w-16 lg:w-64 border-gray-100">
                <div className="text-3xl text-blue-500">
                    <FaTwitter />
                </div>
                <div className="flex flex-col gap-6">
                    {menuItems.map(({ to, icon, label }) => (
                        <Link key={to} to={to} className="flex items-center gap-4 px-2 py-1 rounded-full text-xl cursor-pointer hover:bg-gray-100/10 text-white">
                            {icon}
                            <span className="hidden lg:inline">{label}</span>
                        </Link>
                    ))}
                </div>
                <div className="mt-auto flex items-center gap-4 cursor-pointer text-white">
                    <img
                        src={user?.profileImg || 'https://via.placeholder.com/40'}
                        alt="User"
                        className="rounded-full"
                    />
                    <div className="hidden lg:block">
                        <h4 className="font-semibold">{user?.username || 'Username'}</h4>
                        <p className="text-sm text-gray-400">@{user?.username || 'username'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;
