import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../Redux/Product/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FaBarcode } from "react-icons/fa"; // Import the barcode icon from react-icons
import BarcodeReader from "react-barcode-reader";
import ReactToPrint from "react-to-print";
import logo from "../logo.png";
import {jwtDecode }from "jwt-decode";
import {logoutUser } from "../Redux/User/userSlices";
import { toast } from "react-toastify";
import { fetchCart, removeFromCart, clearCart, updateCartQuantity, addToCart } from '../Redux/Cart/cartSlice';
import {createOrder} from '../Redux/Orders/orderSlice';
import Invoice from "../component/invoice.js";
import axiosInstance from "../axiosConfig.js";
import { fetchUsers } from '../Redux/User/userSlices';
import { fetchOrders } from '../Redux/Orders/orderSlice';







const Sale = () => {
  const [details, setDetails] = useState([]);
  const [productDetails,setProductDetails] = useState()
  const dispatch = useDispatch();
  //   let productDetails = useSelector((state) => state.products.productDetails);
  const [invoice,setInvoice] = useState()
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const handlePrintRef = useRef();
  const { orderId } = useParams();
  let { items, status, fetchCartError } = useSelector((state) => state.cart);
  const [currentDate, setCurrentDate] = useState('');
  const [cardPay,setCardPay]=useState("");
  const [borrow,setBorrow]=useState("");
  const [cashPay,setCashPay]=useState("");
  const [upiPay,setUPIPay]=useState("");
  const [totalPrice,setTotalPrice]=useState('');
  const [discount,setDiscount]= useState('');
  const [gst,setGst]= useState('');
  const [total,setFinalTotal]= useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState(false);
  const [print,setPrint] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [searchuser, setSearchuser] = useState([]);
  const users = useSelector((state) => state.user.users);
  const orders = useSelector((state) => state.orders.orders);

  const [searchInput, setSearchInput] = useState('');
  const [matchingOrders, setMatchingOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [matchingMobileNumbers, setMatchingMobileNumbers] = useState([]);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [isviewProductModalOpen, setIsViewProductModalOpen] = useState(true);
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

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewProductModalOpen(true);
  };

  const closeModal = () => {
    setIsViewProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleReverseOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setEditItem({...item});
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log("users are: ",users);
    console.log("orders are: ",orders);
    setSearchuser(users);
  }, [users,orders]);

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  // const handleFinal = (e) => {
  //   const value = e.target.value;
  //   setFinal({
  //     ...finalform,
  //     [e.target.id]: value,
  //   });
  //   if (value) {
  //     const filteredUsers = users.filter((user) =>
  //       user.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setMatchingUsers(filteredUsers);
  //     setShowModal(true);
  //   } else {
  //     setShowModal(false);
  //   }
  // };

  const handlesearchChange = (e) => {
    const value = e.target.value;
    console.log("value is: ",value);
    setFinal({
      ...finalform,
      [e.target.id]: value,
    });
    // setSearchInput(value);
    console.log("searchusers are: ",searchuser);
    if (value) {
      const filteredOrders = orders.filter((order) =>
        order.Name?.toLowerCase().includes(value.toLowerCase())
      );
      console.log("filtered suers are: ", filteredOrders);
      setMatchingOrders(filteredOrders);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const handleMobileSearchChange = (e) => {
    const value = e.target.value;
    console.log("Mobile number is: ", value);
    setFinal({
      ...finalform,
      [e.target.id]: value,
    });
    if (value) {
      const filteredOrders = orders.filter((order) =>
        String(order.mobileNumber).includes(value)
      );
      console.log("Filtered orders by mobile number: ", filteredOrders);
      setMatchingMobileNumbers(filteredOrders);
      setShowMobileModal(true);
    } else {
      setShowMobileModal(false);
    }
  };

  const handleSelectOrder = (order) => {
    console.log("handlie select form mobile number");
    setFinal({
      ...finalform,
      name: order.Name,
      Date: order.Date || currentDate,
      mobileNumber: order.mobileNumber || '',
      ShipTo: order.ShipTo || '',
      address: order.address || 'Shrigonda',
      state: order.state || 'Maharastra',
    });
    setShowModal(false);
    setShowMobileModal(false);

  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;

    setEditItem(prevState => {
      const newState = { ...prevState };
      if (field.includes('.')) {
        const [outerKey, innerKey] = field.split('.');
        newState[outerKey] = { ...newState[outerKey], [innerKey]: value };
      } else {
        newState[field] = value;
      }

      const mrp = parseFloat(newState.product?.price || 0);
      const quantity = parseInt(newState.quantity || 0);
      const discountedPrice = parseFloat(newState.discountedPrice || 0);
      const gst = parseFloat(newState.GST || 0);

      // const totalValue = ((mrp * quantity - discount) * (1 + gst / 100)).toFixed(2);
      const totalValue = (discountedPrice * quantity);
      newState.finalPrice_with_GST = totalValue;
      const {product} = editItem;
      let discount = mrp-discountedPrice;
      if(mrp==0)
      {
       discount=product.discountedPrice-discountedPrice;
      }
   
      // console.log(discount);
      newState.discount = discount;

      return newState;
    });
    console.log("edittem after input change: ",editItem);
  };

  
  // const handleSaveClick = (itemId) => {
  //   // Implement save functionality here
  //   console.log("Save changes for item:", editItem);

  //   setEditId(null);
  // };

  const handleSaveClick = async (itemId) => {
    // Extract necessary fields from editItem
    const { product } = editItem;
    console.log(items);
    const { discountedPrice, quantity, GST, finalPrice_with_GST } = editItem;
    let { title: productTitle, price: productPrice,  } = product;
    const ProductApalaBajarPrice = product.discountedPrice;
    if(productPrice==0)
    {
      productPrice=ProductApalaBajarPrice;
    }
console.log(editItem);
    // Construct the payload for the API request
    const payload = {
      productCode: product.BarCode, 
      discountedPrice: parseFloat(discountedPrice),
      quantity: parseInt(quantity),
      price: parseFloat(productPrice),
      discount: (parseFloat(productPrice) - parseFloat(discountedPrice))*parseFloat(quantity),
      GST: parseFloat(GST),
      finalPrice_with_GST: parseFloat(finalPrice_with_GST)
    };
  
    try {
      const response = await axiosInstance.put('cart/adjustment', payload);
  
      // if (!response.ok) {
      //   throw new Error('Network response was not ok' + response.statusText);
      // }
      const resData = response.data;
      console.log("Save changes for item:", resData);
  
      setEditId(null);
      setEditItem({});
      dispatch(fetchCart());
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
  // const handleInputChange = (e, field) => {
  //   const { value } = e.target;

  //   setEditItem(prevState => {
  //     const newState = { ...prevState };
  //     if (field.includes('.')) {
  //       const [outerKey, innerKey] = field.split('.');
  //       newState[outerKey] = { ...newState[outerKey], [innerKey]: value };
  //     } else {
  //       newState[field] = value;
  //     }

  //     const mrp = parseFloat(newState.product?.price || 0);
  //     const quantity = parseInt(newState.quantity || 0);
  //     const discountedPrice = parseFloat(newState.discountedPrice || 0);
  //     const gst = parseFloat(newState.GST || 0);

  //     // const totalValue = ((mrp * quantity - discount) * (1 + gst / 100)).toFixed(2);
  //     const totalValue = (discountedPrice * quantity);
  //     newState.finalPrice_with_GST = totalValue;
  //     const discount = mrp-discountedPrice;
  //     newState.discount = discount;

  //     return newState;
  //   });
  //   console.log("edittem after input change: ",editItem);
  // };

  
  // // const handleSaveClick = (itemId) => {
  // //   // Implement save functionality here
  // //   console.log("Save changes for item:", editItem);

  // //   setEditId(null);
  // // };

  // const handleSaveClick = async (itemId) => {
  //   // Extract necessary fields from editItem
  //   const { product } = editItem;
  //   const { discountedPrice, quantity, GST, finalPrice_with_GST } = editItem;
  //   const { title: productTitle, price: productPrice  } = product;
  
  //   // Construct the payload for the API request
  //   const payload = {
  //     productCode: product.BarCode, 
  //     discountedPrice: parseFloat(discountedPrice),
  //     quantity: parseInt(quantity),
  //     price: parseFloat(productPrice),
  //     discount: parseFloat(productPrice)*parseFloat(quantity) - parseFloat(discountedPrice),
  //     GST: parseFloat(GST),
  //     finalPrice_with_GST: parseFloat(finalPrice_with_GST)
  //   };
  
  //   try {
  //     const response = await axiosInstance.put('cart/adjustment', payload);
  
  //     // if (!response.ok) {
  //     //   throw new Error('Network response was not ok' + response.statusText);
  //     // }
  //     const resData = response.data;
  //     console.log("Save changes for item:", resData);
  
  //     setEditId(null);
  //     setEditItem({});
  //     dispatch(fetchCart());

  //   } catch (error) {
  //     console.error('Error saving changes:', error);
  //   }
  // };
  

  const handleCancelClick = () => {
    setEditId(null);
    setEditItem({});
  };



  useEffect(() => {
    // clearCart()
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
   console.log("This is cart item: ",items )
  }, [items]);

  useEffect(() => {
    console.log(items);
    setDetails(items[0]);
    if(items[0]?.length>0){
      setDiscount(items[1]&&items[1].discount)
      setTotalPrice(items[1]&&items[1].totalPrice)
      setGst(items[1]&&items[1].GST)
      setFinalTotal(items[1]&&items[1].final_price_With_GST)
    }


 
  }, [items]);


  console.log(details);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else {
      // Redirect to login if no token found hhhh
    }
  }, [navigate]);

  useEffect(() => {
    if (print&&invoice && handlePrintRef.current) {
      console.log(handlePrintRef.current)
      handlePrintRef.current.handlePrint();
    }
  }, [invoice]);

  const handleKeys = (e) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }

  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    toast.error("Logout Successfully!");
    navigate("/");
  };
  
  const fetchProducts = async (id) => {
    console.log(id+"hallo")
    try {
      const response = await axiosInstance.get(`/product/view/${id}`); // Adjust the URL to your API endpoint
      // setProducts(response.data);
      console.log(response)
      dispatch(addToCart(id)).then(() => {
        dispatch(fetchCart());})
      setProductDetails({})
    } catch (err) {
      // setError();
console.log(err.message)
    }
  };

  useEffect(() => {
    // Get the current date in the required format (YYYY-MM-DD)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Set the current date as the default value
    setCurrentDate(formattedDate);
  }, []);
  //  console.log(details);

  
  const handleScan = (data) => {
    // console.log(isChecked)
    if (isChecked&&data) {
      dispatch(fetchProduct(data));
    }
  };
 const handleRemoveAllItem=async () =>
 {
  const response = await axiosInstance.delete(`/cart/removeAllItem`); 
  if(response.status==200)
  {dispatch(fetchCart());
  }
  else{
    alert("somthing went wrong")
  }
 }
  const handleError = (err) => {

    // console.log(isChecked)
    // if (isChecked) {

    //   fetchProducts(766576577878')
    // }
    alert("Connnect the Barcode Scanner")
    // dispatch(fetchProduct("5345435334"));
  };


  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };

  // State variables for form fields
  const [formData, setFormData] = useState({
    barcode: "",
    brand: "",
    description: "",
    category: "",
    stockType: "",
    unit: "",
    qty: "",
    saleRate: "",
    profit: "",
    hsn: "",
    gst: "",
    total: "",
  });

  const [finalform,setFinal] = useState({
    type:"Sale",
    name:"",
    Date:currentDate,
    mobileNumber:"",
    ShipTo:"",
    address:"Shrigonda",
    state:"Maharastra",
    GSTNo:"",
  });


  const bill = async()=>{    
    const gen =(cashPay?parseInt(cashPay):0)+(upiPay?parseInt(upiPay):0)+(cardPay?parseInt(cardPay):0)+(borrow?parseInt(borrow):0)
    const amount = Math.round(gen)
   
    const Total = Math.round(total)
    console.log(amount == Total)        
  if(amount == Total){
    if(items[0].length>0&&finalform.name&&finalform.mobileNumber&&finalform.address){
      try {
        const createdOrder=  await dispatch(createOrder({paymentType:{cash:cashPay,card:cardPay,UPI:upiPay,borrow:borrow}, BillUser:finalform })).unwrap()
        console.log(createdOrder);
      
        setInvoice(createdOrder.data)
        items=[]
        setFinal({
          type:"Sale",
          name:"",
          Date:currentDate,
          mobileNumber:"",
          ShipTo:"",
          address:"Shrigonda",
          state:"Maharastra",
          GSTNo:"",
        })
        setFormData({
          barcode: "",
          brand: "",
          description: "",
          category: "",
          stockType: "",
          unit: "",
          qty: "",
          saleRate: "",
          profit: "",
          hsn: "",
          gst: "",
          total: "",
        })
      dispatch(fetchCart())
      setMessage("")
      setCardPay("");
      setCashPay("");
      setUPIPay("");
      setBorrow("");
      setDiscount("")
      setTotalPrice("")
      setGst("")
      setFinalTotal("")
      toast.success("Order created successfully!");
      } catch (err) {
        toast.error(`Failed to create order: ${err.message}`);
    
      }
    }else{
      alert(`fill the client details`);
    }
 
  }else if(amount>Total){
    setMessage(`Return ${amount-Total} rs `)
  }else{
    setMessage(`Need ${Total-amount} rs to place order or add amount in borrow field `)
  }

  }


  const handlePrint = () => {
    setPrint(true)
    bill()
      };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFinal = (e) => {
    setFinal({
      ...finalform,
      [e.target.id]: e.target.value,
    });
  };

  const decreaseQuantity = (id) => {
    const item = items[0].find(item => item._id === id);
    if (item.quantity > 1) {
      dispatch(updateCartQuantity({ productId: id, quantity: item.quantity - 1 })).then(() => {
        dispatch(fetchCart());
      });
    }
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id)).then(() => {
      dispatch(fetchCart());
    });
  };

  const clearCartItems = () => {
    dispatch(clearCart()).then(() => {
      dispatch(fetchCart());
    });
  };

  useEffect(() => {
    if (productDetails) {
      setFormData({
        barcode: productDetails.BarCode || "",
        brand: productDetails.brand || "",
        description: productDetails.title || "",
        category: productDetails.category?.name|| "",
        stockType: productDetails.stockType || "",
        unit: productDetails.unit || "",
        qty: "",
        saleRate: productDetails.discountedPrice || "",
        profit: productDetails.profit || "",
        hsn: productDetails.HSN,
        gst: productDetails.GST || "",
      });
    }
  }, [productDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(productDetails){
      const id = productDetails.BarCode;
      console.log(id);
      dispatch(addToCart(id)).then(() => {
        dispatch(fetchCart());
      });
    }
    setProductDetails({...productDetails,['qty']:" "});

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {

      if (e.target.value.trim()!="") {
      fetchProducts(e.target.value);
      }
    }
  };
  
  const componentRef = useRef();
  return (
    <div className="bg-gray-100 mt-28 mx-6 rounded-lg shadow-lg">
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sale</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Online Orders | Hi, <span className="font-bold">{fullName}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            LogOut
          </button>
          <button
            onClick={() => navigate("/editOrder")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Edit Order
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sale</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              id="name"
              required
              value={finalform.name}
              onKeyDown={handleKeyDown}
              onChange={handlesearchChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showModal && (
              <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                {matchingOrders.map((order) => (
                  <div key={order._id} onClick={() => handleSelectOrder(order)} className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer">
                    {order.Name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Invoice</label>
            <input
              type="date"
              id="Date"
              onKeyDown={handleKeys}
              value={currentDate}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
     
          <div>
            <label className="block text-gray-700 font-medium">Mobile</label>
            <input
              type="text"
              id="mobileNumber"
              required
              onKeyDown={handleKeys}
              maxLength={10}
              minLength={10}
              value={finalform.mobileNumber}
              onChange={handleMobileSearchChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showMobileModal && (
              <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                {matchingMobileNumbers.map((order) => (
                  <div key={order._id} onClick={() => handleSelectOrder(order)} className="p-2 border border-solid hover:bg-gray-200 cursor-pointer">
                    {order.mobileNumber}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ship To</label>
            <input
              type="text"
              id="ShipTo"
              value={finalform.ShipTo}
              onChange={handleFinal}
              onKeyDown={handleKeys}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              id="address"
              value={finalform.address}
              onChange={handleFinal}
              onKeyDown={handleKeys}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <input id="state"
              value={finalform.state}
             onChange={handleFinal} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            </input>
          </div>
        </div>
        </form>


        {/* New Input Fields */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-nowrap bg-gray-200 px-3 pt-3 rounded-md space-x-2 mb-6">
            <div className="mb-2 flex justify-center items-center text-center">
              <button
                type="button"
                onClick={handleReverseOrder}
                className="w-full bg-blue-700 text-white py-2 px-4 rounded font-medium hover:bg-blue-800 transition-colors"
              >
                Reverse
              </button>
            </div>
            <div className=" mb-4 text-center"> 
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
            
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="barcode"
                className="block text-gray-700 text-sm font-medium"
              >
                Barcode
              </label>
              <input
                type="text"
                id="barcode"
                value={formData.barcode}
                onKeyDown={handleKeyPress}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barcode"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="brand"
                className="block text-gray-700 text-sm font-medium"
              >
                Brand
              </label>
              <input
                type="text"
                onKeyDown={handleKeys}
                value={formData.brand}
                onChange={handleChange}
                id="brand"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-medium"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                onKeyDown={handleKeys}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-medium"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="stock-type"
                className="block text-gray-700 text-sm font-medium"
              >
                Stock Type
              </label>
              <input
                type="text"
                id="stockType"
                value={formData.stockType}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock type"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="unit"
                className="block text-gray-700 text-sm font-medium"
              >
                Unit
              </label>
              <input
                type="text"
                id="unit"
                value={formData.unit}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter unit"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="qty"
                className="block text-gray-700 text-sm font-medium"
              >
                Qty
              </label>
              <input
                type="number"
                id="qty"
                value={formData.qty}
                onKeyDown={handleKeys}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="sale-rate"
                className="block text-gray-700 text-sm font-medium"
              >
                Sale Rate
              </label>
              <input
                type="text"
                id="sale-rate"
                value={formData.saleRate}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Sale rate"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="hsn"
                className="block text-gray-700 text-sm font-medium"
              >
                HSN
              </label>
              <input
                type="text"
                id="hsn"
                value={formData.hsn}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter HSN"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="gst"
                className="block text-gray-700 text-sm font-medium"
              >
                GST%
              </label>
              <input
                type="text"
                id="gst"
                value={formData.gst}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GST percentage"
              />
            </div>
     

            <div className="w-full sm:w-1/2 lg:w-1/6 ml-6 my-6">
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded font-medium hover:bg-green-800 transition-colors"
              >
          

                Enter
              </button>
            </div>
          </div>
        </form>
        {/* Table */}
        <div className="overflow-x-auto">
        <div>
            <span class="text-muted-foreground">ITEMS</span>
            <span class="text-primary px-3">{items[1]&&items[1].totalItem}</span>
          </div>
          <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-gray-600">
                <th className="p-3 border border-gray-600 text-left">#</th>
                <th className="p-3 border border-gray-600 text-left">
                  Description
                </th>
                <th className="p-3 border border-gray-600 text-left">MRP</th>
                <th className="p-3 border border-gray-600 text-left w-[60px]">
                  Net Qty
                </th>
                <th className="p-3 border border-gray-600 text-left">Apla Price</th>
                <th className="p-3 border border-gray-600 text-left">Disc.</th>
                <th className="p-3 border border-gray-600 text-left">GST%</th>
                <th className="p-3 border border-gray-600 text-left">
                  Total Value
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            {/* //<tbody> */}
            {/* // Add rows dynamically here */}
            {/* { 
            //  details&&details.map((item,i)=>(
            //     <tr key={item?._id}>
            //     <td className="py-1 px-3 border border-gray-600 text-left whitespace-nowrap">
            //       {i+1}
            //     </td>
            //     <td className="py-1 px-3 border border-gray-600 text-left">
            //     {item?.product?.title}
            //     </td>
            //     <td className="p-1 border border-gray-600"> {item?.product?.price}</td>
            //     <td className="p-1 border border-gray-600">
            //     <div className="flex flex-row items-center">
            //             <input type="number" value={item.quantity} readOnly min="1" className="w-12 sm:w-12 text-center border m-1 sm:mb-0" />
            //             <button className=" bg-blue-500 mt-1 px-2 py-0 rounded-sm text-lg" onClick={() => decreaseQuantity(item._id)}>-</button>
              
            //         </div>
            //     </td>
            //     <td className="p-1 border border-gray-600"> {item?.discountedPrice}</td>
            //     <td className="p-1 border border-gray-600"> {(item?.price-item?.discountedPrice)<0?0:item?.price-item?.discountedPrice}</td>
            //     <td className="p-1 border border-gray-600"> {item?.GST}</td>
            //     <td className="p-1 border border-gray-600"> {item?.finalPrice_with_GST}</td>
            //     <td className="p-1 border flex gap-2 justify-center text-sm border-gray-600 text-center">
            //       <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 ">
            //         Edit
            //       </button>
            //       <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 ">
            //         Save
            //       </button>
            //       <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 " onClick={() => removeItem(item?._id)}>
            //         Delete
            //       </button>
                  
            //     </td>
            //   </tr>


      // console.log(item)
             // ))
              // }

              // Repeat rows as needed
            </tbody>    */}
            <tbody>
              { details && (reverseOrder ? [...details].reverse() : details).map((item, i)  => (
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
                        value={editId === item._id ? editItem.quantity : item.quantity}
                        // readOnly={editId !== item._id}
                        min="1"
                        className="w-12 sm:w-12 text-center border m-1 sm:mb-0"
                        onChange={(e) => handleInputChange(e, "quantity")}
                      />
                     
                      {editId !== item._id &&  
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
                    {editId === item._id ? (
                      <input
                        type="number"
                        value={editItem.discountedPrice}
                        onChange={(e) => handleInputChange(e, "discountedPrice")}
                      />
                    ) : (
                      item.discountedPrice
                    )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editId === item._id ? (
                      <input
                        type="number"
                        value={editItem?.discount}
                        readOnly
                      />
                    ) : (
                      (item.price - item.discountedPrice) < 0 ? 0 : item.price - item.discountedPrice
                       )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editId === item._id ? (
                      <input
                        type="number"
                        value={editItem.GST}
                        onChange={(e) => handleInputChange(e, "GST")}
                      />
                    ) : (
                      item.GST
                    )}
                  </td>
                  <td className="p-1 border border-gray-600">
                    {editId === item._id ? (
                      <div>{editItem.finalPrice_with_GST}</div>
                    ) : (
                      item.finalPrice_with_GST
                    )}
                  </td>
                  <td className="p-1 border flex gap-2 justify-center text-sm border-gray-600 text-center">
                      <button className="bg-amber-600 text-white px-2 py-2 rounded hover:bg-amber-700" onClick={() => handleViewProduct(item.product)}>
                        View Product
                      </button>
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
                          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4">
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
                                className="w-full md:w-1/2 rounded-lg mb-4 md:mb-0 md:mr-4"
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
                    {editId === item._id ? (
                      <>
                        <button className="bg-green-500 text-white px-2 py-2 rounded hover:bg-green-600" onClick={() => handleSaveClick(item._id)}>
                          Save
                        </button>
                        <button className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600" onClick={handleCancelClick}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                      {item.type!='custom' && <button className="bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600" onClick={() => handleEditClick(item)}>
                          Edit
                        </button>}
                        <button className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600" onClick={() => removeItem(item._id)}>
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

        <div class="mt-4 flex justify-between items-center">


          <div class="flex space-x-2">
          <button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md" onClick={handleRemoveAllItem}>
                  <span className='text-center'>
                   Remove all item
                  </span>
                </button>
            <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={bill}>
              Save
            </button>

            {/* <ReactToPrint
              trigger={() => (
                <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">
                 Save & Print
                </button>
              )}
              content={() => componentRef.current}
            /> */}










                <button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={handlePrint}>
                  <span className='text-center'>
                   Save & Print
                  </span>
                </button>







                   </div>

      
          <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
          <div className="text-center"><h3 className=" text-red-500 text-lg font-semibold">{message}</h3></div>
            <h2 className="text-lg font-semibold mb-4">Expense</h2>
            <table className="w-full border-collapse">
              <tbody>
     
              <tr>
                  <td className="border p-3">SUBTOTAL:</td>
                  <td className="border p-3"> {totalPrice}
            </td>
                </tr>
                <tr>
                  <td className="border p-3">DISCOUNT:</td>
                  <td className="border p-3">{discount}</td>
                </tr>
                <tr>
                  <td className="border p-3">TAXES:</td>
                  <td className="border p-3">{gst}</td>
                </tr>
        
                <tr>
                  <td className="border p-3">INVOICE TOTAL :</td>
                  <td className="border p-3">{total}</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CASH:</td>
                  <td className="border p-3">  
                    <input
                type="text"
                id="cash"
                value={cashPay}
                onChange={(e)=>setCashPay(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payed cash"
              /></td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CARD:</td>
                  <td className="border p-3"><input
                type="text"
                id="card"
                value={cardPay}
                onChange={(e)=>setCardPay(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payed cash or enter 0"
              /></td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN UPI:</td>
                  <td className="border p-3"><input
                type="text"
                id="upi"
                value={upiPay}
                onChange={(e)=>setUPIPay(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payed cash or enter 0"
              /></td>
                </tr>
                <tr>
                  <td className="border p-3">BORROW:</td>
                  <td className="border p-3"><input
                type="text"
                id="borrow"
                value={borrow}
                onChange={(e)=>setBorrow(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payed cash or enter 0"
              /></td>
                </tr>
               
              </tbody>
            </table>
          </div>
      

        </div>

      {/* ---------------------invoice ganrator------------------------- */}
      <Invoice 
        componentRef={componentRef} 
        details={invoice} 
        setPrint={setPrint}

      />
 
 <ReactToPrint
        trigger={() => <button style={{ display: 'none' }} />}
        content={() => componentRef.current}
        ref={(el) => (handlePrintRef.current = el)}
      />
     
      </div>

      </div>
  );
};

export default Sale;

    