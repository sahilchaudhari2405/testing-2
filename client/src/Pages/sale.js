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
const Sale = () => {
  const [details, setDetails] = useState([]);
  const [productDetails,setProductDetails] = useState()
  const dispatch = useDispatch();
  // let productDetails = useSelector((state) => state.products.productDetails);
const [invoice,setInvoice] = useState()
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const { items, status, fetchCartError } = useSelector((state) => state.cart);
  const [currentDate, setCurrentDate] = useState('');
  const [cardPay,setCardPay]=useState('');
  const [cashPay,setCashPay]=useState('');
  const [upiPay,setUPIPay]=useState('');
  const [totalPrice,setTotalPrice]=useState('');
  const [discount,setDiscount]= useState('');
  const [gst,setGst]= useState('');
  const [total,setFinalTotal]= useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    setDetails(items[0]);
setDiscount(items[1]&&items[1].discount)
setTotalPrice(items[1]&&items[1].totalPrice)
setGst(items[1]&&items[1].GST)
setFinalTotal(items[1]&&items[1].final_price_With_GST)

    //console.log(details);
    console.log(items[1]);
  }, [items]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else {
      // Redirect to login if no token found
    }
  }, [navigate]);

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
      setProductDetails(response.data.data)
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
    if (data) {
      // dispatch(fetchProduct(data));
      fetchProducts(data);
    }
  };

  const handleError = (err) => {
    fetchProducts('123456')
    // dispatch(fetchProduct("5345435334"));
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
    address:"",
    state:"Maharastra",
    GSTNo:"",
  });


  const bill =async ()=>{
//  console.log(Type);
try {
  const createdOrder=  await dispatch(createOrder({paymentType:{cash:cashPay,card:cardPay,UPI:upiPay}, BillUser:finalform })).unwrap()
  console.log(createdOrder);

  setInvoice(createdOrder.data)

  setFinal({
    type:"Sale",
    name:"",
    Date:currentDate,
    mobileNumber:"",
    ShipTo:"",
    address:"",
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
  alert('Order created successfully!');
} catch (err) {
  alert(`Failed to create order: ${err.message}`);
}
  }

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
        qty: 1,
        saleRate: productDetails.discountedPrice || "",
        profit: productDetails.profit || "",
        hsn: productDetails.HSN || "0",
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
              onKeyDown={handleKeys}
              onChange={handleFinal}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              onChange={handleFinal}
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
                required
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
                    <BarcodeReader onError={handleError} onScan={handleScan} />

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
                <th className="p-3 border border-gray-600 text-left">Rate</th>
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
            <tbody>
              {/* Add rows dynamically here */}
            { 
             details&&details.map((item,i)=>(
         <tr key={item._id}>
         <td className="py-3 px-6 border border-gray-600 text-left whitespace-nowrap">
           {i+1}
         </td>
         <td className="py-3 px-6 border border-gray-600 text-left">
         {item.product.title}
         </td>
         <td className="p-3 border border-gray-600"> {item.product.price}</td>
         <td className="p-3 border border-gray-600">
         <div className="flex flex-row items-center">
                 <input type="number" value={item.quantity} readOnly min="1" className="w-12 sm:w-12 text-center border m-1 sm:mb-0" />
                 <button className=" bg-blue-500 mt-1 px-2 py-0 rounded-sm text-lg" onClick={() => decreaseQuantity(item._id)}>-</button>
       
            </div>
         </td>
         <td className="p-3 border border-gray-600"> {item.discountedPrice}</td>
         <td className="p-3 border border-gray-600"> {item.price-item.discountedPrice}</td>
         <td className="p-3 border border-gray-600"> {item.GST}</td>
         <td className="p-3 border border-gray-600"> {item.finalPrice_with_GST}</td>
         <td className="p-3 border border-gray-600 text-center">
           <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 " onClick={() => removeItem(item._id)}>
             Delete
           </button>
         </td>
       </tr>


      // console.log(item)
             ))
              }

              {/* Repeat rows as needed */}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">

          <div class="flex space-x-2">
            <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={bill}>
              Save
            </button>

            <ReactToPrint
              trigger={() => (
                <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">
                  Print
                </button>
              )}
              content={() => componentRef.current}
            />
            {/* <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Hold</button> */}
            {/* <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
              View
            </button> */}
      
            {/* <button class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Hold(1)</button> */}
          </div>

      
          <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
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
                required
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
                required
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
                required
                onChange={(e)=>setUPIPay(e.target.value)}
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
      />
 
     
      </div>

      </div>
  );
};

export default Sale;

    