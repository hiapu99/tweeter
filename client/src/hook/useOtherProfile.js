import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUser } from "../redux/authSlice";

const useOtherProfile = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token

            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:9000/api/user/${id}`, {
                    headers: {
                        'Authorization': token, // Added 'Bearer' prefix for token
                    },
                    withCredentials: true,
                });

                // Dispatch the otherUser data to Redux store
                dispatch(setOtherUser(res.data.user));
            } catch (error) {
                console.error('Error fetching profile:', error.response?.data?.message || error.message);
            }
        };

        // Fetch user profile
        fetchData();
    }, [dispatch, id]); // Added 'id' to the dependency array
};

export default useOtherProfile;
