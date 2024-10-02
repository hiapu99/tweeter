import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tweeters from './Tweeters';
import { useSelector } from 'react-redux';

const FollowedAuthorsTweets = () => {
    const { user } = useSelector(store => store.auth);
    const [followedTweets, setFollowedTweets] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFollowedAuthorsTweets = async () => {
            try {
                const res = await axios.get(`http://localhost:9000/api/user/${user._id}/followed-tweets`, {
                    headers: { Authorization: token },
                });
                setFollowedTweets(res.data.tweets); // Assuming response structure
            } catch (error) {
                console.error('Error fetching followed authors tweets:', error);
            }
        };

        fetchFollowedAuthorsTweets();
    }, [user._id, token]);

    return (
        <div>
            {followedTweets.map(tweet => (
                <Tweeters key={tweet._id} tweet={tweet} />
            ))}
        </div>
    );
};

export default FollowedAuthorsTweets;
