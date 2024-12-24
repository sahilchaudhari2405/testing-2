import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { toast } from 'react-toastify';
import BarcodeReader from 'react-barcode';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, clearCart, updateCartQuantity, addToCart } from '../Redux/Cart/cartSlice';


const Edit= () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderId: orderIdFromURL } = useParams();
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [editOrderItem, setEditOrderItem] = useState({});
  const [editOrderItemId, setEditOrderItemId] = useState(null);
  let { items, status, fetchCartError } = useSelector((State) => State.cart);
  const [isviewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({
    "_id": "66ab771af4df2f3e3c09ecb4",
    "title": "POSH COCOA POWDER",
    "description": "POSH COCOA POWDER",
    "price": 65,
    "discountedPrice": 64,
    "discountPercent": 0,
    "weight": 0,
    "quantity": -155,
    "brand": "Brand Name",
    "imageUrl": "https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png",
    "slug": "POSH COCOA POWDER",
    "ratings": [],
    "reviews": [],
    "numRatings": 0,
    "category": "66ab771af4df2f3e3c09ecb1",
    "createdAt": null,
    "updatedAt": null,
    "BarCode": "8906017232378",
    "stockType": "Stock Type",
    "unit": "PCS",
    "purchaseRate": 50,
    "profitPercentage": 0,
    "HSN": "HSN Code",
    "GST": 0,
    "retailPrice": 64,
    "totalAmount": 64,
    "amountPaid": 0,
    "__v": 0
  });



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

  useEffect(() => {
    if (orderIdFromURL) {
        setOrderId(orderIdFromURL); 
        console.log("yes")
      handleOrderIdChange({ target: { value: orderIdFromURL } });
      fetchOrderData();
    }
  }, [orderId]);





  const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited
  const [editableOrderItems, setEditableOrderItems] = useState(formData.orderItems);

  const handleEdit = (itemId) => {
    setEditingItemId(itemId);
  };

  const handleSave = (itemId) => {
    // Perform save logic here, such as calling an API to save the updated item
    setEditingItemId(null); // Exit edit mode
  };

  const handleInputChange = (e, itemId, field) => {
    const updatedItems = editableOrderItems.map((item) =>
      item._id === itemId ? { ...item, [field]: e.target.value } : item
    );
    setEditableOrderItems(updatedItems);
  };

  const handleOrderItemInputChange = (e, field) => {
    const { value } = e.target;

    setEditOrderItem(prevState => {
      const newState = { ...prevState };
      if (field.includes('.')) {
        const [outerKey, innerKey] = field.split('.');
        newState[outerKey] = { ...newState[outerKey], [innerKey]: value };
      } else {
        newState[field] = value;
      }

      const mrp = parseFloat(newState.product?.price || 0);
      const quantity = parseInt(newState.quantity || 0);
      const OneUnit = parseInt(newState.OneUnit);
      const gst = parseFloat(newState.GST || 0);

      // const totalValue = ((mrp * quantity - discount) * (1 + gst / 100)).toFixed(2);
      const totalValue = (OneUnit * quantity)+gst;
      newState.finalPrice_with_GST = totalValue;
      const {product} = editItem;
      let discount = mrp-OneUnit;
      if(mrp==0)
      {
       discount=product.OneUnit-OneUnit;
      }
      newState.discountedPrice=OneUnit*quantity
      // console.log(discount);
      newState.discount = discount;

      return newState;
    });
    console.log("edittem after input change: ",editItem);
  };

  const decreaseQuantity = (id) => {
    const item = items[0].find(item => item._id === id);
    if (item.quantity > 1) {
      dispatch(updateCartQuantity({ productId: id, quantity: item.quantity - 1 })).then(() => {
        dispatch(fetchCart());
      });
    }
  };

  const closeModal = () => {
    setIsViewProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveClick = async (e,itemId) => {
    e.preventDefault();
    // Extract necessary fields from editItem
    const { product } = editOrderItem;
    console.log(items);
    const { discountedPrice, quantity, GST, finalPrice_with_GST,OneUnit } = editOrderItem;
    let { title: productTitle, price: productPrice,  } = product;
    const ProductApalaBajarPrice = product.discountedPrice;
    if(productPrice==0)
    {
      productPrice=ProductApalaBajarPrice;
    }
    console.log(editOrderItem);
    // Construct the payload for the API request
    const payload = {
      productCode: product.BarCode, 
      discountedPrice: parseFloat(discountedPrice),
      quantity: parseInt(quantity),
      price: parseFloat(productPrice),
      OneUnit: parseFloat(OneUnit),
      discount: (parseFloat(productPrice) - parseFloat(OneUnit))*parseFloat(quantity),
      GST: parseFloat(GST),
      finalPrice_with_GST: parseFloat(finalPrice_with_GST)
    };
  
    try {
      const response = await axiosInstance.put('/sales/cart/adjustment', payload);
  
      // if (!response.ok) {
      //   throw new Error('Network response was not ok' + response.statusText);
      // }
      const resData = response.data;
      console.log("Save changes for item:", resData);
  
      setEditOrderItemId(null);
      setEditOrderItem({});
      dispatch(fetchCart());
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleCancelClick = () => {
    setEditOrderItemId(null);
    setEditOrderItem({});
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewProductModalOpen(true);
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id)).then(() => {
      dispatch(fetchCart());
    });
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };

  const handleEditClick = (e,item) => {
    e.preventDefault();

    setEditOrderItemId(item._id);
    setEditOrderItem({...item});
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
      console.log("editorderresponse: ",response.data);
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
      console.log("setFormData: ",formData);
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
    console.log("changed formdata: ",formData);
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
    console.log("changed formdata: ",formData);

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

  const handleRemoveOrderItem = async (e,orderId, itemId) => {
    e.preventDefault();

    const remove_payload = {
      itemId : itemId,
      orderId : orderId
    }

    axiosInstance.put('/sales/order/RemoveOneItem', remove_payload)
      .then(async response => {
        toast.success('Order item removed successfully!');
        await  fetchOrderData();
      })
      .catch(err => {
        toast.error('Failed to remove item.');
      });
    console.log("changed formdata: ",formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`/sales/order/updateOrderbyID/${orderId}`, formData)
      .then(async response => {
        toast.success('Order updated successfully!');
        await fetchOrderData();
        navigate('/view')
      })
      .catch(err => {
        alert('Failed to update order.');
      });
  };

  const cancelOrder =async () => {
    const cancelOrder_payload = {
      orderId : orderId
    }

    axiosInstance.put('/sales/order/cancelOrder', cancelOrder_payload)
      .then(async response => {
        toast.success('Order cancelled successfully!');
        await  fetchOrderData();
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

  const handleDecreaseQuantity = async (e,iteamId) => {
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
        await  fetchOrderData();
      })
      .catch(err => {
        toast.error('Failed to decrease quantity');
      });
      

  }


  return (
    <div className="bg-gray-100 mt-20  mx-6 rounded-lg shadow-lg">
        
      <div className="bg-blue-700 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">Edit Order</h1>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
        
        {/* <div className="mb-6">
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
        </div> */}
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
          {/* <div className="p-4 bg-blue-300">
  <h1 className="text-xl font-bold mb-4">Order Items</h1>
  {formData.orderItems.length > 0 ? (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Product Title</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Quantity</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Price</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
          <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>

        </tr>
      </thead>
      <tbody>
        {formData.orderItems.map((item, index) => (
          <tr key={item._id} className="border-t">
            <td className="px-4 py-2 text-gray-700">{item.product.title}</td>
            <td className="px-4 py-2 text-gray-500">{item.quantity}</td>
            <td className="px-4 py-2 text-gray-500">${item.price}</td>
            <td className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleDecreaseQuantity(e, item._id)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded"
                >
                  Decrease Quantity
                </button>
                <button
                  onClick={(e) => handleRemoveOrderItem(e, orderId, item._id)}
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <h1 className="text-lg font-semibold text-red-500 mb-4">Order Items are Empty</h1>
  )}
</div> */}
          <div className="overflow-x-auto p-4">
        <div>
            <span className="text-muted-foreground">ORDER ITEMS</span>
            <span className="text-primary px-3">{items[1]&&items[1].totalItem}</span>
          </div>
          <table className="w-full mb-2 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-gray-600">
                <th className="p-1 border border-gray-600 text-left">#</th>
                <th className="p-1 border border-gray-600 text-left">
                  Description
                </th>
                <th className="p-1 border border-gray-600 text-left">MRP</th>
                <th className="p-1 border border-gray-600 text-left w-[60px]">
                  Net Qty
                </th>
                <th className="p-1 border border-gray-600 text-left">Single Unit price</th>
                <th className="p-1 border border-gray-600 text-left">Disc.</th>
                <th className="p-1 border border-gray-600 text-left">Total Discount Price</th>
                <th className="p-1 border border-gray-600 text-left">GST%</th>
                <th className="p-1 border border-gray-600 text-left">
                  Total Value
                </th>
                <th className="p-1 border border-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              { formData.orderItems && (reverseOrder ? [...formData.orderItems].reverse() : formData.orderItems).map((item, i)  => (
                <tr key={item._id}>
                  <td className="py-1 px-3 border border-gray-600 text-left whitespace-nowrap">{i + 1}</td>
                  <td className="py-1 px-3 border border-gray-600 text-left">
                      {item.product?.title}
                  </td>
                  <td className="p-1 border border-gray-600">
                      {item.product?.price}
                  </td>
                  <td className="p-1 border border-gray-600">
                    <div className="flex flex-row items-center">
                      <input
                        type="number"
                        value={editOrderItemId === item._id ? editOrderItem.quantity : item.quantity}
                        readOnly
                        min="1"
                        className="w-12 sm:w-12 text-center border m-1 sm:mb-0"
                        onChange={(e) => handleOrderItemInputChange(e, "quantity")}
                      />
                     
                      {editOrderItemId !== item._id &&  
                      <button
                        className=" bg-blue-500 mt-1 px-2 py-0 rounded-sm text-lg"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        -
                      </button>
                        }
                    </div>
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editOrderItemId === item._id ? (
                      <input
                        type="number"
                        value={editOrderItem.OneUnit}
                        onChange={(e) => handleOrderItemInputChange(e, "OneUnit")}
                      />
                    ) : (
                      item.OneUnit
                    )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editOrderItemId === item._id ? (
                      <input
                        type="number"
                        value={editOrderItem.product.discountedPrice-editOrderItem.OneUnit}
                        readOnly
                      />
                    ) : (
                      (item.price - item.discountedPrice) < 0 ? 0 : item.price - item.discountedPrice
                       )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editOrderItemId === item._id ? (
                       <div>{editOrderItem.discountedPrice}</div>
                    ) : (
                      item.discountedPrice
                    )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editOrderItemId === item._id ? (
                      <input
                        type="number"
                        value={editOrderItem.GST}
                        onChange={(e) => handleOrderItemInputChange(e, "GST")}
                      />
                    ) : (
                      item.GST
                    )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editOrderItemId === item._id ? (
                      <div>{editOrderItem.finalPrice_with_GST}</div>
                    ) : (
                      item.finalPrice_with_GST
                    )}
                  </td>
                  <td className="p-1 border flex gap-2 justify-center text-sm border-gray-600 text-center">

                      {isviewProductModalOpen && selectedProduct && (
                        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        //   <div className="bg-white p-6 rounded-lg shadow-lg">
                        //     <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
                        //     <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                        //     <button
                        //       className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        //       onClick={closeModal}
                        //     >
                        //       Close
                        //     </button>
                        //   </div>
                        // </div>
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                          <div className="bg-white p-2 rounded-lg shadow-lg w-full max-w-3xl mx-4">
                            <div className="flex justify-between items-start">
                              <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
                              <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={closeModal}
                              >
                                Close
                              </button>
                            </div>
                            <div className="flex flex-col md:flex-row">
                              <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.title}
                                className="w-full md:w-1/2 rounded-lg  md:mb-0 md:mr-4"
                              />
                              <div className="flex flex-col items-start w-full justify-start">
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Description:</strong></div> <div>{selectedProduct.description}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Price:</strong> </div> <div> ${selectedProduct.price}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Discounted Price:</strong> </div> <div>${selectedProduct.discountedPrice}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Discount Percent:</strong></div> <div> {selectedProduct.discountPercent}%</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Weight:</strong></div> <div> {selectedProduct.weight} kg</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Quantity:</strong></div> <div> {selectedProduct.quantity}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Brand:</strong></div> <div> {selectedProduct.brand || 'N/A'}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Category:</strong></div> <div> {selectedProduct.category}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Bar Code:</strong></div> <div> {selectedProduct.BarCode}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Stock Type:</strong></div> <div> {selectedProduct.stockType || 'N/A'}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Unit:</strong></div> <div> {selectedProduct.unit}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Purchase Rate:</strong></div> <div> ${selectedProduct.purchaseRate}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>HSN:</strong></div> <div> {selectedProduct.HSN || 'N/A'}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>GST:</strong></div> <div> {selectedProduct.GST}%</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Retail Price:</strong></div> <div> ${selectedProduct.retailPrice}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Total Amount:</strong></div> <div> ${selectedProduct.totalAmount}</div></div>
                                <div className="text-gray-700 mb-2 w-full justify-between flex "><div><strong>Amount Paid:</strong></div> <div> ${selectedProduct.amountPaid}</div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    {editOrderItemId === item._id ? (
                      <>
                        <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={(e) => handleSaveClick(e,item._id)}>
                          Save
                        </button>
                        <button className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                      <button className="bg-amber-600 text-white px-2 py-2 rounded hover:bg-amber-700" onClick={() => handleViewProduct(item.product)}>
                        View Product
                      </button>
                       <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={(e) => handleEditClick(e,item)}>
                          Edit
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => removeItem(item._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Edit;
