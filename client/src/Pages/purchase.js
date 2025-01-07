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
import { createPurchaseOrder } from "../Redux/Orders/orderSlice";
import Invoice from "../component/invoice.js";
import BarcodeReader from "react-barcode-reader";

const Purchase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  let productDetails = useSelector((state) => state.products.productDetails);
  const purchaseOrders = useSelector((state) => state.orders.purchaseOrders);
  const [currentDate, setCurrentDate] = useState("");
  const [cart, setCart] = useState([]);
  const [invoice, setInvoicePrice] = useState();
  const [totalGst, setTotalGst] = useState();
  const [paid, setPaid] = useState();
  const [invoiceData, setInvoice] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const handlePrintRef = useRef();
  const [language,SetLanguage] = useState("");
  const [message, setMessage] = useState(false);
  const [print,setPrint] = useState(false);

  const [Inputnameforsearch, setInputnameforsearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [matchingOrders, setMatchingOrders] = useState([]);
 const [Address, setFinalAddress] = useState("");
  const [Inputdescriptionforsearch, setInputdescriptionforsearch] = useState('');
  const [showModaldescription, setShowModaldescription] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState([]);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/users/setting");

        const fetchedData = response.data.data;
        if (fetchedData) {
          localStorage.setItem("invoiceSettings", JSON.stringify(fetchedData));
          setFinalAddress(fetchedData.language?.english?.address || "");
          finalform.address = fetchedData.language?.english?.address || ""; // Ensure this logic aligns with your app's state management
        } else {
          console.error("No settings data found");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
  
    const data = localStorage.getItem("invoiceSettings");
    if (data) {
      try {
        const parsedData = JSON.parse(data);

        setFinalAddress(parsedData.language?.english?.address || "");
        finalform.address = parsedData.language?.english?.address || ""; // Ensure this matches your usage pattern
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.warn("No data found in localStorage, fetching from API...");
      fetchSettings();
    }
  }, [Address]); 
  
  const handleTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handlenewLogout();  
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  };

  const handlenewLogout = () => {
    localStorage.removeItem('token');
    axiosInstance.post('users/auth/logout').catch((err) => console.error(err));
    // window.location.href = '/login';
    navigate('/login');
  };

  React.useEffect(() => {
    handleTokenExpiration(); 
  }, []);


  // ============================functions to search name and description===============================

  const handleSelectOrder = (Client) => {
    setFinal({
      ...finalform,
      name: Client.Name,
      date: Client.Date || currentDate,
      mobileNumber: Client.Mobile || '',
      ShipTo: Client.ShipTo || '',
      address: Client.Address || 'Shrigonda',
      state: Client.State || 'Maharastra',
    });
    setShowModal(false);
    // setShowMobileModal(false);

  };

  useEffect(() => {
    setMatchingOrders([]);
    searchOfflineOrders();
  },[Inputnameforsearch])

  const searchOfflineOrders = async () => {
    try {
      // Update the final form with the input name for search
      setFinal({
        ...finalform,
        name: Inputnameforsearch,
      });
  
  
      if (Inputnameforsearch) {
        // Send the request to search for offline orders
        const response = await axiosInstance.post(
          "users/admin/SearchClientDistributer",
          { alphabet: Inputnameforsearch }
        );
  
        // Extract and validate the response data
        const distinctOrders = response.data.data || [];
        // Check if there are any matching orders
        if (distinctOrders.length === 0) {
          setMatchingOrders([]);
        } else {
          setMatchingOrders(distinctOrders);
        }
  
        // Show the modal if results are found
        setShowModal(true);
      } else {
        // Hide the modal if input is empty
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error occurred while searching offline orders:", error);
    }
  };
  

  const handleSelectProduct =(product) => {


    setFormData({
      barcode: product.BarCode,
      brand: product.brand || "",
      description: product.description || "",
      category: product.category.name || "",
      stockType: product.stockType || "",
      unit: product.unit || "",
      qty:1,
      MRP:product.MRP || "",
      saleRate:product.discountedPrice,
      purchaseRate:product.purchaseRate,
      hsn: product.HSN,
      gst: product.GST,
      total: product.totalAmount,
    });
    // setProductDetails(product);
    setShowModaldescription(false);
    // setShowMobileModal(false);

  }

  useEffect(() => {
    setMatchingProducts([]);
    handleSearchandChange();
  },[Inputdescriptionforsearch])

  const handleSearchandChange = async () => {
    try {
      // Update the form data with the input description
      setFormData({
        ...formData,
        description: Inputdescriptionforsearch,
      });
  
  
      if (Inputdescriptionforsearch) {
        // Send a POST request to fetch filtered orders
        const response = await axiosInstance.post(
          "products/product/sortProductsfordescription",
          { description: Inputdescriptionforsearch }
        );
  
        // Extract and validate the response data
        const filteredOrders = response.data.data || [];  
        // Update the state with matching products
        setMatchingProducts(filteredOrders);
  
        // Show the modal if there are matching products
        setShowModaldescription(filteredOrders.length > 0);
      } else {
        // Hide the modal if input is empty
        setShowModaldescription(false);
      }
    } catch (error) {
      console.error("Error while searching products by description:", error);
    }
  };
  


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
    if (cart.length > 0) {
      const totalAmount = cart.reduce(
        (acc, e) => acc + e.purchaseRate * e.qty,
        0
      );
      const totalGST = cart.reduce((acc, e) => acc + e.gst * e.qty, 0);

      setInvoicePrice(totalAmount);
      setTotalGst(totalGST);
      setPaid(paid);

      setFinal((prevState) => ({
        ...prevState,
        TotalAmount: totalAmount,
        AmountPaid: paid,
        totalGst: totalGST,
        date: currentDate,
      }));
    }
  }, [cart]);


  
  useEffect(() => {
    if (print&&purchaseOrders && handlePrintRef.current) {
      handlePrintRef.current.handlePrint();
    }
  }, [purchaseOrders]);

  const handleKeys = (e) => {
    if (e.key === "Enter") {
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

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
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
    if (isChecked && data) {
      dispatch(fetchProduct(data)).then(()=>{
        if (formData.barcode&&formData.description&&formData.purchaseRate) {
          setCart([...cart, formData]);
        }
      });
    }
  };

  const handleError = (err) => {
    alert("Connnect the Barcode Scanner")
    // if (isChecked) {
    //   dispatch(fetchProduct("766576577878")).then(()=>{
    //     if (formData.barcode&&formData.description&&formData.purchaseRate) {
    //       setCart([...cart, formData]);
    //     }
    //   });
    // }

  };

  const [formData, setFormData] = useState({
    barcode: "",
    brand: "",
    description: "",
    category: "GENERAL",
    stockType: "",
    unit: "",
    qty: "",
    saleRate: "",
    purchaseRate: "",
    MRP: "",
    profit: "",
    hsn: "",
    gst: "",
    total: "",
    amountpaid: "",
    image: null,
  });

  useEffect(() => {
    if (productDetails) {
      setFormData({
        barcode: productDetails.BarCode || "",
        brand: productDetails.brand || "",
        description: productDetails.title || "",
        category: productDetails?.category?.name || "GENERAL",
        stockType: productDetails.stockType || "",
        unit: productDetails.unit || "",
        qty: 1,
        saleRate: productDetails.discountedPrice || "",
        purchaseRate: productDetails.purchaseRate || "",
        MRP:productDetails.MRP,
        profit:
        (productDetails.purchaseRate >0)?  productDetails.discountedPrice - productDetails.purchaseRate: 0,
        hsn: productDetails.HSN || "",
        gst: productDetails.GST || "",
        amountpaid: "",
        image: null,
      });
    }
  }, [productDetails]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ============================functions for adding product in cart===============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    productDetails = { qty: "" };
    if (formData) {
      setCart([...cart, formData]);
    }
    productDetails = { qty: "" };

    setFormData({
      barcode: productDetails.BarCode || "",
      brand: productDetails.brand || "",
      description: productDetails.title || "",
      category: productDetails.category?.name || "GENERAL",
      stockType: productDetails.stockType || "",
      unit: productDetails.unit || "",
      qty: productDetails.BarCode ? 1 : "",
      saleRate: productDetails.discountedPrice || "",
      MRP:productDetails.MRP || "",
      purchaseRate: productDetails.purchaseRate || "",
      profit:(productDetails.purchaseRate >0)?  productDetails.discountedPrice - productDetails.purchaseRate: 0,
      hsn: productDetails.HSN || "",
      gst: productDetails.GST || "",
      amountpaid: "",
      image: null,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.value) {
        dispatch(fetchProduct(e.target.value));
      }
    }
  };

  const handleDelete = (id) => {
    const updatedProducts = cart.filter((product) => product.barcode !== id);
    setCart(updatedProducts);
  };

  // =====================creating order===========================
  const [finalform, setFinal] = useState({
    type: "Purchase",
    name: "",
    date: "",
    mobileNumber: "",
    ShipTo: "",
    address:"Shrigonda",
    ref: "",
    state: "Maharastra",
    GSTNo: "",
    totalGst: "",
    TotalAmount: "",
    AmountPaid: "",
    orderStatus: "first time",
    paymentType: {
      cash: "",
      card: "",
      upi: "",
      borrow: "",
    },
  });

  const handleFinal = (e) => {
    setFinal({
      ...finalform,
      [e.target.id]: e.target.value,
    });
  };

  const handlePaymentTypeChange = (e) => {
    const { id, value } = e.target;
    setFinal((prevState) => ({
      ...prevState,
      paymentType: {
        ...prevState.paymentType,
        [id]: value,
      },
    }));
  };

  const bill = async () => {
    const gen =
      (finalform?.paymentType?.cash ? parseInt(finalform?.paymentType?.cash) : 0) +
      (finalform?.paymentType?.upi ? parseInt(finalform?.paymentType?.upi) : 0) +
      (finalform?.paymentType?.card ? parseInt(finalform?.paymentType?.card) : 0) +
      (finalform?.paymentType?.borrow? parseInt(finalform?.paymentType?.borrow) : 0);

    const amount = Math.round(gen)
 const all= invoice+totalGst
 const total = Math.round(all)



    if (amount == total) {
      if (
        cart.length > 0 &&
        finalform.name &&
        finalform.mobileNumber &&
        finalform.address
      ) {
        try {
          dispatch(
            createPurchaseOrder({ products: cart, orderDetails: finalform })
          ).unwrap();
          setFinal({
            type: "Purchase",
            name: "",
            date: "",
            mobileNumber: "",
            ShipTo: "",
            address:"Shrigonda",
            ref: "",
            state: "Maharastra",
            GSTNo: "",
            totalGst: "",
            TotalAmount: "",
            AmountPaid: "",
            orderStatus: "first time",
            paymentType: {
              cash: "",
              card: "",
              upi: "",
              borrow: "",
            },
          });
          setFormData({
            barcode: "",
            brand: "",
            description: "",
            category: "",
            stockType: "",
            unit: "",
            qty: "",
            saleRate: "",
            purchaseRate: "",
            MRP: "",
            profit: "",
            hsn: "",
            gst: "",
            amountpaid: "",
            image: null,
          });

          setInvoicePrice("");
          setTotalGst("");
          setPaid("");

          setCart([]);
          setMessage("")
          toast.success("Order created successfully!");
        } catch (err) {
          console.log(err);
          toast.error("Failed to create order: ", err.message);
        }
      } else {
        alert(`fill the client details`);
      }
    } else if (amount > total) {
      setMessage(`Return ${amount - total} rs `);
    } else {
      setMessage(
        `Need ${
          total - amount
        } rs to place order or add amount in borrow field `
      );
    }
  };


  const handlePrint = () => {
    setPrint(true)
    SetLanguage("English")
    bill()
      };

      const handleMarathiPrint = () => {
        setPrint(true)
        SetLanguage("Marathi")
        bill()
          };
  //======================barcode genration====================================

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
        <form>
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
                autocomplete="off"
                require
                value={finalform.name}
                onKeyDown={handleKeys}
                // onChange={handleFinal}
                onChange={(e) => {
                  setFinal({
                  ...finalform,
                  [e.target.id]: e.target.value,
                });
                setInputnameforsearch(e.target.value)
                }}
                onBlur={() => setTimeout(() => setShowModal(false), 200)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showModal && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                  { matchingOrders.length > 0 ? ( matchingOrders.map((Client) => (
                    <div key={Client._id} onClick={() => handleSelectOrder(Client)} className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer">
                      {Client.Name}
                    </div>
                  )) 
                ) 
              : 
              (
              <div key="noresultsfounds" className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer">
                No Search results founds.....
              </div>
            ) 
              }
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
                onChange={handleFinal}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Ref.</label>
              <input
                type="text"
                id="ref"
                onKeyDown={handleKeys}
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
                onKeyDown={handleKeys}
                value={finalform.GSTNo}
                onChange={handleFinal}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Vendor</label>
              <input
                type="text"
                onKeyDown={handleKeys}
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
                onKeyDown={handleKeys}
                value={finalform.address}
                onChange={handleFinal}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">State</label>
              <input
                id="state"
                value={finalform.state}
                onChange={handleFinal}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
          </div>
        </form>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-nowrap bg-gray-200 px-3 pt-3 rounded-md space-x-2 mb-6">
            <div className=" mb-4 text-center">
              <label htmlFor="scanner" className="block text-sm font-medium">
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
                required
                value={formData.barcode}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barcode"
              />
            </div>
            <div className="w-25 mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm w-max font-medium"
              >
                Upload Image
              </label>

              <input
                type="file"
                id="image"
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="border border-white w-28 bg-white rounded py-3 pl-2  "
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
                required
                value={formData.description}
                // onChange={handleChange}
                onChange={(e) => {handleChange(e); setInputdescriptionforsearch(e.target.value)}}
                onBlur={() => setTimeout(() => setShowModaldescription(false), 200)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
              {showModaldescription && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                  {matchingProducts.map((product) => (
                    <div key={product._id} onClick={() => handleSelectProduct(product)} className="p-2 flex border border-solid  hover:bg-gray-200 cursor-pointer">
                      {product.title}
                    </div>
                  ))}
                </div>
              )}
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
                onKeyDown={handleKeys}
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
                min={1}
                required
                onKeyDown={handleKeys}
                value={formData.qty}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="MRP"
                className="block text-gray-700 text-sm w-max font-medium"
              >
                MRP Rate
              </label>
              <input
                type="text"
                id="MRP"
                value={formData.MRP}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter MRP rate"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="purchaseRate"
                className="block text-gray-700 text-sm w-max font-medium"
              >
                Purchase Rate
              </label>
              <input
                type="text"
                id="purchaseRate"
                value={formData.purchaseRate}
                onKeyDown={handleKeys}
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
                onKeyDown={handleKeys}
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
                onKeyDown={handleKeys}
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
                onKeyDown={handleKeys}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GST percentage"
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
                onKeyDown={handleKeys}
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
                 Total purchase Rate
                </th>
                <th className="p-3 border border-gray-600 text-left">
                  Profit%
                </th>
                <th className="p-3 border border-gray-600 text-left">HSN</th>
                <th className="p-3 border border-gray-600 text-left">GST</th>

                <th className="p-3 border border-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows dynamically here */}

              {cart.length > 0 ? (
                cart.map((item, i) => (
                  <tr key={item.barcode}>
                    <td className="p-3 border border-gray-600">{i + 1}</td>
                    <td className="p-3 border border-gray-600">
                      {item.barcode}
                    </td>
                    <td className="p-3 border border-gray-600">{item.brand}</td>
                    <td className="p-3 border border-gray-600">
                      {item.description}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.category}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.stockType}
                    </td>
                    <td className="p-3 border border-gray-600">{item.unit}</td>
                    <td className="p-3 border border-gray-600">{item.qty}</td>
                    <td className="p-3 border border-gray-600">
                      {item.saleRate}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.purchaseRate}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.purchaseRate*item.qty}
                    </td>
                    <td className="p-3 border border-gray-600">
                      {item.profit}
                    </td>
                    <td className="p-3 border border-gray-600">{item.hsn}</td>
                    <td className="p-3 border border-gray-600">{item.gst}</td>

                    <td className="p-3 border border-gray-600 text-center">
                      <button
                        className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 "
                        onClick={() => handleDelete(item.barcode)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="15"
                    className="p-3 border border-gray-600 text-center"
                  >
                    No items in the cart
                  </td>
                </tr>
              )}

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
            <button
              class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
              onClick={bill}
            >
              Save
            </button>

            {/* <ReactToPrint
              trigger={() => (
                <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={bill}>
                  Print
                </button>
              )}
              content={() => componentRef.current}
            /> */}

            
<button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={handlePrint}>
                  <span className='text-center'>
                   Save & Print
                  </span>
                </button>
                <button className="bg-orange-400 text-white hover:bg-green-700 px-4 py-2 rounded-md" onClick={handleMarathiPrint}>
                  <span className='text-center'>
                  सेव्ह अँड प्रिंट
                  </span>
                </button>
          </div>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
        <div className="text-center"><h3 className=" text-red-500 text-lg font-semibold">{message}</h3></div>
          <h2 className="text-lg font-semibold mb-4">Expense</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border p-3">SUBTOTAL:</td>
                <td className="border p-3"> {invoice}</td>
              </tr>

              <tr>
                <td className="border p-3">TAXES:</td>
                <td className="border p-3">{totalGst}</td>
              </tr>

              <tr>
                <td className="border p-3">INVOICE TOTAL :</td>
                <td className="border p-3">{(invoice?parseInt(invoice):0)+(totalGst?parseInt(totalGst):0)}</td>
              </tr>
              <tr>
                <td className="border p-3">PAYMENT IN CASH:</td>
                <td className="border p-3">
                  <input
                    type="text"
                    id="cash"
                    required
                    value={finalform.paymentType.cash}
                    onChange={handlePaymentTypeChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payed cash"
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-3">PAYMENT IN CARD:</td>
                <td className="border p-3">
                  <input
                    type="text"
                    id="card"
                    value={finalform.paymentType.card}
                    onChange={handlePaymentTypeChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payed cash"
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-3">PAYMENT IN UPI:</td>
                <td className="border p-3">
                  <input
                    type="text"
                    id="upi"
                    value={finalform.paymentType.upi}
                    onChange={handlePaymentTypeChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payed cash "
                  />
                </td>
              </tr>
              <tr>
                <td className="border p-3">BORROW:</td>
                <td className="border p-3">
                  <input
                    type="text"
                    id="borrow"
                    value={finalform.paymentType.borrow}
                    onChange={handlePaymentTypeChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Borrow amount"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------invoice ganrator------------------------- */}
      <div className='hidden'>
      <Invoice componentRef={componentRef} setPrint={setPrint} details={purchaseOrders} language={language} />
      </div>
 <ReactToPrint
        trigger={() => <button style={{ display: 'none' }} />}
        content={() => componentRef.current}
        ref={(el) => (handlePrintRef.current = el)}
      />
   
    </div>
  );
};

export default Purchase;
