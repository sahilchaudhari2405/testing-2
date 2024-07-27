// import React from 'react';

// const Sale = () => {
//   return (
//     <div className="bg-zinc-100 mt-28 mx-6">
//       <div className="bg-zinc-300 p-4 flex justify-between items-center">
//         <div className="text-lg font-bold">SALES</div>
//         <div className="text-sm">
//           <span>Online Orders | Hi, salescounter1 - </span>
//           <a href="#" className="text-blue-500">LogOut</a>
//         </div>
//       </div>
//       <div className="bg-white p-4 shadow-md">
//         <div className="grid grid-cols-4 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Type</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" value="Sales" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Name</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Ref.</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Mobile</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Address</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Invoice</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" value="63525" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Ship To</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">Date</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" value="18-07-2024" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">GST NO.</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-zinc-700">State</label>
//             <input type="text" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" value="Maharashtra (27)" />
//           </div>
//         </div>
//         <div className="grid grid-cols-4 gap-4 mb-4">
//           <div className="flex items-center">
//             <label className="block text-sm font-medium text-zinc-700 mr-2">Sold</label>
//             <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Recent</button>
//           </div>
//           <div className="flex items-center">
//             <label className="block text-sm font-medium text-zinc-700 mr-2">Loyalty</label>
//             <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Balance</button>
//           </div>
//           <div className="flex items-center">
//             <label className="block text-sm font-medium text-zinc-700 mr-2">Wholesale</label>
//             <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Balance</button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead>
//               <tr className="w-full bg-zinc-200 text-zinc-600 uppercase text-sm leading-normal">
//                 <th className="py-3 px-6 text-left">#</th>
//                 <th className="py-3 px-6 text-left">Description</th>
//                 <th className="py-3 px-6 text-left">Offers</th>
//                 <th className="py-3 px-6 text-left">Agent</th>
//                 <th className="py-3 px-6 text-left">MRP</th>
//                 <th className="py-3 px-6 text-left">Net Qty</th>
//                 <th className="py-3 px-6 text-left">Price</th>
//                 <th className="py-3 px-6 text-left">Rate</th>
//                 <th className="py-3 px-6 text-left">Value</th>
//                 <th className="py-3 px-6 text-left">Disc.</th>
//                 <th className="py-3 px-6 text-left">GST%</th>
//                 <th className="py-3 px-6 text-left">Total Value</th>
//                 <th className="py-3 px-6 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-zinc-600 text-sm font-light">
//               <tr className="border-b border-zinc-200 hover:bg-zinc-100">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">1</td>
//                 <td className="py-3 px-6 text-left">KISAN PEANUT BUTTER</td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">
//                   <input type="number" className="border-zinc-300 rounded-md shadow-sm w-full" value="1" />
//                 </td>
//                 <td className="py-3 px-6 text-left">PCS-PF</td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">
//                   <button className="text-red-500">
//                     <img aria-hidden="true" alt="delete" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
//                   </button>
//                 </td>
//               </tr>
//               <tr className="border-b border-zinc-200 hover:bg-zinc-100">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">2</td>
//                 <td className="py-3 px-6 text-left">KIDS COLGATE 85RS</td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">85</td>
//                 <td className="py-3 px-6 text-left">
//                   <input type="number" className="border-zinc-300 rounded-md shadow-sm w-full" value="1" />
//                 </td>
//                 <td className="py-3 px-6 text-left">PCS-PF</td>
//                 <td className="py-3 px-6 text-left">80</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">80</td>
//                 <td className="py-3 px-6 text-left">
//                   <button className="text-red-500">
//                     <img aria-hidden="true" alt="delete" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
//                   </button>
//                 </td>
//               </tr>
//               <tr className="border-b border-zinc-200 hover:bg-zinc-100">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">3</td>
//                 <td className="py-3 px-6 text-left">FAIR AND LOVELY 52RS</td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">52</td>
//                 <td className="py-3 px-6 text-left">
//                   <input type="number" className="border-zinc-300 rounded-md shadow-sm w-full" value="1" />
//                 </td>
//                 <td className="py-3 px-6 text-left">PCS-PF</td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">
//                   <button className="text-red-500">
//                     <img aria-hidden="true" alt="delete" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
//                   </button>
//                 </td>
//               </tr>
//               <tr className="border-b border-zinc-200 hover:bg-zinc-100">
//                 <td className="py-3 px-6 text-left whitespace-nowrap">4</td>
//                 <td className="py-3 px-6 text-left">SUGAR 1 KG</td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">
//                   <select className="border-zinc-300 rounded-md shadow-sm">
//                     <option>Select</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-6 text-left">50</td>
//                 <td className="py-3 px-6 text-left">
//                   <input type="number" className="border-zinc-300 rounded-md shadow-sm w-full" value="1" />
//                 </td>
//                 <td className="py-3 px-6 text-left">PCS-PF</td>
//                 <td className="py-3 px-6 text-left">40</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">0</td>
//                 <td className="py-3 px-6 text-left">40</td>
//                 <td className="py-3 px-6 text-left">
//                   <button className="text-red-500">
//                     <img aria-hidden="true" alt="delete" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <div className="grid grid-cols-3 gap-4 my-4">
//           <div className="col-span-2">
//             <textarea className="w-full border-zinc-300 rounded-md shadow-sm" rows="4" placeholder="Other Expenses Details"></textarea>
//           </div>
//           <div className="flex flex-col space-y-2">
//             <div className="flex justify-between">
//               <span>Discounts</span>
//               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
//             </div>
//             <div className="flex justify-between">
//               <span>Other Expenses</span>
//               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
//             </div>
//             <div className="flex justify-between">
//               <span>Payment</span>
//               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
//             </div>
//             <div className="flex justify-between">
//               <span>Balance</span>
//               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sale;



import React, { useRef,useEffect,useState} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBarcode } from 'react-icons/fa'; // Import the barcode icon from react-icons
import ReactToPrint from "react-to-print";
import logo from '../logo.png';
import {jwtDecode} from 'jwt-decode';
import { logoutUser } from '../Redux/User/userSlices';
import { toast } from 'react-toastify';


const Sale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');

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

  const handleOrderEdit = () => {
    navigate('/editOrder');
  }

  const sharedClasses = {
    flex: 'flex',
    justifyBetween: 'justify-between',
    itemsCenter: 'items-center',
    mb4: 'mb-4',
    border: 'border text-center',
    p2: 'p-2',
    fontBold: 'font-bold',
  }
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [GST, setGST] = useState();
  const [discount, setDiscount] = useState();

  const details=[{
    id:99048945534,
    description:"product name 1",
    quantity:2,
    discount:2,
    gst:2,
    price:100
  },
  {
    id:99048945049,
    description:"product name 2",
    quantity:1,
    discount:5,
    gst:4,
    price:34,

  },
  {
    id:99048945545,
    description:"product name 3",
    quantity:3,
    discount:3,
    gst:1,
    price:18,

  },
  {
    id:990489454954,
    description:"product name 4",
    quantity:4,
    discount:12,
    gst:2,
    price:20,

  }
  ]
  useEffect(() => {
    setList(details);
    const totalAmount = details.reduce((total, item) => total + (item.price*item.quantity), 0);
    const disc = details.reduce((total, item) => total + (item.discount*item.quantity), 0);
    const GST = details.reduce((total, item) => total + ((item.price*item.gst/100)*item.quantity), 0);
    setTotal(totalAmount);
    setGST(GST);
    setDiscount(disc);
  }, []);
  const componentRef = useRef();
  return (
    <div className="bg-gray-100 mt-28 mx-6 rounded-lg shadow-lg">
      <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sale</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className='font-bold'>{fullName}</span></span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              LogOut
          </button>
          <button onClick={handleOrderEdit} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
              Edit an Order
          </button>

        </div>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sale</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Invoice</label>
            <input type="date" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ref.</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Mobile</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">GST No.</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ship To</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Maharashtra (27)</option>
            </select>
          </div>
        </div>


        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-zinc-700 mr-2">Sold</label>
            <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Recent</button>
          </div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-zinc-700 mr-2">Loyalty</label>
            <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Balance</button>
          </div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-zinc-700 mr-2">Wholesale</label>
            <button className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md">Balance</button>
          </div>
        </div>
        
        {/* New Input Fields */}
        <div className="flex flex-nowrap bg-gray-200 px-3 pt-3 rounded-md space-x-2 mb-6">
          <div className=" mb-4">
            <label htmlFor="list" className="block text-gray-700 text-sm font-medium">List</label>
            <input type="checkbox" id="list" className="border border-gray-300 rounded p-2" />
          </div>
          <div className=" m-4">
            <FaBarcode className='h-12'/>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="barcode" className="block text-gray-700 text-sm font-medium">Barcode</label>
            <input type="text" id="barcode" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter barcode" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="brand" className="block text-gray-700 text-sm font-medium">Brand</label>
            <input type="text" id="brand" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter brand" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium">Description</label>
            <input type="text" id="description" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter description" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-medium">Category</label>
            <input type="text" id="category" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter category" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="stock-type" className="block text-gray-700 text-sm font-medium">Stock Type</label>
            <input type="text" id="stock-type" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter stock type" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="unit" className="block text-gray-700 text-sm font-medium">Unit</label>
            <input type="text" id="unit" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter unit" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="qty" className="block text-gray-700 text-sm font-medium">Qty</label>
            <input type="text" id="qty" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter quantity" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="sale-rate" className="block text-gray-700 text-sm font-medium">Sale Rate</label>
            <input type="text" id="sale-rate" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Sale rate" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="profit" className="block text-gray-700 text-sm font-medium">Profit%</label>
            <input type="text" id="profit" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter profit percentage" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="hsn" className="block text-gray-700 text-sm font-medium">HSN</label>
            <input type="text" id="hsn" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter HSN" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="gst" className="block text-gray-700 text-sm font-medium">GST%</label>
            <input type="text" id="gst" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter GST percentage" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="total" className="block text-gray-700 text-sm font-medium">Total</label>
            <input type="text" id="total" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter total amount" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="amount-paid" className="block text-gray-700 text-sm font-medium">Amount Paid</label>
            <input type="text" id="amount-paid" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter amount paid" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/6 ml-6 my-6">
            <button className='bg-blue-600 text-white p-2 rounded-md'>Enter</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-gray-600">
                <th className="p-3 border border-gray-600 text-left">#</th>
                <th className="p-3 border border-gray-600 text-left">Description</th>
                <th className="p-3 border border-gray-600 text-left">Offers</th>
                <th className="p-3 border border-gray-600 text-left">Agent</th>
                <th className="p-3 border border-gray-600 text-left">MRP</th>
                <th className="p-3 border border-gray-600 text-left">Net Qty</th>
                <th className="p-3 border border-gray-600 text-left">Price</th>
                <th className="p-3 border border-gray-600 text-left">Rate</th>
                <th className="p-3 border border-gray-600 text-left">Value</th>
                <th className="p-3 border border-gray-600 text-left">Disc.</th>
                <th className="p-3 border border-gray-600 text-left">GST%</th>
                <th className="p-3 border border-gray-600 text-left">Total Value</th>
                <th className="p-3 border border-gray-600 text-left">Actions</th>
              </tr> 
            </thead>
            <tbody>
              {/* Add rows dynamically here */}
              <tr>
                <td className="py-3 px-6 border border-gray-600 text-left whitespace-nowrap">1</td>
                 <td className="py-3 px-6 border border-gray-600 text-left">KISAN PEANUT BUTTER</td>
                 <td className="p-3 border border-gray-600">
                   <select className="border-zinc-300 rounded-md shadow-sm">
                     <option>Select</option>
                   </select>
                 </td>
                 <td className="p-3 border border-gray-600">
                   <select className="border-zinc-300 rounded-md shadow-sm">
                     <option>Select</option>
                   </select>
                 </td>
                 <td className="p-3 border border-gray-600">50</td>
                 <td className="p-3 border border-gray-600">
                   <input type="number" className="border-zinc-300 rounded-md shadow-sm w-full" value="1" />
                 </td>
                 <td className="p-3 border border-gray-600">PCS-PF</td>
                 <td className="p-3 border border-gray-600">50</td>
                 <td className="p-3 border border-gray-600">0</td>
                 <td className="p-3 border border-gray-600">0</td>
                 <td className="p-3 border border-gray-600">0</td>
                 <td className="p-3 border border-gray-600">50</td>
                 <td className="p-3 border border-gray-600 text-center">
                  <button className="bg-yellow-500 text-white px-1 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 ">Delete</button>
                </td>
              </tr>
              {/* Repeat rows as needed */}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
    <div>
      <span class="text-muted-foreground">TOTAL</span>
      <span class="text-primary px-3">2</span>
    </div>
    <div class="flex space-x-2">
      <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">Save</button>
     
           <ReactToPrint
            trigger={() => (
              <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">Save & Print</button>
            )}
            content={() => componentRef.current}
          />
      <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">PDF</button>
      <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Hold</button>
      <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">View</button>
      <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Hold(1)</button>
    </div>

    <div className="flex flex-col bg-gray-400 p-3 space-y-2 space-x-3 rounded-md">
             <div className="flex justify-between">
               <span>Discounts</span>
               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
             </div>
             <div className="flex justify-between">
               <span>Other Expenses</span>
               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
             </div>
             <div className="flex justify-between">
               <span>Payment</span>
               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
             </div>
             <div className="flex justify-between">
               <span>Balance</span>
               <input type="number" className="border-zinc-300 rounded-md shadow-sm w-24" value="0" />
             </div>
           </div>

  </div>

        {/* <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Expense</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-3">INVOICE TOTAL :</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CASH:</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CARD:</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN UPI:</td>
                  <td className="border p-3">0</td>
                </tr>
              </tbody>
            </table>
          </div> */}



      </div>

      
          {/* ---------------------invoice ganrator------------------------- */}


          <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">

            <div ref={componentRef}  className="max-w-4xl mx-auto p-4 bg-white text-black">
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
        <div>
          <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
          <p>AAPLA BAJAR</p>
          <p>SHRIGONDA, AHMADNAGAR</p>
          <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
          <p>PHONE: 9849589588</p>
          <p>EMAIL: aaplabajar1777@gmail.com</p>
        </div>
        <div className="w-24 h-24 border flex items-center justify-center">
          <img src={logo} alt="Insert Logo Above" />
        </div>
      </div>
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
        <div>
          <span className={sharedClasses.fontBold}>INVOICE #: </span>
          <span>985934857944</span>
        </div>
        <div>
          <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
          <span>18/07/2024</span>
        </div>
      </div>
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
        <div className="w-1/2 pr-2">
          <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
          <p>Shivam Bole</p>
          <p>Pune,Maharashtra</p>
          <p>Pune,Maharashtra,444003</p>
          <p>9637837434</p>
          <p>shivam@gmail.com</p>
        </div>
      </div>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-black text-white">
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>QUANTITY</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>DESCRIPTION</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>GST</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>DISCOUNT</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>UNIT PRICE</th>
      
          </tr>
        </thead>
        <tbody>
          {list.map((e, index) => (
            <tr key={index}>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2 + ' h-12'}>{e.quantity}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.description}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.gst}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.discount}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.price}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}>
        <div className="w-1/4">
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>SUBTOTAL</span>
            <span>${total}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>DISCOUNT</span>
            <span>${discount}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>GST</span>
            <span>${GST}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
            <span>TOTAL</span>
            <span>${total-discount+GST}</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
        <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
      </div>
      <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
    </div>
        </div>
    </div>
  );
};

export default Sale;
