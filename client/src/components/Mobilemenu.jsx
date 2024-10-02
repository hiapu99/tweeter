import { Home, MessageCircle, PlusCircle, Search, User } from 'lucide-react'
import { IoNotifications } from "react-icons/io5";
import { CgMail } from "react-icons/cg";
import React, { useState } from 'react'
import Avatar from 'react-avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Mobilemenu = () => {
    const {user} = useSelector(store => store.auth);
    const [showmenu, setShowmenu] = useState(false);
    const togglepopUp = () => {
        setShowmenu(!showmenu)
    }
    return (
        <div>
            <div className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-black/90 text-white p-4 border-b flex justify-around h-20 lg:hidden">
                <Link to="/" className="flex flex-col items-center text-sm hover:text-blue-600">
                    <Home className="h-6 w-6" />
                    <span>Home</span>
                </Link>
                <Link className="flex flex-col items-center text-sm hover:text-blue-600">
                    <Search className="h-6 w-6" />
                    <span>Search</span>
                </Link>
                <div className="flex flex-col items-center text-sm hover:text-blue-600 cursor-pointer">
                    <IoNotifications className="h-6 w-6" />
                    <span>Create</span>
                </div>
                <Link className="flex flex-col items-center text-sm hover:text-blue-600">
                    <CgMail className="h-6 w-6" />
                    <span>Messages</span>
                </Link>
                <Link to={`/profile/${user?._id}`} className="flex flex-col items-center text-sm hover:text-blue-600">
                    <Avatar src={user?.profileImg?.secure_url} size="30" round={true} />
                    <span>Profile</span>
                </Link>
            </div>
        </div>
    )
}

export default Mobilemenu