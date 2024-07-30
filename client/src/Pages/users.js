import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser,  signupUser } from '../Redux/User/userSlices';
import { UserIcon, MailIcon, LockClosedIcon, PhoneIcon, DeviceMobileIcon, BriefcaseIcon } from '@heroicons/react/outline';
import { toast } from 'react-toastify'; // Import toast

const Users = () => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.user);
    const [form, setForm] = useState({
        id: '',
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        counterNumber: '',
        role: 'Select Role',
    });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                // Update user
                await dispatch(updateUser(form)).unwrap();
                toast.success('User updated successfully!');
            } else {
                // Create new user
                await dispatch(signupUser(form)).unwrap();
                toast.success('User created successfully!');
            }
            dispatch(fetchUsers());
            setForm({
                id: '',
                fullName: '',
                email: '',
                password: '',
                mobile: '',
                counterNumber: '',
                role: 'Counter Boy'
            });
        } catch (error) {
            console.error('Failed to submit form:', error);
            toast.error('Failed to submit form: ' + error.message);
        }
    };



    const handleEdit = (user) => {
        setForm({ 
            id: user._id, 
            fullName: user.fullName, 
            email: user.email, 
            password: '', // Do not prefill the password for security reasons
            mobile: user.mobile, 
            counterNumber: user.counterNumber, 
            role: user.role 
        });
    };

    return (
        <div className="min-h-screen mt-20 bg-gray-100 p-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Available Users */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Available Users</h2>
                        {status === 'loading' ? <p>Loading...</p> : null}
                        {status === 'failed' ? <p>{error}</p> : null}
                        <ul>
                            {users.map((user) => (
                                <li key={user._id} className="flex items-center justify-between p-4 bg-blue-100 mb-3 rounded-lg shadow-md">
                                    <div className="flex items-center space-x-8">
                                        <UserIcon className="h-10 w-10 text-gray-500" />
                                        <div>
                                            <div className="font-semibold text-lg">{user.fullName}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                        <div className='text-center'>
                                            <div className="font-semibold text-xs">{user.counterNumber}</div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEdit(user)} 
                                            className="bg-yellow-500 text-white px-2 py-1 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* User Form */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">User Form</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Counter Number</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            name="counterNumber"
                                            value={form.counterNumber}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleInputChange}
                                            className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >   
                                            <option value=" ">Select Role</option>
                                            <option value="Counter Boy">Counter Boy</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
                                    >
                                        {form.id ? 'Update User' : 'Create User'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Users;
