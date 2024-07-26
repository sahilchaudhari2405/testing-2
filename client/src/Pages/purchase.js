import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBarcode } from "react-icons/fa"; // Import the barcode icon from react-icons
import ReactToPrint from "react-to-print";
import { jwtDecode } from "jwt-decode";
import logo from "../logo.png";
import { logoutUser } from "../Redux/User/userSlices";
import { toast } from "react-toastify";
import { fetchProduct } from "../Redux/Product/productSlice";
import axiosInstance from "../axiosConfig.js";
import {
  fetchCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
  addToCart,
} from "../Redux/Cart/cartSlice";
import { createOrder } from "../Redux/Orders/orderSlice";
import Invoice from "../component/invoice.js";
import BarcodeReader from "react-barcode-reader";




const Purchase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const productDetails = useSelector((state) => state.products.productDetails);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [GST, setGST] = useState();
  const [discount, setDiscount] = useState();
  const { items, status, fetchCartError } = useSelector((state) => state.cart);
  const [currentDate, setCurrentDate] = useState("");
  const [cart, setCart] = useState([]);
  const [invoice, setInvoicePrice]=useState();
  const [totalGst,setTotalGst]=useState();
  const [paid,setPaid]=useState();
   const [cardPay,setCardPay]=useState('');
  const [cashPay,setCashPay]=useState('');
  const [upiPay,setUPIPay]=useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else {
      // Redirect to login if no token found
    }
  }, [navigate]);

  
  useEffect(() => {
    // Get the current date in the required format (YYYY-MM-DD)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Set the current date as the default value
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
// setDetails(items[0]);
if(cart.length>0){
  const totalAmount = cart.reduce((acc,e)=>acc+(e.purchaseRate*e.qty),0)
    console.log(totalAmount)
    
    const totalGST = cart.reduce((acc,e)=> acc+(e.gst*e.qty),0
    )
    console.log(totalGST)
    const paid = cart.reduce((acc,e)=>acc+parseInt(e.amountpaid),0)
    console.log(paid)
    setInvoicePrice(totalAmount)
    setTotalGst(totalGST)
    setPaid(paid)
    
    // console.log(details);
    // console.log(cart);
}

  }, [cart]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    toast.error("Logout Successfully!");
    navigate("/");
  };

  const sharedClasses = {
    flex: "flex",
    justifyBetween: "justify-between",
    itemsCenter: "items-center",
    mb4: "mb-4",
    border: "border text-center",
    p2: "p-2",
    fontBold: "font-bold",
  };




  // ============================functions for scanning product===============================
  const handleScan = (data) => {
    if (data) {
      dispatch(fetchProduct(data));
    }
  };

  const handleError = (err) => {
    dispatch(fetchProduct("2345632900700"));
  };
  const [formData, setFormData] = useState({
    barcode: "",
    brand: "",
    description: "",
    category: "",
    stockType: "",
    unit: "",
    qty: "",
    saleRate: "",
    purchaseRate: "",
    profit: "",
    hsn: "",
    gst: "",
    total: "",
    amountpaid: "",
  });
  useEffect(() => {
    if (productDetails) {
      setFormData({
        barcode: productDetails.BarCode || "",
        brand: productDetails.brand || "",
        description: productDetails.title || "",
        category: productDetails.category.name || "",
        stockType: productDetails.stockType || "",
        unit: productDetails.unit || "",
        qty: 1,
        saleRate: productDetails.discountedPrice || "",
        purchaseRate:productDetails.purchaseRate || "",
        profit:(productDetails.discountedPrice-productDetails.purchaseRate)|| "",
        hsn: productDetails.HSN || "0",
        gst: productDetails.GST || "0",
        amountpaid: "",
      });
    }
  }, [productDetails]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // decreaseQuantity(e)
  };

  // ============================functions for adding product in cart===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData) {
        setCart([...cart, formData]);
       
  
    }
  };
  const handleKeyPress = (e) => {
    // console.log(e);
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };


  const handleDelete = (id) => {
    console.log(id)
    const updatedProducts = cart.filter(product => product.barcode != id);
    console.log(updatedProducts)
    setCart(updatedProducts);
  };
  // =====================creating order===========================
  const [finalform,setFinal] = useState({
    type:"Purchase",
    name:"",
    date:currentDate,
    mobileNumber:"",
    ShipTo:"",
    address:"",
    ref:"",
    state:"Maharastra",
    GSTNo:""
  });


  const handleFinal = (e) => {
    setFinal({
      ...finalform,
      [e.target.id]: e.target.value,
    });
  };
  const bill =()=>{
    //  console.log(Type);
    const BillData={
      "products":cart,
      "orderDetails": finalform,
      "billImageURL": "",
      "GST":totalGst,
      "TotalAmount":invoice,
      "AmountPaid":paid,
      "orderStatus": "first time",
      "date":currentDate
      }
    
    console.log(BillData)
    // try {
    //   const createdOrder=  await dispatch(createOrder({paymentType:{cash:cashPay,card:cardPay,UPI:upiPay}, BillUser:finalform })).unwrap()
    //   console.log(createdOrder);
    
    //   setInvoice(createdOrder.data)
    //   setFinal({
    //     type:"Sale",
    //     name:"",
    //     Date:currentDate,
    //     mobileNumber:"",
    //     ShipTo:"",
    //     address:"",
    //     state:"Maharastra",
    //     GSTNo:"",
    //   })
    //   setFormData({
    //     barcode: "",
    //     brand: "",
    //     description: "",
    //     category: "",
    //     stockType: "",
    //     unit: "",
    //     qty: "",
    //     saleRate: "",
    //     profit: "",
    //     hsn: "",
    //     gst: "",
    //     total: "",
    //   })
    // dispatch(fetchCart())
    //   setCardPay('');
    //   setCashPay('');
    //   setUPIPay('')
    //   setFinalTotal('');
    //   setTotalPrice('');
    //   setDiscount('');
    //   setGst('');
    //   alert('Order created successfully!');
    // } catch (err) {
    //   alert(`Failed to create order: ${err.message}`);
    // }
      }

      //======================barcode genration====================================

const genrateBarcode = async() =>{
  try {
    const response = await axiosInstance.get('/order/getAllOrderByCounter');
    console.log(response.data)
    setFormData({
      ...formData,
      ['barcode']: response.data.data,
    });
   // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to genrate barcode');
  }
}





  const componentRef = useRef();
  return (
    <div className="bg-gray-100 mt-28 mx-6 rounded-lg shadow-lg">
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase</h1>
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
        </div>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Purchase</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Invoice</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ref.</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Mobile</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">GST No.</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ship To</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Maharashtra (27)</option>
            </select>
          </div>
        </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Purchase</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              id="name"
              required
              value={finalform.name}
              onChange={handleFinal}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Invoice</label>
            <input
              type="date"
              id="Date"
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
              maxLength={10}
              minLength={10}
              value={finalform.mobileNumber}
              onChange={handleFinal}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Ref.</label>
            <input
              type="text"
              id="ref"
              value={finalform.ref}
              onChange={handleFinal}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">GST No.</label>
            <input
              type="text"
              id="GSTNo"
              value={finalform.GSTNo}
              onChange={handleFinal}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Vendor</label>
            <input
              type="text"
              id="ShipTo"
              value={finalform.ShipTo}
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


        {/* New Input Fields */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={genrateBarcode}>Generate Barcode</button>
    
        <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
      
          <div className="flex flex-nowrap bg-gray-200 px-3 pt-3 rounded-md space-x-2 mb-6">
       
            <div className=" m-4">
              <FaBarcode className="h-12" />
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
                required
                value={formData.barcode}
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
                required
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
              required
                value={formData.category.toUpperCase()}
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
                min={1}
                required
                value={formData.qty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="purchaseRate"
                className="block text-gray-700 text-sm font-medium"
              >
                Purchase Rate
              </label>
              <input
                type="text"
                id="purchaseRate"
                value={formData.purchaseRate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter purchase rate"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="SaleRate"
                className="block text-gray-700 text-sm font-medium"
              >
                Sale Rate
              </label>
              <input
                type="text"
                id="saleRate"
                value={formData.saleRate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter purchase rate"
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
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GST percentage"
              />
            </div>
            {/* <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="total"
                className="block text-gray-700 text-sm font-medium"
              >
                Total
              </label>
              <input
                type="text"
                id="total"
                value={formData.total}
                required
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total amount"
              />
            </div> */}
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="amount-paid"
                className="block text-gray-700 text-sm font-medium"
              >
                Amount Paid
              </label>
              <input
                type="text"
                id="amountpaid"
                required
                value={formData.amountpaid}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount paid"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="profit"
                className="block text-gray-700 text-sm font-medium"
              >
                Profit%
              </label>
              <input
                type="text"
                id="profit"
                value={formData.profit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter profit percentage"
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
        <div className="overflow-y-scroll">
          <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-gray-600">
                <th className="p-3 border border-gray-600 text-left">List</th>
                <th className="p-3 border border-gray-600 text-left">
                  Barcode
                </th>
                <th className="p-3 border border-gray-600 text-left">Brand</th>
                <th className="p-3 border border-gray-600 text-left">
                  Description
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Category
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Stock Type
                </th>
                <th className="p-3 border border-gray-600 text-left">Unit</th>
                <th className="p-3 border border-gray-600 text-left">Qty</th>
                <th className="p-3 border border-gray-600 text-left">
                  Sale Rate
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Purchase Rate
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Profit%
                </th>
                <th className="p-3 border border-gray-600 text-left">HSN</th>
                <th className="p-3 border border-gray-600 text-left">GST%</th>
                <th className="p-3 border border-gray-600 text-left">
                  Amount Paid
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows dynamically here */}

              {cart.length > 0 ?
                cart.map((item, i) => (
                  <tr key={item.barcode}>
                    <td className="p-3 border border-gray-600">{i + 1}</td>
                    <td className="p-3 border border-gray-600">
                      {item.barcode}
                    </td>
                    <td className="p-3 border border-gray-600">{item.brand}</td>
                    <td className="p-3 border border-gray-600">{item.description}</td>
                    <td className="p-3 border border-gray-600">
                      {item.category}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.stockType}
                    </td>
                    <td className="p-3 border border-gray-600">{item.unit}</td>
                    <td className="p-3 border border-gray-600">
                      {item.qty}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.saleRate}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.purchaseRate}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.profit}
                    </td>
                    <td className="p-3 border border-gray-600">{item.hsn}</td>
                    <td className="p-3 border border-gray-600">{item.gst}%</td>
                    <td className="p-3 border border-gray-600">
                      {item.amountpaid}
                    </td>
                    <td className="p-3 border border-gray-600 text-center">
                      <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 " onClick={() => handleDelete(item.barcode)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )): <tr>
                <td colSpan="15" className="p-3 border border-gray-600 text-center">
                  No items in the cart
                </td>
              </tr>}

              {/* Repeat rows as needed */}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div>
            <span class="text-muted-foreground">TOTAL</span>
            <span class="text-primary px-3">{cart.length}</span>
          </div>
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
            <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">
              PDF
            </button>
          </div>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Expense</h2>
            <table className="w-full border-collapse">
              <tbody>
     
              <tr>
                  <td className="border p-3">SUBTOTAL:</td>
                  <td className="border p-3"> {invoice}
            </td>
                </tr>
                <tr>
                  <td className="border p-3">AMOUNTPAID:</td>
                  <td className="border p-3">{paid}</td>
                </tr>
                <tr>
                  <td className="border p-3">TAXES:</td>
                  <td className="border p-3">{totalGst}</td>
                </tr>
        
                <tr>
                  <td className="border p-3">INVOICE TOTAL :</td>
                  <td className="border p-3">{invoice&&totalGst&&invoice+totalGst}</td>
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
                 value={cardPay}
                onChange={(e)=>setCardPay(e.target.value)}
                required
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

      {/* <div style={{ display: "none" }}>
          <Invoice ref={componentRef} cart={cart} total={total} GST={GST} discount={discount} />
        </div> */}
    
      {/* <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">
        <div
          ref={componentRef}
          className="max-w-4xl mx-auto p-4 bg-white text-black"
        >
          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}
          >
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
          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
          >
            <div>
              <span className={sharedClasses.fontBold}>INVOICE #: </span>
              <span>985934857944</span>
            </div>
            <div>
              <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
              <span>18/07/2024</span>
            </div>
          </div>
          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}
          >
            <div className="w-1/2 pr-2">
              <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
              <p>Shivam Bole</p>
              <p>Pune,Maharashtra</p>
              <p>Pune,Maharashtra,444003</p>
              <p>9637837434</p>
              <p>shivam@gmail.com</p>
            </div>
            <div className="w-1/2 pr-2">
              <h2 className={sharedClasses.fontBold}>SHIP TO:</h2>
              <p>AAPLA BAJAR</p>
              <p>AHMADNAGAR,Maharashtra</p>
              <p>Pune,Maharashtra,444003</p>
              <p>9637837434</p>
              <p>shivam@gmail.com</p>
            </div>
          </div>
          <table className="w-full border-collapse border mb-4">
            <thead>
              <tr className="bg-black text-white">
                <th className={sharedClasses.border + " " + sharedClasses.p2}>
                  DESCRIPTION
                </th>
                <th className={sharedClasses.border + " " + sharedClasses.p2}>
                  QUANTITY
                </th>
                <th className={sharedClasses.border + " " + sharedClasses.p2}>
                  GST
                </th>
                <th className={sharedClasses.border + " " + sharedClasses.p2}>
                  DISCOUNT
                </th>
                <th className={sharedClasses.border + " " + sharedClasses.p2}>
                  UNIT PRICE
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, index) => (
                <tr key={index}>
                  <td className={sharedClasses.border + " " + sharedClasses.p2}>
                    {e.description}
                  </td>
                  <td
                    className={
                      sharedClasses.border + " " + sharedClasses.p2 + " h-12"
                    }
                  >
                    {e.quantity}
                  </td>
                  <td className={sharedClasses.border + " " + sharedClasses.p2}>
                    {e.gst}%
                  </td>
                  <td className={sharedClasses.border + " " + sharedClasses.p2}>
                    {e.discount}rs
                  </td>

                  <td className={sharedClasses.border + " " + sharedClasses.p2}>
                    {e.price}rs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}
          >
            <div className="w-1/4">
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>SUBTOTAL</span>
                <span>{total}rs</span>
              </div>
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>DISCOUNT</span>
                <span>{discount}rs</span>
              </div>
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>GST</span>
                <span>{GST}rs</span>
              </div>
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}
              >
                <span>TOTAL</span>
                <span>{total - discount + GST}rs</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
            <div
              className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}
            ></div>
          </div>
          <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
        </div>
      </div> */}
    </div>
  );
};

export default Purchase;
