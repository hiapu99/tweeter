import React, { useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';

const SignIn = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error("Please fill in all fields");
        }

        try {
            const endpoint = isLogin ? 'http://localhost:9000/api/signIn' : 'http://localhost:9000/api/signUp';
            const res = await axios.post(endpoint, { email, password });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                localStorage.setItem('token', res.data.token);
                navigate("/");
                toast.success(res.data.message);

                setEmail("");
                setPassword("");
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center bg-white'>
            <div className='flex flex-col md:flex-row items-center justify-evenly w-[90%] md:w-[80%]'>
                <div className='mb-5 md:mb-0'>
                    <img
                        className='mx-auto md:ml-5'
                        width={"100px"}
                        src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
                        alt="logo"
                    />
                </div>
                <div className='text-center md:text-left'>
                    <div className='my-5'>
                        <h1 className='font-bold text-4xl md:text-6xl'>Happening now.</h1>
                    </div>
                    <h1 className='mt-4 mb-2 text-xl md:text-2xl font-bold'>
                        {isLogin ? "Login" : "Sign Up"}
                    </h1>
                    <form onSubmit={submitHandler} className='flex flex-col w-full md:w-[55%] mx-auto'>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                        />
                        <button className='bg-[#1D9BF0] border-none py-2 my-4 rounded-full text-lg text-white'>
                            {isLogin ? "Login" : "Create Account"}
                        </button>
                    </form>
                    <div>
                        {isLogin ? (
                            <Link to="/signUp" className='font-bold text-blue-600 cursor-pointer'>
                                Don’t have an account? Sign Up
                            </Link>
                        ) : (
                            <Link to="/signIn" className='font-bold text-blue-600 cursor-pointer'>
                                Already have an account? Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
