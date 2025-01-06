import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash, FaBalanceScale, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jwtDecode } from 'jwt-decode';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { deleteOrder} from '../Redux/Orders/orderSlice';
import { logoutUser } from '../Redux/User/userSlices';
import axiosInstance from '../axiosConfig';

const Clients = () => {
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
  const [clients, setClients] = useState([]);   // Stores fetched clients
  const [page, setPage] = useState(1);          // Tracks page number
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Tracks if more clients are available


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);
  const orders = useSelector((state) => state.orders.orders);

//   useEffect(() => {
//     // Fetch initial clients when the component mounts
//     dispatch(fetchClientOrders(page)); 
 
//   }, []);

//   useEffect(() => {
//     // Fetch initial clients when the component mounts
//    setClients(orders) 
 
//   }, [orders]);




const fetchCustomer = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/admin/Customer?page=${page}&limit=70`);
      setClients((prev) => [...prev, ...response.data]); // Append new products
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }; 


  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
      setPage((prev) => prev + 1); // Load the next page
    }
  };
  useEffect(() => {
    fetchCustomer(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);











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
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 0 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);  // Increase the page number to load more clients
      console.log(page)
    }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);







  // useEffect(() => {
  //   const fetchClients = async () => {
  //     setLoading(true);
  //     try {


  //       const response = await dispatch(fetchfetchCustomer(page)).unwrap();
  //       if (response.length === 0) {
  //         setHasMore(false);  // No more clients to load
  //       } else {
  //         setClients((prevClients) => [...prevClients, ...response]);  // Append new clients
  //       }
  //     } catch (error) {
  //       console.error('Error fetching clients:', error);
  //     }
  //     setLoading(false);
  //   };
  
  //   fetchClients();
  // }, [page, dispatch]);










  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

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
   fetchCustomer(page);
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

        toast.success('Import successful!');
       fetchCustomer(page); // Fetch the updated data
      } catch (error) {
        console.error('Error during import:', error);
      }
    };

    reader.readAsBinaryString(selectedFile); // Read the file as binary string
  };



  
  const filterclient = async() => {
const alphabet = searchQuery
    const number= startDate
    try {
        const response = await axiosInstance.post(`/users/admin/SearchClient`,{alphabet,number});
        console.log(response)
        setClients(response.data);
      } catch (error) {
        console.error('Error sort clients:', error);
      }
    };

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
      <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md ">
        <thead className="bg-gray-600 text-white">
          <tr>
            <th className="border border-zinc-800 px-4 py-2">SrNo.</th>
            <th className="border border-zinc-800 px-1 py-2">Name</th>
            <th className="border border-zinc-800 px-4 py-2">Mobile Number</th>
            <th className="border border-zinc-800 px-4 py-2">Email</th>
            <th className="border border-zinc-800 px-4 py-2">Type</th>
            <th className="border border-zinc-800 px-4 py-2">Time</th>
            <th className="border border-zinc-800 px-4 py-2">Date</th>
            <th className="border border-zinc-800 px-0.5 py-2">Purchase</th>
            <th className="border border-zinc-800 px-0.5 py-2">Balance</th>
            <th className="border border-zinc-800 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>

          {
            console.log(data)
          }
          {data?.map((order, i) => {
            // Log each order to the console
            // console.log("Map ka andar ka data ", order);

            return (
              <tr key={order._id +i|| i} className={(i + 1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
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
        <h1 className="text-3xl font-bold">Customers</h1>
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
            <button onClick={() => exportToExcel(clients)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-red-600">
              Export clients
            </button>
            <button onClick={() => setShowImportModal(true)} className="bg-white text-black border-black border-[1px] px-4 py-2 rounded hover:text-red-600">
              Import clients
            </button>

          </div>
        </div>

        <form className='space-x-4'>
      <input
        type="text"
        placeholder="Enter name of customer"
        value={searchQuery}

        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded-lg mb-4 border-gray-700 hover:border-gray-900"
      />
        <input
          type="number"
          value={startDate}
          placeholder='Enter mobile number'
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button type='button' onClick={filterclient} className='p-2 rounded-lg bg-blue-500 hover:bg-blue-600'> Search</button>
  </form>  

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
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          renderOrdersTable(clients)
        )}
        {selectedView === 'Imported' && renderOrdersTable(importedData)}
        {loading && (
      <div className="text-center py-4">
        <span>Loading more clients...</span>
      </div>
    )}

    {/* End of data message */}
     {!hasMore && (
      <div className="text-center py-4">
        <span>No more clients to load</span>
      </div>
    )}

      
      </div>
    </div>
  );
};

export default Clients;

