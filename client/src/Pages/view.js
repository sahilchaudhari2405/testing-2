import React, { useState,useEffect } from 'react';
import { FaArrowDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrder, deleteOrder } from '../Redux/Orders/orderSlice';
import { useNavigate } from 'react-router-dom';
const salesData = [
    { SrNo: 1, Name: 'John Doe', Mobile: '1234567890', GSTNo: '12ABCDE1234F1Z5', Address: '123 Main St, City', Disc: '10%', Taxable: '$1000', IGST: '$18', SGST: '$9', CGST: '$9', CESS: '$0', Less: '$50', Total: '$936', Mode: 'Credit', Pending: '$200', User: 'salescounter1' },
    { SrNo: 2, Name: 'Jane Smith', Mobile: '2345678901', GSTNo: '22BCDEF2345G6H7', Address: '456 Elm St, Town', Disc: '5%', Taxable: '$500', IGST: '$9', SGST: '$4.5', CGST: '$4.5', CESS: '$0', Less: '$25', Total: '$484', Mode: 'Cash', Pending: '$0', User: 'salescounter2' },
    { SrNo: 3, Name: 'Michael Brown', Mobile: '3456789012', GSTNo: '33CDEFG3456H7I8', Address: '789 Oak St, Village', Disc: '8%', Taxable: '$800', IGST: '$14.4', SGST: '$7.2', CGST: '$7.2', CESS: '$0', Less: '$40', Total: '$767.2', Mode: 'Credit', Pending: '$150', User: 'salescounter3' },
    { SrNo: 4, Name: 'Emily Davis', Mobile: '4567890123', GSTNo: '44DEFGH4567I8J9', Address: '101 Pine St, City', Disc: '12%', Taxable: '$1200', IGST: '$21.6', SGST: '$10.8', CGST: '$10.8', CESS: '$0', Less: '$60', Total: '$1162.4', Mode: 'Online', Pending: '$300', User: 'salescounter4' },
    { SrNo: 5, Name: 'David Wilson', Mobile: '5678901234', GSTNo: '55EFGHI5678J9K0', Address: '202 Maple St, Suburb', Disc: '7%', Taxable: '$700', IGST: '$12.6', SGST: '$6.3', CGST: '$6.3', CESS: '$0', Less: '$35', Total: '$678', Mode: 'Credit', Pending: '$100', User: 'salescounter5' },
    { SrNo: 6, Name: 'Olivia Johnson', Mobile: '6789012345', GSTNo: '66FGHIJ6789K0L1', Address: '303 Birch St, City', Disc: '6%', Taxable: '$600', IGST: '$10.8', SGST: '$5.4', CGST: '$5.4', CESS: '$0', Less: '$30', Total: '$590.8', Mode: 'Cash', Pending: '$50', User: 'salescounter6' },
    { SrNo: 7, Name: 'James Taylor', Mobile: '7890123456', GSTNo: '77GHIJK7890L1M2', Address: '404 Cedar St, Town', Disc: '9%', Taxable: '$900', IGST: '$16.2', SGST: '$8.1', CGST: '$8.1', CESS: '$0', Less: '$45', Total: '$877.2', Mode: 'Credit', Pending: '$120', User: 'salescounter7' },
    { SrNo: 8, Name: 'Sophia Martinez', Mobile: '8901234567', GSTNo: '88HIJKL8901M2N3', Address: '505 Spruce St, Suburb', Disc: '11%', Taxable: '$1100', IGST: '$19.8', SGST: '$9.9', CGST: '$9.9', CESS: '$0', Less: '$55', Total: '$1064.8', Mode: 'Cash', Pending: '$70', User: 'salescounter8' },
    { SrNo: 9, Name: 'William Brown', Mobile: '9012345678', GSTNo: '99JKLMN9012N3O4', Address: '606 Fir St, City', Disc: '8%', Taxable: '$800', IGST: '$14.4', SGST: '$7.2', CGST: '$7.2', CESS: '$0', Less: '$40', Total: '$767.2', Mode: 'Online', Pending: '$150', User: 'salescounter9' },
    { SrNo: 10, Name: 'Isabella Lee', Mobile: '0123456789', GSTNo: '10JKLMN0123O4P5', Address: '707 Willow St, Village', Disc: '15%', Taxable: '$1500', IGST: '$27', SGST: '$13.5', CGST: '$13.5', CESS: '$0', Less: '$75', Total: '$1455', Mode: 'Credit', Pending: '$300', User: 'salescounter10' },
  ];
  

  const purchaseData = [
    { SrNo: 1, Name: 'Supplier A', Mobile: '9876543210', GSTNo: '21ABCDE1234F1Z5', Address: '808 Oak St, City', Disc: '8%', Taxable: '$2000', IGST: '$36', SGST: '$18', CGST: '$18', CESS: '$0', Less: '$100', Total: '$1878', Mode: 'Cash', Pending: '$500', User: 'purchasemanager1' },
    { SrNo: 2, Name: 'Supplier B', Mobile: '8765432109', GSTNo: '32BCDEF2345G6H7', Address: '909 Pine St, Town', Disc: '7%', Taxable: '$1500', IGST: '$27', SGST: '$13.5', CGST: '$13.5', CESS: '$0', Less: '$75', Total: '$1465', Mode: 'Credit', Pending: '$300', User: 'purchasemanager2' },
    { SrNo: 3, Name: 'Supplier C', Mobile: '7654321098', GSTNo: '43CDEFG3456H7I8', Address: '1010 Birch St, Village', Disc: '10%', Taxable: '$2500', IGST: '$45', SGST: '$22.5', CGST: '$22.5', CESS: '$0', Less: '$125', Total: '$2422.5', Mode: 'Online', Pending: '$400', User: 'purchasemanager3' },
    { SrNo: 4, Name: 'Supplier D', Mobile: '6543210987', GSTNo: '54DEFGH4567I8J9', Address: '1111 Cedar St, City', Disc: '9%', Taxable: '$1800', IGST: '$32.4', SGST: '$16.2', CGST: '$16.2', CESS: '$0', Less: '$90', Total: '$1746.4', Mode: 'Cash', Pending: '$200', User: 'purchasemanager4' },
    { SrNo: 5, Name: 'Supplier E', Mobile: '5432109876', GSTNo: '65EFGHI5678J9K0', Address: '1212 Maple St, Suburb', Disc: '6%', Taxable: '$2200', IGST: '$39.6', SGST: '$19.8', CGST: '$19.8', CESS: '$0', Less: '$110', Total: '$2068.8', Mode: 'Credit', Pending: '$300', User: 'purchasemanager5' },
    { SrNo: 6, Name: 'Supplier F', Mobile: '4321098765', GSTNo: '76FGHIJ6789K0L1', Address: '1313 Elm St, City', Disc: '11%', Taxable: '$1900', IGST: '$34.2', SGST: '$17.1', CGST: '$17.1', CESS: '$0', Less: '$95', Total: '$1856.2', Mode: 'Online', Pending: '$250', User: 'purchasemanager6' },
    { SrNo: 7, Name: 'Supplier G', Mobile: '3210987654', GSTNo: '87GHIJK7890L1M2', Address: '1414 Oak St, Town', Disc: '5%', Taxable: '$1600', IGST: '$28.8', SGST: '$14.4', CGST: '$14.4', CESS: '$0', Less: '$80', Total: '$1552.8', Mode: 'Cash', Pending: '$150', User: 'purchasemanager7' },
    { SrNo: 8, Name: 'Supplier H', Mobile: '2109876543', GSTNo: '98HIJKL8901M2N3', Address: '1515 Pine St, Suburb', Disc: '12%', Taxable: '$2400', IGST: '$43.2', SGST: '$21.6', CGST: '$21.6', CESS: '$0', Less: '$120', Total: '$2336.8', Mode: 'Credit', Pending: '$350', User: 'purchasemanager8' },
    { SrNo: 9, Name: 'Supplier I', Mobile: '1098765432', GSTNo: '09JKLMN9012N3O4', Address: '1616 Birch St, Village', Disc: '7%', Taxable: '$1700', IGST: '$30.6', SGST: '$15.3', CGST: '$15.3', CESS: '$0', Less: '$85', Total: '$1605.6', Mode: 'Online', Pending: '$200', User: 'purchasemanager9' },
    { SrNo: 10, Name: 'Supplier J', Mobile: '0987654321', GSTNo: '10JKLMN0123O4P5', Address: '1717 Cedar St, City', Disc: '9%', Taxable: '$2100', IGST: '$37.8', SGST: '$18.9', CGST: '$18.9', CESS: '$0', Less: '$105', Total: '$2070.6', Mode: 'Cash', Pending: '$250', User: 'purchasemanager10' },
  ];
  
const View = () => {
  const navigate = useNavigate()
  const [selectedView, setSelectedView] = useState('Sales');
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const handleSelect = (view) => {
    setSelectedView(view);
  };
  const handleDelete = (item) => {
    console.log(item)
    dispatch(deleteOrder(item._id));
  };
  const handleEdit = (item) => {
    console.log(item.Name)
  navigate(`/sales/${item._id}`)
  };
  
// console.log(orders)
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
        {data?.map((item,i) => (
          <tr key={item._id} className={(i+1) % 2 === 0 ? 'bg-zinc-100' : 'bg-white'}>
            <td className="border border-zinc-800 px-4 py-2">{i+1}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.Name}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.mobileNumber}</td>
            <td className="border border-zinc-800 px-4 py-2">(Maharastra)</td>
            <td className="border border-zinc-800 px-4 py-2">{item.discount}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.totalDiscountedPrice}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.GST}%</td>
            <td className="border border-zinc-800 px-4 py-2">{item.totalDiscountedPrice}</td>
            <td className="border border-zinc-800 px-4 py-2">CASH:{item.paymentType?.cash}|CARD:{item.paymentType?.Card}|UPI:{item.paymentType?.UPI}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.orderStatus}</td>
            <td className="border border-zinc-800 px-4 py-2">{item.user}</td>
            <td className="border border-zinc-800 px-4 py-2">
              <div className='flex justify-around'>
                <button className="text-blue-500">
                  <FaEdit aria-hidden="true" onClick={()=>handleEdit(item)}/>
                </button>
                <button className="text-red-500">
                  <FaTrash aria-hidden="true" onClick={()=>handleDelete(item)}/>
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

        {selectedView === 'Sales' && renderTable(orders)}
        {selectedView === 'Purchase' && renderTable(orders)}
      </div>
    </div>
  );
};

export default View;
