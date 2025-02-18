import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash, FaBalanceScale, FaCheckCircle, FaWhatsapp, FaSave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jwtDecode } from 'jwt-decode';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { deleteOrder, fetchOrders } from '../Redux/Orders/orderSlice';
import { logoutUser } from '../Redux/User/userSlices';
import axiosInstance from '../axiosConfig';
import { HashLoader } from 'react-spinners';

const Accounts = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('clients');
  const [fullName, setFullName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clientId, setClientId] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);
  const orders = useSelector((state) => state.orders.orders);
  const [popupVisible, setPopupVisible] = useState(false);
  const [payment, setPayment] = useState({
    balance: 0,
    loyalty: 0,
  });
  const [Balance, setBalance] = useState(0); // Example, replace with actual logic
  const [loyalty, setLoyalty] = useState(0); // Example, replace with actual logic
  const [remainingAmountLoyelty, setRemainingAmountLoyelty] = useState(0); // Example, replace with actual logic
  const [remainingAmountBalance, setRemainingAmountBalance] = useState(0); // Example, replace with actual logic
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const setData = (order) => {
   setBalance(order.totalClosingBalance)
   setLoyalty(order.loyalty)
   setClientId(order._id)
  setPopupVisible(true)
  };
  useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(order => {
        console.log("Client fetched!!");
      });
    }
    console.log(orders)
  }, [orders]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const nextDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    setStartDate(currentDate);
    setEndDate(nextDate);

    const filteredOrders = orders.filter(order => {
      const orderDate = order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : null;
      return orderDate && orderDate >= currentDate && orderDate <= nextDate;
    });

    console.log(filteredOrders);
  }, [orders]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]: parseFloat(value) || 0,
    });
  };
  
  const handleSavePayment = async () => {
    // Implement logic to save payment details
    try {
console.log("yes")
      const response = await axiosInstance.post('/sales/AdvancePay/UpdateAmount', {
        clientId,
        amount: payment.balance,
        loyaltyReduction:payment.loyalty,
      });
      setPopupVisible(false);
      console.log(response)
      dispatch(fetchOrders());
      setPayment({
        balance:"",
        loyalty:"",
      })
      setClientId("");
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
    }
  
  };
  
  const handleCancel = () => {
    setPayment({
      balance:"",
      loyalty:"",
    })
    setClientId("");
    setPopupVisible(false);
  };
  useEffect(() => {
    const totalAmountBalance = Balance - payment.balance;
    const remaining = loyalty- payment.loyalty;
    setRemainingAmountLoyelty(remaining >= 0 ? remaining : 0);
    setRemainingAmountBalance(totalAmountBalance > 0 ? Math.abs(totalAmountBalance) : 0);
  }, [payment]);
  
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

  const handleDelete = async (order) => {
    try {
      await dispatch(deleteOrder(order._id)).unwrap();
      dispatch(fetchOrders());
      toast.success('Client deleted successfully!');
    } catch (error) {
      console.error('Failed to delete client:', error);
      toast.error('Failed to delete client: ' + error.message);
    }
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients_Report');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Clients_Report.xlsx');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      console.log(data);
      setImportedData(data); // Store imported data in state
      setShowImportModal(false);

      // Send the data to the backend
      try {
        const response = await axiosInstance.post('/users/admin/UserImport', {
          users: data, // Sending only the data as payload
        });

        if (!response.data.success) {
          throw new Error('Failed to import users');
        }

        toast.success('Import successful!');
        dispatch(fetchOrders()); // Fetch the updated data
      } catch (error) {
        console.error('Error during import:', error);
        toast.error('Error during import: ' + error.message);
      }
    };

    reader.readAsBinaryString(selectedFile); // Read the file as binary string
  };


  const filteredOrders = orders.filter(orders => {
    const updatedAt = new Date(orders.updatedAt);
    const orderCreatedAt = new Date(orders.updatedAt);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
      Object.values(orders).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (!startDate || updatedAt >= start) &&
      (!endDate || updatedAt <= end)
    );
  });
  // const fetchClosingBalanceData = async () => {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   const data = orders.flatMap(order => {
  //     return order.ClosingBalance?.filter(balance => {
  //       if (!balance.monthYear) return false;
  //       const balanceDate = new Date(balance.monthYear);
  //       return balanceDate >= start && balanceDate <= end;
  //     });
  //   });
  // };

  const [closingBalanceData, setClosingBalanceData] = useState(null);
  const [isClosingBalanceOpen, setIsClosingBalanceOpen] = useState(false);

  const fetchClosingBalanceData = (order) => {
    const balanceData = order.ClosingBalance || [];
    setClosingBalanceData(balanceData);
    setIsClosingBalanceOpen(true);
  };

  const [CompletePurchaseData, setCompletePurchaseData] = useState(null);
  const [isCompletePurchaseOpen, setIsCompletePurchaseOpen] = useState(false);

  const fetchCompletePurchaseData = (order) => {
    const balanceData = order.CompletePurchase || [];
    setCompletePurchaseData(balanceData);
    setIsCompletePurchaseOpen(true);
  };
  const renderOrdersTable = (data) => (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded-lg mb-4 border-gray-700 hover:border-gray-900"
      />
      <div className="flex mb-4 space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>
      <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-600 text-white">
          <tr>
            <th className="border border-zinc-800 px-4 py-2">SrNo.</th>
            <th className="border border-zinc-800 px-1 py-2">Name</th>
            <th className="border border-zinc-800 px-4 py-2">Mobile Number</th>
            <th className="border border-zinc-800 px-4 py-2">Email</th>
            <th className="border border-zinc-800 px-4 py-2">Type</th>
            <th className="border border-zinc-800 px-4 py-2">Time</th>
            <th className="border border-zinc-800 px-4 py-2">Date</th>
            <th className="border border-zinc-800 px-0.5 py-2">loyalty</th>
            <th className="border border-zinc-800 px-0.5 py-2">Purchase</th>
            <th className="border border-zinc-800 px-0.5 py-2">Balance</th>
            <th className="border border-zinc-800 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((order, i) => {


            return (
              <tr key={order._id || i} className={(i + 1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
                <td className="border border-zinc-800 px-4 py-2">{i + 1}</td>
                <td className="border border-zinc-800 px-1 py-2">{order.Name}</td>
                <td className="border border-zinc-800 px-4 py-2">{order.Mobile}</td>
                <td className="border border-zinc-800 px-4 py-2">{order.Email || 'N/A'}</td>
                <td className="border border-zinc-800 px-4 py-2">{order.Type}</td>
                <td className="border border-zinc-800 px-4 py-2">{new Date(order.updatedAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  timeZone: 'Asia/Kolkata'
                })}</td>
                <td className="border border-zinc-800 px-4 py-2">{new Date(order.updatedAt).toLocaleDateString()}</td>
                <td className="border border-zinc-800 px-4 py-2">{order?.loyalty?.toFixed(2)}</td>
                <td className="border border-zinc-800 px-4 py-2">{order.totalCompletePurchase}</td>
                <td className="border border-zinc-800 px-4 py-2">{order.totalClosingBalance}</td>
                <td className="border border-zinc-800 px-4 py-2">
                  <div className='flex justify-around'>
                    <button className="text-green-500 text-xl">
                      <FaWhatsapp aria-hidden="true" onClick={() => openWhatsAppPopup(order)} />
                    </button>
                    <button className="text-red-500">
                      <FaTrash aria-hidden="true" onClick={() => handleDelete(order)} />
                    </button>
                    <button className="text-red-500">
                      <FaBalanceScale
                        aria-hidden="true"
                        onClick={() => fetchClosingBalanceData(order)}
                      />
                    </button>
                    <button className="text-red-500">
                      <FaCheckCircle
                        aria-hidden="true"
                        onClick={() => fetchCompletePurchaseData(order)}
                      />
                    </button>
                    <button
                    ><FaEdit  aria-hidden="true"   onClick={() => setData(order)}/>
                    
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Conditionally render the closing balance data */}
      {isClosingBalanceOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsClosingBalanceOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-lg font-bold mb-4">Closing Balance Data</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">SrNo.</th>
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {closingBalanceData.map((balance, i) => (
                  <tr key={balance._id}>
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2">{balance.monthYear}</td>
                    <td className="border px-4 py-2">{balance.balance}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* Conditionally render the Complete Purchase data */}
      {isCompletePurchaseOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsCompletePurchaseOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-lg font-bold mb-4">Complete Purchase Data</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">SrNo.</th>
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Purchase</th>
                </tr>
              </thead>
              <tbody>
                {CompletePurchaseData.map((balance, i) => (
                  <tr key={balance._id}>
                    <td className="border px-4 py-2">{i + 1}</td>
                    <td className="border px-4 py-2">{balance.monthYear}</td>
                    <td className="border px-4 py-2">{balance.Purchase}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg">
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg border-[1px] border-gray-600 relative">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
          <span className="text-sm">client Management | Hi, <span className='font-bold'>{fullName}</span></span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">

          <div className="flex space-x-2">
            <button onClick={() => exportToExcel(filteredOrders)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-red-600">
              Export clients
            </button>
            <button onClick={() => setShowImportModal(true)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-red-600">
              Import clients
            </button>

          </div>
        </div>

        {showImportModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Import clients</h2>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="mb-4"
              />
              <button
                onClick={handleFileUpload}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Send
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {status === 'loading' ? (
            <div className="flex items-center  h-30 w-full justify-center">
            <HashLoader size={100} />
          </div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          renderOrdersTable(filteredOrders)
        )}
        {selectedView === 'Imported' && renderOrdersTable(importedData)}
      </div>
      {popupVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      <h3 className="text-lg font-semibold mb-4">
        Total Amount: ₹{Balance.toFixed(2)}
      </h3>
      <h3 className="text-lg font-semibold mb-4">
        Loyalty Amount: ₹{loyalty.toFixed(2)}
      </h3>
      <div className="space-y-4">
        <span className="text-gray-600">Balance Amount</span>
        <input
          type="number"
          name="balance"
          value={payment.balance || ""}
          onChange={handlePaymentChange}
          placeholder=""
          className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{
            appearance: "textfield",
            MozAppearance: "textfield",
            WebkitAppearance: "none",
          }}
        />
        <span className="text-gray-600">Loyalty Amount</span>
        <input
          type="number"
          name="loyalty"
          value={payment.loyalty || ""}
          onChange={handlePaymentChange}
          placeholder=""
          className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{
            appearance: "textfield",
            MozAppearance: "textfield",
            WebkitAppearance: "none",
          }}
        />
        <h4
          className={`mt-4 ${
            "text-green-500"
          }`}
        >
          {`Remaining Amount Balance: ₹${remainingAmountBalance.toFixed(2)}`}
          <div className="text-orange-400">
            {`Remaining Amount Loyelty: ₹${remainingAmountLoyelty.toFixed(2)}`}
          </div>
        </h4>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={handleSavePayment}
            className="bg-green-400 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out flex items-center"
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out flex items-center"
          >
            <FaTrash className="mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Accounts;

