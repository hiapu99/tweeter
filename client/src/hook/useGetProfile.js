import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/authSlice";

const useGetProfile = (id) => {
    const {refresh} = useSelector(store => store.tweet)
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://localhost:9000/api/profile/${id}`, {
                    headers: {
                        Authorization: token, // Added 'Bearer' prefix for token
                    },
                    withCredentials: true,
                });

                // Dispatch the user data to Redux store
                dispatch(setProfile(response.data?.user));
            } catch (error) {
                console.error('Error fetching profile:', error.response?.data?.message || error.message);
            }
        };

        if (id) {
            // Fetch user profile if 'id' is provided
            fetchData();
        }
    }, [dispatch, id,refresh]); // Added 'id' to the dependency array
};

export default useGetProfile;
