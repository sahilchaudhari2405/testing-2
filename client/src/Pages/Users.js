// UserListCreate.js
import React, { useState } from 'react';
import { UserIcon, MailIcon, LockClosedIcon, PhoneIcon, DeviceMobileIcon,BriefcaseIcon  } from '@heroicons/react/outline';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'boy1', role: 'Counter Boy', counter:'1' },
    { id: 2, name: 'Boy2', role: 'Counter Boy', counter:'2' },
  ]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    counterNumber: '',
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, { ...form, id: users.length + 1, role: 'Counter Boy' }]);
    setForm({ name: '', email: '', password: '', phone: '', counterNumber: '' });
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Available Users  */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Available Users</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <div className="flex items-center space-x-4 p-4 bg-blue-100 mb-3 rounded-lg shadow-md hover:scale-[1.02] transition duration-200">
                    <UserIcon className="h-10 w-10 text-gray-500" />
                    <div className="flex-1">
                        <div className="font-semibold text-lg">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                        <span className="font-semibold" >{user.counter}</span>
                        <span className="text-xs text-gray-500"></span>
                        </div>
                        <div className="flex items-center">
                        <span className="font-semibold">{user.role}</span>
                        <span className="text-xs text-gray-500" ></span>
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
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Name"
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
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
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
    </div>
  );
};

export default Users;
