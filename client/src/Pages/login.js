import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../Redux/User/userSlices';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import logo from '../logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(token);
        console.log("exp time: ",decodedToken.exp )

        // Check if the token is expired
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token is expired
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Remove expired token
          return; // Do not navigate, keep the user on the login page

        }

        // Extract role or any other user information
        const role = decodedToken.role;
console.log(role)
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'COUNTERBOY') {
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Error decoding token');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (status === 'succeeded') {
      // Assuming token is stored in localStorage after login
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Decode the token
          const decodedToken = jwtDecode(token);

          // Check if the token is expired
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp < currentTime) {
            // Token is expired
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token'); // Remove expired token
            return; // Do not navigate, keep the user on the login page
          }

          // Extract role or any other user information
          const role = decodedToken.role;

          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'user') {
            navigate('/dashboard');
          }
        } catch (error) {
          toast.error('Error decoding token');
        }
      }
    }

    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-200 to-blue-400">
      <div className="bg-white border-[1px] border-gray-800 shadow-2xl  rounded-2xl p-8 max-w-md w-full transform transition-transform duration-500">
        <img
          aria-hidden="true"
          alt="company-logo"
          src={logo}
          className="mx-auto mb-6 rounded-full w-[180px]"
        />
        <h2 className="text-4xl font-extrabold text-zinc-900 text-center mb-6">Welcome Back!</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border border-gray-500 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border border-zinc-500 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="w-1/2 bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition duration-300">
              Login
            </button>
            <a href="#" className="text-sm text-gray-400 hover:text-blue-600">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
