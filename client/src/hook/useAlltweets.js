import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTweet } from "../redux/tweets";

const useGetMyTweets = () => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet); // Correct selector function

    const token = localStorage.getItem('token'); // Retrieve the token  

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/post', {
                headers: {
                    'Authorization':token, // Use Bearer token if present
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setTweet(res.data.posts)); // Dispatch the posts to Redux store
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const followingData = async () => {
        try {
            const res = await axios.get('http://localhost:9000/api/post/follow', {
                headers: {
                    'Authorization': token, // Use Bearer token if present
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setTweet(res.data.followedPosts)); // Dispatch the posts to Redux store
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        if (isActive) {
            fetchData();
        } else {
            followingData();
        }
    }, [isActive, refresh,refresh]);

};

export default useGetMyTweets;
