import React, { useRef, useState, useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder, deleteOrder } from '../Redux/Orders/orderSlice';
import { useNavigate } from 'react-router-dom';
import { TbEyeEdit } from "react-icons/tb";
import ReactToPrint from "react-to-print";
import logo from "../logo.png";

const sharedClasses = {
  flex: 'flex ',
  justifyBetween: 'justify-between',
  itemsCenter: 'items-center',
  mb4: 'mb-4',
  border: 'border text-center',
  p2: 'p-2',
  fontBold:'font-bold',
};

const View = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('Sales');
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [details, setDetails] = useState(null);
  const printRef = useRef();
  const orders = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  
  const handlePrint = (item) => {
    setDetails(item);
  };
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (details && printRef.current) {
      printRef.current.handlePrint();
    }
  }, [handlePrint]);

  const handleSelect = (view) => {
    setSelectedView(view);
  };

  const handleDelete = (item) => {
    dispatch(deleteOrder(item._id));
  };

  const handleEdit = (item) => {
    navigate(`/sales/${item._id}`);
  };

  // const handlePrint = (item) => {
  //   setDetails(item);
  // };

  const renderTable = (data) => (
    <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-gray-600 text-white">
        <tr>
          <th className="border border-zinc-800 px-4 py-2">SrNo.</th>
          <th className="border border-zinc-800 px-4 py-2">Name</th>
          <th className="border border-zinc-800 px-4 py-2">Mobile</th>
          <th className="border border-zinc-800 px-4 py-2">Address</th>
          <th className="border border-zinc-800 px-4 py-2">Disc</th>
          <th className="border border-zinc-800 px-4 py-2">Taxable</th>
          <th className="border border-zinc-800 px-4 py-2">GST</th>
          <th className="border border-zinc-800 px-4 py-2">Total</th>
          <th className="border border-zinc-800 px-4 py-2">Payment Mode</th>
          <th className="border border-zinc-800 px-4 py-2">Pending</th>
          <th className="border border-zinc-800 px-4 py-2">Counter</th>
          <th className="border border-zinc-800 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((item, i) => (
          <tr key={item._id} className={(i + 1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
            <td className="border border-zinc-800 px-4 py-2">{i + 1}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.Name}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.mobileNumber}</td>
            <td className="border border-zinc-800 px-4 py-2">(Maharastra)</td>
            <td className="border border-zinc-800 px-4 py-2">{item.discount}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.totalDiscountedPrice}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.GST}%</td>
            <td className="border border-zinc-800 px-4 py-2">{item.totalDiscountedPrice}</td>
            <td className="border border-zinc-800 px-4 py-2">CASH:{item.paymentType.cash}|CARD:{item.paymentType.Card}|UPI:{item.paymentType.UPI}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.orderStatus}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.user}</td>
            <td className="border border-zinc-800 px-4 py-2">
              <div className='flex justify-around'>
                <button className="text-blue-500" onClick={() => handlePrint(item)}>
                  <span className='text-center'>
                    <TbEyeEdit className="text-2xl" />
                    Invoice
                  </span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

      {/* {selectedView === 'Sales' && renderTable(orders)}
        {selectedView === 'Purchase' && renderTable(orders)} */}

  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg">
      <div className="bg-slate-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-lg font-bold">View Data</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className='font-bold'>salescounter1</span></span>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">LogOut</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Print Report</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Excel Report</button>
        </div>

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
                <option value="Sales">Sales View</option>
                <option value="Purchase">Purchase View</option>
              </select>
            </div>
          </label>
        </div>

        <div>
          {renderTable(orders)}
        </div>
      </div>
<div className='hidden'>
      {details && (
        <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">
          {/* <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
              <div>
                <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
                <p>APALA BAJAR</p>
                <p>SHRIGONDA, AHMADNAGAR</p>
                <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
                <p>PHONE: 9849589588</p>
                <p>EMAIL: aaplabajar1777@gmail.com</p>
              </div>
              <div className="w-24 h-24 border flex items-center justify-center">
                <img src={logo} alt="Insert Logo Above" />
              </div>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h2 className="text-lg font-bold">Customer Details:</h2>
              <p>Name: {details.Name}</p>
              <p>Mobile: {details.mobileNumber}</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <h2 className="text-lg font-bold">Order Summary:</h2>
              <p>Order Date: {details.orderDate}</p>
              <p>Payment Type: Cash</p>
            </div>
            <hr className="mb-4" />
            <div className="mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={`${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.fontBold}`}>Item</th>
                    <th className={`${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.fontBold}`}>Quantity</th>
                    <th className={`${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.fontBold}`}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {details.items?.map((item, index) => (
                    <tr key={index}>
                      <td className={`${sharedClasses.border} ${sharedClasses.p2}`}>{item.name}</td>
                      <td className={`${sharedClasses.border} ${sharedClasses.p2}`}>{item.quantity}</td>
                      <td className={`${sharedClasses.border} ${sharedClasses.p2}`}>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr className="mb-4" />
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
              <p className="font-bold">Discount: 50 Rs</p>
              <p className="font-bold">Tax: 50 Rs</p>
              <p className="font-bold">Total: 400 Rs</p>
            </div>
            <hr className="mb-4" />
            <div className="text-center">
              <p>Thank you for your business!</p>
              <p>Terms and conditions apply</p>
            </div>
          </div> */}
           <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
        <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
          <div>
            <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
            <p>APALA BAJAR</p>
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
            <span>{details._id}</span>
          </div>
          <div>
            <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
            <span>{details.updatedAt}</span>
          </div>
        </div>
        <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
          <div className="w-1/2 pr-2">
            <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
            <p>{details.Name.toUpperCase()}</p>
            <p>{details.Address?.toUpperCase()}</p>
            {/* <p>{details.email}</p> */}
            <p>PHONE:{details.mobileNumber}</p>
          </div>
        </div>
        <table className="w-full border-collapse border mb-4">
          <thead>
            <tr className="bg-black text-white">
              <th className={sharedClasses.border + " " + sharedClasses.p2}>DESCRIPTION</th>
              <th className={sharedClasses.border + " " + sharedClasses.p2}>QUANTITY</th>
              <th className={sharedClasses.border + " " + sharedClasses.p2}>GST</th>
              <th className={sharedClasses.border + " " + sharedClasses.p2}>DISCOUNT</th>
              <th className={sharedClasses.border + " " + sharedClasses.p2}>PRICE</th>
              <th className={sharedClasses.border + " " + sharedClasses.p2}>UNIT PRICE</th>
            </tr>
          </thead>
          <tbody>
            {details.orderItems.map((e, index) => (
              <tr key={index}>
                <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.product.title}</td>
                <td className={sharedClasses.border + " " + sharedClasses.p2 + "h-12"}>{e.quantity}</td>
                <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.GST}</td>
                <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.price - e.discountedPrice}</td>
                <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.price}</td>
                <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.discountedPrice}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}>
          <div className="w-1/4">
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
              <span>SUBTOTAL</span>
              <span>₹{details.totalPrice}</span>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
              <span>DISCOUNT</span>
              <span>₹{details.totalPrice-details.totalDiscountedPrice}</span>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
              <span>GST</span>
              <span>₹{details.GST}</span>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
              <span>Amount Pay</span>
              <span>₹{details.finalPriceWithGST}</span>
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
      )}
</div>
      <ReactToPrint
        trigger={() => <button style={{ display: 'none' }} />}
        content={() => componentRef.current}
        ref={printRef}
      />
    </div>
  );
};

export default View;
