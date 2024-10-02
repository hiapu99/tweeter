import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and signup
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const { fullName, username, email, password } = formData;
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? 'http://localhost:9000/api/signIn'
        : 'http://localhost:9000/api/signUp';

      const payload = isLogin ? { email, password } : { email, password, fullName, username };
      const res = await axios.post(endpoint, payload);

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem('token', token);

        if (isLogin) {
          navigate('/');
        } else {
          navigate('/signIn');
        }

        toast.success(res.data.message);
        resetForm();
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred.';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
    });
  };

  // Toggle between login and signup
  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row items-center justify-evenly w-[90%] md:w-[80%]">
        <div className="mb-5 md:mb-0">
          <img
            className="mx-auto md:ml-5"
            width="100px"
            src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
            alt="twitter-logo"
          />
        </div>
        <div className="text-center md:text-left">
          <div className="my-5">
            <h1 className="font-bold text-4xl md:text-6xl">Happening now.</h1>
          </div>
          <h1 className="mt-4 mb-2 text-xl md:text-2xl font-bold">{isLogin ? 'Login' : 'Signup'}</h1>
          <form onSubmit={submitHandler} className="flex flex-col w-full md:w-[55%] mx-auto">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                />
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email"
              className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
              className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
            />
            <button className="bg-[#1D9BF0] border-none py-2 my-4 rounded-full text-lg text-white">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
            <h1>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span onClick={toggleLoginSignup} className="font-bold text-blue-600 cursor-pointer">
                {isLogin ? ' Signup' : ' Login'}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
