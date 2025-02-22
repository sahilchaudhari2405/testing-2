import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';
import BarcodeReader from 'react-barcode';
import ExpireDate from '../component/ExpireDate';

const EditOrder = () => {
  const [formData, setFormData] = useState({
    Name: '',
    mobileNumber: '',
    email: 'No',
    orderDate: '',
    paymentType: {
      cash: 0,
      Card: 0,
      UPI: 0,
    },
    orderItems: [],
    billImageURL: '',
    totalPrice: '',
    totalDiscountedPrice: '',
    totalPurchaseRate: '',
    GST: '',
    discount: 0,
    orderStatus: 'first time',
    totalItem: '',
    totalProfit: '',
    finalPriceWithGST: '',
  });
  const [orderId, setOrderId] = useState('');
  const [paymenttype, setpaymenttype] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedOrder, setfetchedOrder] = useState(false);
  const [isChecked, setIsChecked] = useState(false);


  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };


  const handleScan = (data) => {
    // console.log(isChecked)
    if (isChecked&&data) {
      setOrderId(data);
      fetchOrderData();
    }
  };

  const handleError = (err) => {
    // console.log(isChecked)
    // if (isChecked) {

    //   fetchProducts(766576577878')
    // }
    alert("Connnect the Barcode Scanner")
    // dispatch(fetchProduct("5345435334"));
  };


  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const formatDateToDisplay = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchOrderData = async () => {
    if (!orderId) {
      setError('Please enter an Order ID.');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/sales/order/getCounterOrderbyID/${orderId}`);
      setFormData(response.data);
      const orderData = response.data.data;
      const formattedOrderDate = orderData.orderDate.split('T')[0];
      const displayOrderDate = formatDateToDisplay(formattedOrderDate);

      setFormData({
        Name: orderData.Name,
        mobileNumber: orderData.mobileNumber,
        email: orderData.email,
        orderDate: formattedOrderDate,
        orderItems: orderData.orderItems,
        paymentType: orderData.paymentType,
        billImageURL: orderData.billImageURL || '', // Add this if available in the response
        totalPrice: orderData.totalPrice,
        totalDiscountedPrice: orderData.totalDiscountedPrice,
        totalPurchaseRate: orderData.totalPurchaseRate,
        GST: orderData.GST,
        discount: orderData.discount,
        orderStatus: orderData.orderStatus,
        totalItem: orderData.totalItem,
        totalProfit: orderData.totalProfit,
        finalPriceWithGST: orderData.finalPriceWithGST,
      });
      setpaymenttype(orderData.paymentType);
      setfetchedOrder(true);


      setError('');
    } catch (err) {
      setError('Failed to fetch order data. Please check the Order ID.');
      setFormData({
        Name: '',
        mobileNumber: '',
        email: 'No',
        orderDate: '',
        orderItems: [],
        paymentType: {
          cash: 0,
          Card: 0,
          UPI: 0,
        },
        billImageURL: '',
        totalPrice: '',
        totalDiscountedPrice: '',
        totalPurchaseRate: '',
        GST: '',
        discount: 0,
        orderStatus: 'first time',
        totalItem: '',
        totalProfit: '',
        finalPriceWithGST: '',
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      paymentType: {
        ...prevData.paymentType,
        [name]: Number(value)
      }
    }));

  };
  const handleOrderItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOrderItems = [...formData.orderItems];
    updatedOrderItems[index] = {
      ...updatedOrderItems[index],
      [name]: value,
    };
    setFormData((prevState) => ({
      ...prevState,
      orderItems: updatedOrderItems,
    }));
  };

  const handleRemoveOrderItem = (e,orderId, itemId) => {
    e.preventDefault();

    const remove_payload = {
      itemId : itemId,
      orderId : orderId
    }

    axiosInstance.put('/sales/order/RemoveOneItem', remove_payload)
      .then(async response => {
        toast.success('Order item removed successfully!');
        await fetchOrderData()
      })
      .catch(err => {
        toast.error('Failed to remove item.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`/sales/order/updateOrderbyID/${orderId}`, formData)
      .then(async response => {
        toast.success('Order updated successfully!');
        await fetchOrderData()
      })
      .catch(err => {
        alert('Failed to update order.');
      });
  };

  const cancelOrder =() => {
    const cancelOrder_payload = {
      orderId : orderId
    }

    axiosInstance.put('/sales/order/cancelOrder', cancelOrder_payload)
      .then(async response => {
        toast.success('Order cancelled successfully!');
        await fetchOrderData()
      })
      .catch(err => {
        toast.error('Failed to cancel order');
      });
      setFormData({
        Name: '',
        mobileNumber: '',
        email: 'No',
        orderDate: '',
        orderItems: [],
        paymentType: {
          cash: 0,
          Card: 0,
          UPI: 0,
        },
        billImageURL: '',
        totalPrice: '',
        totalDiscountedPrice: '',
        totalPurchaseRate: '',
        GST: '',
        discount: 0,
        orderStatus: 'first time',
        totalItem: '',
        totalProfit: '',
        finalPriceWithGST: '',
      });

  }

  const handleDecreaseQuantity = (e,iteamId) => {
    //fefds decreaseQuantity
    e.preventDefault();
    const decreaseQuantity_payload = {
      orderId : orderId,
      iteamId : iteamId,
      paymentType : paymenttype
    }

    axiosInstance.put('/sales/order/decreaseQuantity', decreaseQuantity_payload)
      .then(async response => {
        toast.success('Quantity decreased successfully!');
        await fetchOrderData()
      })
      .catch(err => {
        toast.error('Failed to decrease quantity');
      });
      fetchOrderData();

  }


  return (
    <div className="bg-gray-100 mt-20  mx-6 rounded-lg shadow-lg">
        <ExpireDate/>
      <div className="bg-blue-700 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">Edit Order</h1>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
        <div className="mb-6">
          <BarcodeReader onError={handleError} onScan={handleScan} />
              
          <label className="block text-gray-700 font-medium mb-2">Enter Order ID or Scan the Barcode</label>
          <div className="flex space-x-4">
            <div>
              <label
                  htmlFor="scanner"
                  className="block text-sm font-medium"
                >
                  Scanner
                </label>
                <input
                  type="checkbox"
                  id="scanner"
                  checked={isChecked}
                  onChange={handleCheckboxChange} 
                  className="border border-gray-300 rounded mt-4 p-2"
                />
              </div>
            <input
              type="text"
              value={orderId}
              onChange={handleOrderIdChange}
              className="flex-grow p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Order ID or Barcode"
            />
            <button
              onClick={fetchOrderData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Order'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        { fetchedOrder && (<form onSubmit={handleSubmit} className='bg-blue-100 rounded' >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Mobile Number</label>
              <input
                type="number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Order Date</label>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium">Payment (Cash)</label>
              <input
                type="number"
                name="cash"
                value={formData.paymentType?.cash}
                onChange={handlePaymentChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Payment (Card)</label>
              <input
                type="number"
                name="Card"
                value={formData.paymentType?.Card}
                onChange={handlePaymentChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Payment (UPI)</label>
              <input
                type="number"
                name="UPI"
                value={formData.paymentType?.UPI}
                onChange={handlePaymentChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div>
              <label className="block text-gray-700 font-medium">Bill Image URL</label>
              <input
                type="text"
                name="billImageURL"
                value={formData.billImageURL}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Total Price</label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Total Discounted Price</label>
              <input
                type="number"
                name="totalDiscountedPrice"
                value={formData.totalDiscountedPrice}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium">Total Purchase Rate</label>
              <input
                type="number"
                name="totalPurchaseRate"
                value={formData.totalPurchaseRate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
            <div>
              <label className="block text-gray-700 font-medium">GST</label>
              <input
                type="number"
                name="GST"
                value={formData.GST}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Order Status</label>
              <input
                type="text"
                name="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Total Items</label>
              <input
                type="number"
                name="totalItem"
                value={formData.totalItem}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* <div>
              <label className="block text-gray-700 font-medium">Total Profit</label>
              <input
                type="number"
                name="totalProfit"
                value={formData.totalProfit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}
            <div>
              <label className="block text-gray-700 font-medium">Final Price with GST</label>
              <input
                type="number"
                name="finalPriceWithGST"
                value={formData.finalPriceWithGST}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* {formData.orderItems.map((item, index) => (
            <div key={item._id} className="flex items-center justify-between p-4 mb-2 border border-gray-300 rounded-lg shadow-sm">
              <div className="flex-grow">
                <p className="text-gray-700 font-medium text-lg">{item.product.title}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-500">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  // onClick={() => handleDecreaseQuantity(item._id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded"
                >
                  -
                </button>
                <button
                  onClick={() => handleRemoveOrderItem(orderId, item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            ))} */}

          </div>
          <div className='p-4 bg-blue-300'>
          <h1 className='text-xl font-bold  mb-4'>Order Items</h1>
          { formData.orderItems.length > 0 ? (
          formData.orderItems.map((item, index) => (
            <div key={item._id} className="flex items-center justify-between p-4 bg-white  mb-2 max-w-fit border border-gray-300 rounded-lg shadow-sm">
              <div className="flex-grow flex flex-row">
                <p className="text-gray-700 font-medium text-lg">{item.product.title}</p>
                <div className="flex items-center ml-4 mr-4 space-x-4">
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-500">Price: ${item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleDecreaseQuantity(e,item._id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded"
                >
                  Decrease Quantity
                </button>
                <button
                  onClick={(e) => handleRemoveOrderItem(e,orderId, item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))) :
           ( <h1 className='text-lg font-semibold text-red-500 mb-4'>OrderItems are Empty</h1> ) 
          }
          </div> 
          
          <div className="flex p-4 bg-blue-700 rounded-b-lg justify-end space-x-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Save changes
            </button>
            <div onClick={cancelOrder}
              className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ${ fetchedOrder ? '' : 'opacity-50 cursor-not-allowed'}`}
            >
              Cancel this Order
            </div>
            <button type="button" className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors" onClick={() => {
              setFormData({
                Name: '',
                mobileNumber: '',
                email: 'No',
                orderDate: '',
                orderItems: [],
                paymentType: {
                  cash: 0,
                  Card: 0,
                  UPI: 0,
                },
                billImageURL: '',
                totalPrice: '',
                totalDiscountedPrice: '',
                totalPurchaseRate: '',
                GST: '',
                discount: 0,
                orderStatus: 'first time',
                totalItem: '',
                totalProfit: '',
                finalPriceWithGST: '',
              });
              setOrderId('');
              setError('');
            }}>
              Reset
            </button>
          </div>
        </form> )
        }
        
      </div>
    </div>
  );
};

export default EditOrder;
