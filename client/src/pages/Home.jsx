import React from 'react';
import LeftSidber from '../components/LeftSidber';
import RightSidber from '../components/RightSidber';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllPost from '../hook/useAlltweets';
import useOtherProfile from '../hook/useOtherProfile';
import Mobilemenu from '../components/Mobilemenu';
import useGetProfile from '../hook/useGetProfile';

const Home = () => {
    const { user, otherUser } = useSelector(store => store.auth);
    useOtherProfile(user._id);
    useGetAllPost()
    return (
        <div className='flex w-full container'>
            {/* Left Sidebar - 20% */}
            <div className='w-1/5 hidden lg:block'>
                <LeftSidber />
            </div>

            {/* Main Content (Outlet) - Adjust to 100% on smaller screens */}
            <div className='w-full lg:w-3/5'>
                <Outlet />
            </div>
            <Mobilemenu/>
            {/* Right Sidebar - 20% */}
            <div className='w-1/5 hidden lg:block'>
                <RightSidber otherUser={otherUser}/>
            </div>
        </div>
    );
}

export default Home;
