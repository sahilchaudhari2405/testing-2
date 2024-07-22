import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon, MailIcon, LockClosedIcon, PhoneIcon, DeviceMobileIcon, BriefcaseIcon } from '@heroicons/react/outline';
import { fetchUsers, signupUser } from '../Redux/User/userSlices'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success('User fetched successfully');
    } else if (status === 'failed') {
      toast.error(`Error: ${error.message || error}`);
    }
  }, [status, error]);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    mobile: '',
    counterNumber: '',
    role: 'Counter Boy',
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = (form.role === 'Counter Boy' || form.role === 'Other') ? 'user' : form.role;
    dispatch(signupUser({ ...form, role }));
    toast.success('User created successfully');
    setForm({ fullname: '', email: '', password: '', mobile: '', counterNumber: '', role: 'Counter Boy' });
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Available Users */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Available Users</h2>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error: {error.message || error}</p>}
            <ul>
              {users && users.map((user) => (
                <li key={user.id}>
                  <div className="flex items-center space-x-4 p-4 bg-blue-100 mb-3 rounded-lg shadow-md hover:scale-[1.02] transition duration-200">
                    <UserIcon className="h-10 w-10 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{user.fullname}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <span className="font-semibold">{user.counterNumber}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form to Create new User */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center border-b py-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center border-b py-2">
                <MailIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center border-b py-2">
                <LockClosedIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center border-b py-2">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleInputChange}
                  placeholder="Mobile"
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center border-b py-2">
                <DeviceMobileIcon className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="counterNumber"
                  value={form.counterNumber}
                  onChange={handleInputChange}
                  placeholder="Counter Number"
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center border-b py-2">
                <BriefcaseIcon className="h-5 w-5 text-gray-500" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  className="ml-3 flex-1 p-2 border-none focus:ring-0"
                  required
                >
                  <option value="Counter Boy">Counter Boy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Users;
