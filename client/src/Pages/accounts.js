import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser } from '../Redux/User/userSlices';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {jwtDecode} from 'jwt-decode';
import { logoutUser } from '../Redux/User/userSlices';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const Accounts = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('Users');
  const [fullName, setFullName] = useState('');
  const [importedData, setImportedData] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSelect = (view) => {
    setSelectedView(view);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else { // Redirect to login if no token found
    }
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('token');
    toast.error("Logout Successfully!")
    navigate('/');
  };


  const handleDelete = async (user) => {
    try {
        await dispatch(deleteUser(user._id)).unwrap();
        dispatch(fetchUsers());
        toast.success('User deleted successfully!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user: ' + error.message);
    }
};

  const handleEdit = (user) => {
    navigate(`/admin/users`);
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users_Report');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Users_Report.xlsx');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setImportedData(data);
      setShowImportModal(false);
    };
    reader.readAsBinaryString(file);
  };

  const renderTable = (data) => (
    <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-gray-600 text-white">
        <tr>
          <th className="border border-zinc-800 px-4 py-2">SrNo.</th>
          <th className="border border-zinc-800 px-4 py-2">Name</th>
          <th className="border border-zinc-800 px-4 py-2">Email</th>
          <th className="border border-zinc-800 px-4 py-2">Mobile</th>
          <th className="border border-zinc-800 px-4 py-2">Counter Number</th>
          <th className="border border-zinc-800 px-4 py-2">Role</th>
          <th className="border border-zinc-800 px-4 py-2">Created At</th>
          <th className="border border-zinc-800 px-4 py-2">Updated At</th>
          <th className="border border-zinc-800 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((user, i) => (
          <tr key={user._id || i} className={(i + 1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
            <td className="border border-zinc-800 px-4 py-2">{i + 1}</td>
            <td className="border border-zinc-800 px-4 py-2">{user.fullName}</td>
            <td className="border border-zinc-800 px-4 py-2">{user.email}</td>
            <td className="border border-zinc-800 px-4 py-2">{user.mobile}</td>
            <td className="border border-zinc-800 px-4 py-2">{user.counterNumber}</td>
            <td className="border border-zinc-800 px-4 py-2">{user.role}</td>
            <td className="border border-zinc-800 px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
            <td className="border border-zinc-800 px-4 py-2">{new Date(user.updatedAt).toLocaleDateString()}</td>
            <td className="border border-zinc-800 px-4 py-2">
              <div className='flex justify-around'>
                <button className="text-blue-500">
                  <FaEdit aria-hidden="true" onClick={() => handleEdit(user)} />
                </button>
                <button className="text-red-500">
                  <FaTrash aria-hidden="true" onClick={() => handleDelete(user)} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg">
      <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">User Management | Hi, <span className='font-bold'>{fullName}</span></span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">LogOut</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <button
            className="bg-white border border-zinc-300 text-black px-4 py-2 rounded"
            onClick={() => setShowImportModal(true)}
          >
            Import Report
          </button>
          <button
            className="bg-white border border-zinc-300 text-black px-4 py-2 rounded"
            onClick={() => exportToExcel(users)}
          >
            Excel Report
          </button>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Select an Excel file to import</h2>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 mb-4 bg-gray-100 p-3 rounded-md">
          <label htmlFor="view-select" className="flex items-center space-x-2">
            <span className="text-sm">Select View:</span>
            <div className="relative">
              <select
                id="view-select"
                className="bg-white border border-zinc-300 px-4 py-2 rounded"
                value={selectedView}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <option value="Users">Users View</option>
              </select>
            </div>
          </label>
        </div>

        {selectedView === 'Users' && renderTable(users)}
      </div>
    </div>
  );
};

export default Accounts;
