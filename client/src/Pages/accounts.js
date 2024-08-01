import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, deleteUser, logoutUser } from '../Redux/User/userSlices';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {jwtDecode} from 'jwt-decode';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { fetchOrders } from '../Redux/Orders/orderSlice';

const Accounts = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('Users');
  const [fullName, setFullName] = useState('');
  const [importedData, setImportedData] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(order => {
        console.log(order);
      });
    }
  }, [orders]);

  const handleSelect = (view) => {
    setSelectedView(view);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('token');
    toast.error("Logout Successfully!");
    navigate('/');
  };

  const openWhatsAppPopup = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleSendMessage = () => {
    const whatsappUrl = `https://wa.me/${selectedOrder.mobileNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsPopupOpen(false);
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

  const renderOrdersTable = (data) => (
    <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-gray-600 text-white">
        <tr>
          <th className="border border-zinc-800 px-4 py-2">SrNo.</th>
          <th className="border border-zinc-800 px-4 py-2">Name</th>
          <th className="border border-zinc-800 px-4 py-2">Mobile Number</th>
          <th className="border border-zinc-800 px-4 py-2">Email</th>
          <th className="border border-zinc-800 px-4 py-2">Status</th>
          <th className="border border-zinc-800 px-4 py-2">Time</th>
          <th className="border border-zinc-800 px-4 py-2">Created At</th>
          <th className="border border-zinc-800 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((order, i) => (
          <tr key={order._id || i} className={(i + 1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
            <td className="border border-zinc-800 px-4 py-2">{i + 1}</td>
            <td className="border border-zinc-800 px-4 py-2">{order.Name}</td>
            <td className="border border-zinc-800 px-4 py-2">{order.mobileNumber}</td>
            <td className="border border-zinc-800 px-4 py-2">{order.email}</td>
            <td className="border border-zinc-800 px-4 py-2">{order.orderStatus}</td>
            <td className="border border-zinc-800 px-4 py-2">{new Date(order.orderDate).toLocaleTimeString()}</td>
            <td className="border border-zinc-800 px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="border border-zinc-800 px-4 py-2">
              <div className='flex justify-around'>
              <button className="text-green-500 text-xl">
                    <FaWhatsapp aria-hidden="true" onClick={() => openWhatsAppPopup(order)} />
                  </button>
                <button className="text-red-500">
                  <FaTrash aria-hidden="true" onClick={() => handleDelete(order)} />
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
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center  justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg border-[1px] border-gray-600 ">
          <h2 className="text-lg font-bold mb-4 flex items-center">
              <FaWhatsapp aria-hidden="true" className='text-green-600 text-4xl mr-2' />
              Send WhatsApp Message
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendMessage}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">User Management | Hi, <span className='font-bold'>{fullName}</span></span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => handleSelect('Users')} className={`px-4 py-2 rounded-l-lg ${selectedView === 'Users' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800 border'}`}>
              Users
            </button>
            <button onClick={() => handleSelect('Orders')} className={`px-4 py-2 rounded-r-lg ${selectedView === 'Orders' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-800 border'}`}>
              Clients
            </button>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => exportToExcel(users)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-blue-600">
              Export Users
            </button>
            <button onClick={() => setShowImportModal(true)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-blue-600">
              Import Users
            </button>
          </div>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Import Users</h2>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button onClick={() => setShowImportModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Cancel
              </button>
            </div>
          </div>
        )}

        {selectedView === 'Users' && renderTable(users)}
        {selectedView === 'Orders' && renderOrdersTable(orders)}
      </div>
    </div>
  );
};

export default Accounts;
