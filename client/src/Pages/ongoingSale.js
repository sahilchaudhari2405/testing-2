import React, { useRef, useEffect, useState, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, fetchProducts } from "../Redux/Product/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { FaBarcode, FaSadCry } from "react-icons/fa"; // Import the barcode icon from react-icons
import BarcodeReader from "react-barcode-reader";
import ReactToPrint from "react-to-print";
import logo from "../logo.png";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../Redux/User/userSlices";
import { toast } from "react-toastify";
import {
  fetchCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
  addToCart,
} from "../Redux/Cart/OnGoingCartSlice.js";

import Invoice from "../component/invoice.js";
import axiosInstance from "../axiosConfig.js";
import { fetchUsers } from "../Redux/User/userSlices";
import { createOrder } from "../Redux/Orders/orderSlice";
import Users from "./users.js";
import { Button } from "@mui/material";
import AdvancePayPopup from "../component/AdvancePay.js";

const OngoingSale = () => {
  const [details, setDetails] = useState([]);
  const [productDetails, setProductDetails] = useState();
  const dispatch = useDispatch();
  const [popupOpen, setPopupOpen] = useState(false);

  const [AdvancePay, setAdvancePay] = useState();
  const [AdvancePaid, setAdvancePaid] = useState([]);
  const [AdvancePaidId, setAdvancePaidId] = useState();
  const [UserId, setUserId] = useState();
  const [blocking, setBlocking] = useState(false); // Blocking UI state
  const [missingFields, setMissingFields] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  //   let productDetails = useSelector((State) => State.products.productDetails);
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [ClinetId, setClinetId] = useState("");
  const [CartId, setCartId] = useState("");
  const printRef = useRef();
  const { orderId } = useParams();
  let { items, status, fetchCartError } = useSelector(
    (State) => State.OnGoingcart
  );
  const [currentDate, setCurrentDate] = useState("");
  const [cardPay, setCardPay] = useState("");
  const [borrow, setBorrow] = useState("");
  const [cashPay, setCashPay] = useState("");
  const [upiPay, setUPIPay] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [gst, setGst] = useState("");
  const [total, setFinalTotal] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState(false);
  const [print, setPrint] = useState(false);
  const [language, SetLanguage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  // const users = useSelector((State) => State.user.users);
  // const orders = useSelector((State) => State.orders.orders);
  const [Address, setFinalAddress] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [Inputnameforsearch, setInputnameforsearch] = useState("");
  const [Inputmobilenumberforsearch, setInputmobilenumberforsearch] =
    useState("");
  const [Inputdescriptionforsearch, setInputdescriptionforsearch] =
    useState("");

  const [matchingOrders, setMatchingOrders] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModaldescription, setShowModaldescription] = useState(false);

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [matchingMobileNumbers, setMatchingMobileNumbers] = useState([]);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [isviewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [allProducts, setAllproducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    _id: "66ab771af4df2f3e3c09ecb4",
    title: "POSH COCOA POWDER",
    description: "POSH COCOA POWDER",
    price: 65,
    discountedPrice: 64,
    discountPercent: 0,
    weight: 0,
    quantity: -155,
    brand: "Brand Name",
    imageUrl:
      "https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png",
    slug: "POSH COCOA POWDER",
    ratings: [],
    reviews: [],
    numRatings: 0,
    category: "66ab771af4df2f3e3c09ecb1",
    createdAt: null,
    updatedAt: null,
    BarCode: "8906017232378",
    stockType: "Stock Type",
    unit: "PCS",
    purchaseRate: 50,
    profitPercentage: 0,
    HSN: "HSN Code",
    GST: 0,
    retailPrice: 64,
    totalAmount: 64,
    amountPaid: 0,
    __v: 0,
  });
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/users/setting");
        const fetchedData = response.data.data;
        if (fetchedData) {
          localStorage.setItem("invoiceSettings", JSON.stringify(fetchedData));
          setFinalAddress(fetchedData.language?.english?.address || "");
          finalform.Address = fetchedData.language?.english?.address || ""; // Ensure this logic aligns with your app's state management
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
        finalform.Address = parsedData.language?.english?.address || ""; // Ensure this matches your usage pattern
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.warn("No data found in localStorage, fetching from API...");
      fetchSettings();
    }
  }, [Address]); // Removed `Address` dependency to avoid redundant calls
  
  const handleTokenExpiration = () => {
    const token = localStorage.getItem("token");
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
    localStorage.removeItem("token");
    axiosInstance.post("/auth/logout").catch((err) => console.error(err));
    // window.location.href = '/login';
    navigate("/login");
  };

  React.useEffect(() => {
    handleTokenExpiration();
  }, []);

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
    setEditItem({ ...item });
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("users are: ",users);
  //   console.log("orders are: ",orders);
  //   setSearchuser(users);
  // }, [users,orders]);

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  const searchOfflineOrders = async () => {
    // const value = e.target.value;
    // console.log("value is: ",value);
    setFinal({
      ...finalform,
      name: Inputnameforsearch,
    });
    // setSearchInput(value);

    console.log("searching Inputnameforsearch are: ", Inputnameforsearch);
    if (Inputnameforsearch) {
      const response = await axiosInstance.post(
        "/users/admin/SearchClientSale",
        { alphabet: Inputnameforsearch }
      );
      const distinctOrders = response.data.data;
      console.log(response.data);
      if (distinctOrders == []) {
        setMatchingOrders([]);
      }

      console.log("distinctOrders users are: ", distinctOrders);
      setMatchingOrders(distinctOrders);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const searchOfflineOrdersForMobileNumber = async () => {
    setFinal({
      ...finalform,
      Mobile: Inputmobilenumberforsearch,
    });
    // setSearchInput(value);

    console.log(
      "searching Inputmobilenumberforsearch are: ",
      Inputmobilenumberforsearch
    );
    if (Inputmobilenumberforsearch) {
      const response = await axiosInstance.post(
        "/users/admin/SearchClientSale",
        { number: Inputmobilenumberforsearch }
      );
      const distinctOrders = response.data.data;
      if (distinctOrders == []) {
        setMatchingOrders([]);
      }
      console.log("distinctOrders users are: ", distinctOrders);
      setMatchingMobileNumbers(distinctOrders);
      setShowMobileModal(true);
    } else {
      setShowMobileModal(false);
    }
  };

  useEffect(() => {
    setMatchingProducts([]);
    handleSearchandChange();
    console.log(
      "Inputdescriptionforsearch changed: ",
      Inputdescriptionforsearch
    );
  }, [Inputdescriptionforsearch]);

  useEffect(() => {
    setMatchingMobileNumbers([]);
    searchOfflineOrdersForMobileNumber();
    console.log(
      "Inputmobilenumberforsearch changed: ",
      Inputmobilenumberforsearch
    );
  }, [Inputmobilenumberforsearch]);

  useEffect(() => {
    setMatchingOrders([]);
    searchOfflineOrders();
    console.log("Inputnameforsearch changed: ", Inputnameforsearch);
  }, [Inputnameforsearch]);

  const handleSearchandChange = async () => {
    setFormData({
      ...formData,
      description: Inputdescriptionforsearch,
    });
    if (Inputdescriptionforsearch) {
      const response = await axiosInstance.post(
        "/products/product/sortProductsfordescription",
        { description: Inputdescriptionforsearch }
      );
      const filteredOrders = response.data.data;
      console.log("Inputdescriptionforsearch : ", filteredOrders);
      setMatchingProducts(filteredOrders);
      setShowModaldescription(true);
    } else {
      setShowModaldescription(false);
    }
  };

  const handleMobileSearchChange = async () => {
    // const value = e.target.value;
    // console.log("Mobile number is: ", value);
    setFinal({
      ...finalform,
      description: Inputdescriptionforsearch,
    });
    if (Inputdescriptionforsearch) {
      const response = await axiosInstance.post(
        "/products/product/sortProductsfordescription",
        { description: Inputdescriptionforsearch }
      );
      const filteredOrders = response.data.data;
      console.log(
        "Inputdescriptionforsearch filteredorders by mobile number: ",
        filteredOrders
      );
      setMatchingMobileNumbers(filteredOrders);
      setShowMobileModal(true);
    } else {
      setShowMobileModal(false);
    }
  };

  //   const handleMobileSearchChange = async () => {
  //     // Check if the description is non-empty before sending a request
  //     if (!Inputdescriptionforsearch) {
  //         setShowMobileModal(false);
  //         return;
  //     }

  //     setFinal({
  //         ...finalform,
  //         description: Inputdescriptionforsearch,
  //     });

  //     try {
  //         const response = await axiosInstance.post('/products/product/sortProductsfordescription', {
  //             description: Inputdescriptionforsearch,
  //         });
  //         const filteredOrders = response.data.data;
  //         console.log("Filtered orders by description: ", filteredOrders);

  //         // Set matching orders and show the modal
  //         setMatchingMobileNumbers(filteredOrders);
  //         setShowMobileModal(true);
  //     } catch (error) {
  //         console.error("Error fetching products:", error);
  //     }
  // };

  const handleSelectOrder = async (Client) => {
    console.log("Handling selection for mobile number:", Client);

    // Set basic client information
    setClinetId(Client._id);
    setFinal({
      ...finalform,
      name: Client.Name,
      Date: Client.Date || currentDate,
      Mobile: Client.Mobile || "",
      ShipTo: Client.ShipTo || "",
      Address: Client.Address || "Shrigonda",
      State: Client.State || "Maharashtra",
    });

    try {
      // Fetch advance payment data for the selected client
      const response = await axiosInstance.get(
        `/sales/AdvancePay/advance-payment/${Client._id}`
      );
      console.log("Full response data:", response.data.advancePayment);

      // Get the first object from advancePay and cart (since they are arrays)
      const { cart, advancePay } = response.data.advancePayment;

      const cartData = cart && cart[0]; // Accessing the first object in cart array
      const advancePayData = advancePay; // Accessing the first object in advancePay array
      const AdvancePayId = response.data.advancePayment._id;
      // Log the fetched data to ensure it's being received correctly
      console.log("Cart Data:", cartData);
      console.log("Advance Payment Data:", advancePayData);

      // Set the advance payment and cart details if available
      if (advancePayData) {
        setAdvancePaid(advancePayData); // Set the advance paid amount
      }
      if (AdvancePayId) {
        setAdvancePaidId(AdvancePayId);
      }
      if (cartData) {
        setUserId(cartData.userId);
        setDetails(cartData.cartItems); // Set the cart items
        setDiscount(cartData.discount || 0); // Set the discount
        setTotalPrice(cartData.totalPrice || 0); // Set the total price
        setCartId(cartData._id); // Set the cart ID
        setGst(cartData.GST || 0); // Set the GST
        setFinalTotal(cartData.final_price_With_GST || 0); // Set the final total with GST
      }
    } catch (error) {
      // Handle error while fetching advance payment details

      if (error.response && error.response.status === 404) {
      setAdvancePaid([]);
      setAdvancePaidId("");
      setMessage("");
      setCardPay("");
      setCashPay("");
      setUPIPay("");
      setBorrow("");
      setDiscount("");
      setTotalPrice("");
      setCartId("");
      setGst("");
      setDetails([]);
      setFinalTotal("");
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
        console.error("No data found for the given Client ID.");
     
      } else {
        console.error("Error fetching advance payment details:", error);
      }
      console.log(items)
      console.log(CartId)
    }

    // Close the modals after selection
    setShowModal(false);
    setShowMobileModal(false);
  };

  const handleSelectProduct = (product) => {
    console.log("handling ");

    // setFormData({
    //   barcode: product.BarCode,
    //   brand: product.brand || "",
    //   description: product.description || "",
    //   category: product.category.name || "",
    //   stockType: product.stockType || "",
    //   unit: product.unit || "",
    //   qty: product.quantity,
    //   hsn: product.HSN,
    //   gst: product.GST,
    //   total: product.totalAmount,
    // });
    setProductDetails(product);
    setShowModaldescription(false);
    setShowMobileModal(false);
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;

    setEditItem((prevState) => {
      const newState = { ...prevState };
      if (field.includes(".")) {
        const [outerKey, innerKey] = field.split(".");
        newState[outerKey] = { ...newState[outerKey], [innerKey]: value };
      } else {
        newState[field] = value;
      }

      const mrp = parseFloat(newState.product?.price || 0);
      const quantity = parseInt(newState.quantity || 0);
      const OneUnit =
        newState.product?.purchaseRate < parseInt(newState.OneUnit)
          ? parseInt(newState.OneUnit)
          : parseInt(newState.product?.purchaseRate + 1);
      const gst = parseFloat(newState.GST || 0);

      // const totalValue = ((mrp * quantity - discount) * (1 + gst / 100)).toFixed(2);
      const totalValue = OneUnit * quantity + gst;
      newState.finalPrice_with_GST = totalValue;
      const { product } = editItem;
      const discount =
        mrp > OneUnit
          ? mrp - OneUnit
          : newState.product.discountedPrice - OneUnit;
      newState.discountedPrice = OneUnit * quantity;
      console.log(discount);
      newState.discount = discount;
      return newState;
    });
    console.log("edittem after input change: ", editItem);
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
    let { title: productTitle, price: productPrice } = product;
    const Oneunit = discountedPrice / quantity;

    const Discount =
      (product.price > Oneunit
        ? product.price - Oneunit
        : product.discountedPrice - Oneunit) * quantity;
    console.log(editItem);
    // Construct the payload for the API request
    const payload = {
      productCode: product.BarCode,
      discountedPrice: parseFloat(discountedPrice),
      quantity: parseInt(quantity),
      price: parseFloat(productPrice),
      OneUnit: parseFloat(Oneunit),
      discount: parseFloat(Discount),
      GST: parseFloat(GST),
      finalPrice_with_GST: parseFloat(finalPrice_with_GST),
      PayId: AdvancePaidId,
      uId: UserId,
    };

    try {
      const response = await axiosInstance.put(
        "/sales/OnGoing/adjustment",
        payload
      );

      // if (!response.ok) {
      //   throw new Error('Network response was not ok' + response.statusText);
      // }
      const resData = response.data;
      console.log("Save changes for item:", resData);
      setEditId(null);
      setEditItem({});
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditItem({});
  };

  useEffect(() => {
    // clearCart()
    const data = {
      PayId: AdvancePaidId,
      uId: UserId,
    };
    dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
  }, []);

  useEffect(() => {
    console.log("This is cart item: ", items);
  }, [items]);

  useEffect(() => {
    // Reset details at the beginning
    setDetails([])
    if (items.length === 2) {
      // Handle case where both cart details and summary are present
      const productsData = items[0];
      if (Array.isArray(productsData) && productsData.length > 0) {
        setDetails(productsData); // Update details if productsData is valid
      }

      const summary = items[1];
      console.log(summary)
      if (summary) {
        setDiscount(summary.discount || 0);
        setTotalPrice(summary.totalPrice || 0);
        setCartId(summary._id);
        setGst(summary.GST || 0);
        setFinalTotal(summary.final_price_With_GST || 0);
      }
    } else if (items.length === 1) {
      // Handle case where only summary data is present
      setDetails([]);
      const summary = items[0];
      if (summary) {
        setDiscount(summary.discount || 0);
        setTotalPrice(summary.totalPrice || 0);
        setCartId(summary._id);
        setGst(summary.GST || 0);
        setFinalTotal(summary.final_price_With_GST || 0);
      }
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
    if (invoice && printRef.current) {
      printRef.current.handlePrint();
    }
    setInvoice(null)
  }, [invoice]);

  const handleKeys = (e) => {
    console.log(e.key);
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

  const fetchProducts = async (id) => {
    console.log(id + "hallo");
    try {
      const response = await axiosInstance.get(`/products/product/view/${id}`); // Adjust the URL to your API endpoint
      // setProducts(response.data);
      const data = {
        PayId: AdvancePaidId,
        uId: UserId,
      };
      console.log("barcode fetch product reponse ", response);
      dispatch(
        addToCart({
          productCode: id,
          status,
          PayId: AdvancePaidId,
          uId: UserId,
          formData,
        })
      ).then(() => {
        dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
      });
      setProductDetails({});
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Product not found!");
      } else {
        console.log(err.message);
      }
    }
  };

  const fetchAllProducts = async () => {
    console.log(".............fetching All Products............");
    try {
      const response = await axiosInstance.get(`/products/product/view`);
      console.log("All Products are: ", response);
      const respdata = response.data.data;
      setAllproducts(respdata);
    } catch (err) {
      console.log("All Products error are: ");
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    console.log("allprodcut State : ", allProducts);
  }, [allProducts]);

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
  //  console.log(details);

  const handleScan = (data) => {
    // console.log(isChecked)
    if (isChecked && data) {
      dispatch(fetchProduct(data));
    }
  };

  const handleRemoveAllItem = async () => {
    try {
      // Send the request to delete all items from the cart
      const response = await axiosInstance.delete(
        "/sales/OnGoing/removeAllItem"
      );
      const data = {
        PayId: AdvancePaidId,
        uId: UserId,
      };
      // Dispatch action to fetch the updated cart after clearing it
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));

      // Reset all related states to initial values
      setMessage("");
      setCardPay("");
      setCashPay("");
      setUPIPay("");
      setBorrow("");
      setDetails([]);
      setDiscount("");
      setTotalPrice("");
      setCartId("");
      setGst("");
      setFinalTotal("");

      // Optionally show a success message (like using toast)
      // toast.success("All items removed from the cart!");
    } catch (e) {
      console.log("Error occurred while removing all items:", e);
      // Optionally, show an error message
      // toast.error("Failed to remove all items.");
    }
  };
  const handleError = (err) => {
    // console.log(isChecked)
    // if (isChecked) {

    //   fetchProducts(766576577878')
    // }
    alert("Connnect the Barcode Scanner");
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

  const [finalform, setFinal] = useState({
    type: "Sale",
    name: "",
    Date: currentDate,
    Mobile: "",
    ShipTo: "",
    Address: "Shrigonda",
    State: "Maharastra",
    GSTNo: "",
  });

  const bill = async () => {
    const gen =
      (cashPay ? parseInt(cashPay) : 0) +
      (upiPay ? parseInt(upiPay) : 0) +
      (cardPay ? parseInt(cardPay) : 0) +
      (borrow ? parseInt(borrow) : 0);
    const amount = Math.round(gen);

    const Total = Math.round(total);
    console.log(amount == Total);
    if (amount == Total) {
      if (
        items[0]?.length > 0 &&
        finalform.name &&
        finalform.Mobile &&
        finalform.Address
      ) {
        try {
        
          const createdOrder = await dispatch(
            createOrder({
              paymentType: {
                cash: cashPay,
                Card: cardPay,
                UPI: upiPay,
                borrow: borrow,
              },
              BillUser: finalform,
              PayId: AdvancePaidId,
              uId: UserId,
              status: "OnGoing",
            })
          ).unwrap();
          console.log("yes call");
          console.log(createdOrder);
          setInvoice(createdOrder.data);
          items = [];
          setFinal({
            type: "Sale",
            name: "",
            Date: currentDate,
            Mobile: "",
            ShipTo: "",
            State: "Maharastra",
            GSTNo: "",
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
            profit: "",
            hsn: "",
            gst: "",
            total: "",
          });
 
          // dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
          setMessage("");
          setCardPay("");
          setCashPay("");
          setUPIPay("");
          setAdvancePaid([]);
          setAdvancePaidId([]);
          setUserId();
          setDetails();
          setCartId();
          setBorrow("");
          setDiscount("");
          setTotalPrice("");
          setGst("");
          setFinalTotal("");
          toast.success("Order created successfully!");
        } catch (err) {
          toast.error(`Failed to create Client: ${err.message}`);
        }
      } else {
        console.log(finalform);
        console.log(UserId);
        console.log(AdvancePaidId);
        alert(`fill the client details`);
      }
    } else if (amount > Total) {
      setMessage(`Return ${amount - Total} rs `);
    } else {
      setMessage(
        `Need ${
          Total - amount
        } rs to place Client or add amount in borrow field `
      );
    }
  };

  const handlePrint = () => {
    setPrint(true);
    SetLanguage("English");
    bill();
  };

  const handleMarathiPrint = async () => {
    setPrint(true);
    SetLanguage("Marathi");
   await bill();
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
    const data = {
      PayId: AdvancePaidId,
      uId: UserId,
    };
    const item = items[0].find((item) => item._id === id);
    if (item.quantity > 1) {
      dispatch(
        updateCartQuantity({ itemId: id, PayId: AdvancePaidId, uId: UserId })
      ).then(() => {
        dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
      });
    }
  };

  const removeItem = (id) => {
    const data = {
      PayId: AdvancePaidId,
      uId: UserId,
    };
    dispatch(
      removeFromCart({ itemId: id, PayId: AdvancePaidId, uId: UserId })
    ).then(() => {
      setDetails()
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
    });
  };

  const clearCartItems = () => {
    dispatch(clearCart()).then(() => {
      const data = {
        PayId: AdvancePaidId,
        uId: UserId,
      };
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
    });
  };

  useEffect(() => {
    if (productDetails) {
      setFormData({
        barcode: productDetails.BarCode || "",
        brand: productDetails.brand || "",
        description: productDetails.title || "",
        category: productDetails.category?.name || "",
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
  
    const id = productDetails?.BarCode || null; // Use null if BarCode is undefined
    const status = "Ongoing";
  
    const data = {
      PayId: AdvancePaidId,
      uId: UserId,
    };
  
    console.log("Payload data:", { ...data, productCode: id, status, formData });
  
    try {
      // Dispatch the addToCart action
      await dispatch(
        addToCart({
          productCode: id,
          status,
          PayId: AdvancePaidId,
          uId: UserId,
          formData,
        })
      ).unwrap();
  
      // Fetch the updated cart after successfully adding the product
      dispatch(fetchCart({ PayId: AdvancePaidId, uId: UserId }));
      toast.success("Product added to cart successfully");
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
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error.message || "Failed to add product to cart");
    }
  
    setProductDetails(null); // Reset productDetails after submission
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("inside handle key press == Enter");

      if (e.target.value.trim() != "") {
        console.log("fetchroducts ");

        fetchProducts(e.target.value);
      }

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
      });
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setMissingFields([]);
  };
  const handleSave = async () => {
    let blanks = Object.keys(finalform).filter((key) => !finalform[key]);

    if (details.length === 0) {
      blanks.push("No Product");
    }

    // Exclude specific fields like 'ShipTo' and 'GSTNo' from triggering the popup
    const filteredBlanks = blanks.filter(
      (key) => !["ShipTo", "GSTNo"].includes(key)
    );

    if (filteredBlanks.length > 0) {
      setMissingFields(filteredBlanks);
      setShowPopup(true);
    } else {
      setBlocking(true);
      console.log(items);
    }
  };

  const handleCancel = () => {
    setBlocking(false);
  };
  const handleSaveData = async () => {
    // Create a new Date object for the current date and time
    const currentDate = new Date();

    // Extract the current date in YYYY-MM-DD format
    const date = currentDate.toISOString().split("T")[0];

    // Extract the current time in HH:MM:SS format
    const time = currentDate.toTimeString().split(" ")[0];

    // Assuming you already have the correct values for ClientId, CartId, and AdvancePay
    const clientId = ClinetId;
    const cart = CartId;
    const amount = AdvancePay;
    const data = date;
    const timeData = time;
    console.log(clientId);
    console.log();
    console.log(amount);
    try {
      // Send the data to the server
      const response = await axiosInstance.post("/sales/AdvancePay/add-entry", {
        clientId,
        cart,
        amount,
        AdvancePaidId,
        date: data,
        time: timeData, 
      });
      console.log("Response data:", response.data);
      const { advancePay,_id } = response.data.advancePayment;

      const advancePayData = advancePay;
      console.log("Advance Payment Data:", advancePayData);

      // Set the advance payment and cart details if available
      if (advancePayData) {
        setAdvancePaid(advancePayData); // Set the advance paid amount
        setAdvancePaidId(_id)
      }
      setAdvancePay();
      setBlocking(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("No data found for the given Client ID.");
      } else {
        console.error("Error fetching advance payment details:", error);
      }
    }
  };

  const componentRef = useRef();
  return (
    <div className="bg-gray-100 mt-20 mx-6 rounded-lg shadow-lg">
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <div className="bg-purple-700 text-white p-1 px-6 rounded-t-lg flex justify-between items-center">
        <h1 className="text-xl font-bold">OnGoing Sale</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Offline Orders | Hi, <span className="font-bold">{fullName}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors"
          >
            LogOut
          </button>
          <button
            onClick={() => navigate("/editOrder")}
            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition-colors"
          >
            Edit Order
          </button>
        </div>
      </div>
      <div className="bg-white p-2 rounded-b-lg shadow-inner">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className=" text-gray-700 mr-2 font-medium">Type</label>
              <select className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sale</option>
              </select>
            </div>
            <div>
              <label className="mr-2 text-gray-700 font-medium">Name</label>
              <input
                type="text"
                id="name"
                required
                value={finalform.name}
                placeholder="Enter name"
                autocomplete="off"
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setInputnameforsearch(e.target.value);
                }}
                onBlur={() => setTimeout(() => setShowModal(false), 200)}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showModal && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                  {matchingOrders?.length > 0 ? (
                    (console.log(matchingOrders),
                    matchingOrders.map((Client) => (
                      <div
                        key={Client._id}
                        onClick={() => handleSelectOrder(Client)}
                        className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer"
                      >
                        {Client.Name}
                      </div>
                    )))
                  ) : (
                    <div
                      key="noresultsfounds"
                      className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer"
                    >
                      No Search results founds.....
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="mr-2 text-gray-700 font-medium">Invoice</label>
              <input
                type="date"
                id="Date"
                onKeyDown={handleKeys}
                value={currentDate}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className=" mr-2 text-gray-700 font-medium">Mobile</label>
              <input
                type="text"
                id="Mobile"
                required
                onKeyDown={handleKeys}
                placeholder="Enter mobile number.."
                maxLength={10}
                minLength={10}
                autocomplete="off"
                value={finalform.Mobile}
                onChange={(e) => {
                  setInputmobilenumberforsearch(e.target.value);
                }}
                onBlur={() => setTimeout(() => setShowMobileModal(false), 200)}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showMobileModal && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                  {matchingMobileNumbers.length > 0 ? (
                    matchingMobileNumbers.map((Client) => (
                      <div
                        key={Client._id}
                        onClick={() => handleSelectOrder(Client)}
                        className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer"
                      >
                        {Client.Mobile}
                      </div>
                    ))
                  ) : (
                    <div
                      key="noresultsfounds"
                      className="p-2 border border-solid  hover:bg-gray-200 cursor-pointer"
                    >
                      No Search results founds.....
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className=" mr-2 text-gray-700 font-medium">Ship To</label>
              <input
                type="text"
                id="ShipTo"
                value={finalform.ShipTo}
                onChange={handleFinal}
                onKeyDown={handleKeys}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className=" mr-2 text-gray-700 font-medium">Address</label>
              <input
                type="text"
                id="Address"
                value={finalform.Address}
                onChange={handleFinal}
                onKeyDown={handleKeys}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className=" mr-2 text-gray-700 font-medium">State</label>
              <input
                id="State"
                value={finalform.State}
                onChange={handleFinal}
                className="w-60 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
          </div>
        </form>

        {/* New Input Fields */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-nowrap bg-gray-200 px-3  text-center rounded-md space-x-2 mb-2">
            <div className="mb-2 flex justify-center items-center text-center">
              <button
                type="button"
                onClick={handleReverseOrder}
                className={`w-full text-white py-1 px-4 rounded font-medium transition-colors ${
                  reverseOrder
                    ? "bg-orange-500 hover:bg-green-500"
                    : "bg-green-500 hover:bg-blue-800"
                }`}
              >
                {reverseOrder ? "Reset" : "Reverse"}
              </button>
            </div>
            <div className=" mb-4 text-center">
              <label htmlFor="scanner" className="block text-sm font-medium">
                Scanner
              </label>
              <input
                type="checkbox"
                id="scanner"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="border border-gray-300 rounded mt-4 "
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barcode"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 ">
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={(e) => {
                  setInputdescriptionforsearch(e.target.value);
                }}
                onBlur={() =>
                  setTimeout(() => setShowModaldescription(false), 200)
                }
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
              {showModaldescription && (
                <div className="absolute bg-white border border-gray-300 rounded shadow-lg p-3 mt-2 w-fit max-h-60 overflow-y-auto z-10">
                  {matchingProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2 flex border border-solid  hover:bg-gray-200 cursor-pointer"
                    >
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
                value={formData.category}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="profit"
                className="block text-gray-700 text-sm font-medium"
              >
                Purchase Rate
              </label>
              <input
                type="profit"
                id="profit"
                value={formData.profit}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter MRP"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="total"
                className="block text-gray-700 text-sm font-medium"
              >
                MRP
              </label>
              <input
                type="text"
                id="total"
                value={formData.total}
                onKeyDown={handleKeys}
                onChange={handleChange}
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter MRP"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
              <label
                htmlFor="saleRate"
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Sale rate"
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
                className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter GST percentage"
              />
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/6 ml-6 mt-5">
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-1 rounded font-medium hover:bg-green-800 transition-colors"
              >
                Enter
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="p-2 bg-yellow-300 font-semibold rounded mb-2 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground">
                Total Items Quantity:{" "}
              </span>
              <span className="text-primary px-3">
  {details && details.length > 0
    ? details.reduce((total, item) => total + item.quantity, 0)
    : 0}
</span>

            </div>
            <Button
              variant="contained"
              style={{ backgroundColor: "#d4edda", color: "#155724" }} // Light green background
              onClick={() => setPopupOpen(true)}
            >
              View Advance Payments
            </Button>
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
                <th className="p-1 border border-gray-600 text-left">
                  Single Unit price
                </th>
                <th className="p-1 border border-gray-600 text-left">
                  Single Disc.
                </th>
                <th className="p-1 border border-gray-600 text-left">Disc.</th>
                <th className="p-1 border border-gray-600 text-left">
                  Total Discount Price
                </th>
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
              {details &&
                (reverseOrder ? [...details].reverse() : details).map(
                  (item, i) => (
                    <tr key={item._id}>
                      <td className="py-1 px-3 border border-gray-600 text-left whitespace-nowrap">
                        {i + 1}
                      </td>
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
                            value={
                              editId === item._id
                                ? editItem.quantity
                                : item.quantity
                            }
                            min="1"
                            className="w-12 sm:w-12 text-center border m-1 sm:mb-0"
                            onChange={(e) => handleInputChange(e, "quantity")}
                          />

                          {editId !== item._id && (
                            <button
                              className=" bg-blue-500 mt-1 px-2 py-0 rounded-sm text-lg"
                              onClick={() => decreaseQuantity(item._id)}
                            >
                              -
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-1 border border-gray-600">
                        {editId === item._id ? (
                          <input
                            type="number"
                            value={editItem.OneUnit}
                            onChange={(e) => handleInputChange(e, "OneUnit")}
                          />
                        ) : (
                          item.OneUnit
                        )}
                      </td>
                      <td className="p-1 border border-gray-600">
                        {editId === item._id ? (
                          <input
                            type="number"
                            value={
                              editItem.product.price > editItem.OneUnit
                                ? editItem.product.price - editItem.OneUnit
                                : editItem.product.discountedPrice -
                                  editItem.OneUnit
                            }
                            readOnly
                          />
                        ) : item.product.price > item.OneUnit ? (
                          item.product.price - item.OneUnit
                        ) : (
                          item.product.discountedPrice - item.OneUnit
                        )}
                      </td>
                      <td className="p-1 border border-gray-600">
                        {editId === item._id ? (
                          <input
                            type="number"
                            value={
                              (editItem.product.price > editItem.OneUnit
                                ? editItem.product.price - editItem.OneUnit
                                : editItem.product.discountedPrice -
                                  editItem.OneUnit) * editItem.quantity
                            }
                            readOnly
                          />
                        ) : (
                          (item.product.price > item.OneUnit
                            ? item.product.price - item.OneUnit
                            : item.product.discountedPrice - item.OneUnit) *
                          item.quantity
                        )}
                      </td>
                      <td className="p-1 border border-gray-600">
                        {editId === item._id ? (
                          <div>{editItem.discountedPrice}</div>
                        ) : (
                          item.discountedPrice
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
                                <h2 className="text-2xl font-bold mb-4">
                                  {selectedProduct.title}
                                </h2>
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
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Description:</strong>
                                    </div>{" "}
                                    <div>{selectedProduct.description}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Price:</strong>{" "}
                                    </div>{" "}
                                    <div> ${selectedProduct.price}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Discounted Price:</strong>{" "}
                                    </div>{" "}
                                    <div>
                                      ${selectedProduct.discountedPrice}
                                    </div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Discount Percent:</strong>
                                    </div>{" "}
                                    <div>
                                      {" "}
                                      {selectedProduct.discountPercent}%
                                    </div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Weight:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.weight} kg</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Quantity:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.quantity}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Brand:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.brand || "N/A"}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Category:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.category}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Bar Code:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.BarCode}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Stock Type:</strong>
                                    </div>{" "}
                                    <div>
                                      {" "}
                                      {selectedProduct.stockType || "N/A"}
                                    </div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Unit:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.unit}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Purchase Rate:</strong>
                                    </div>{" "}
                                    <div> ${selectedProduct.purchaseRate}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>HSN:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.HSN || "N/A"}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>GST:</strong>
                                    </div>{" "}
                                    <div> {selectedProduct.GST}%</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Retail Price:</strong>
                                    </div>{" "}
                                    <div> ${selectedProduct.retailPrice}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Total Amount:</strong>
                                    </div>{" "}
                                    <div> ${selectedProduct.totalAmount}</div>
                                  </div>
                                  <div className="text-gray-700 mb-2 w-full justify-between flex ">
                                    <div>
                                      <strong>Amount Paid:</strong>
                                    </div>{" "}
                                    <div> ${selectedProduct.amountPaid}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {editId === item._id ? (
                          <>
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              onClick={() => handleSaveClick(item._id)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                              onClick={handleCancelClick}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                                                  
                            <button
                              className="bg-amber-600 text-white px-2 py-2 rounded hover:bg-amber-700"
                              onClick={() => handleViewProduct(item.product)}
                            >
                              View Product
                            </button>
                            <button
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => removeItem(item._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div class="flex space-x-2">
            <button
              className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md"
              onClick={handleRemoveAllItem}
            >
              <span className="text-center">Remove all item</span>
            </button>
            <button
              class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
              onClick={handleSave}
            >
              Save
            </button>

            <button
              className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
              onClick={handlePrint}
            >
              <span className="text-center">Save & Print</span>
            </button>
            <button
              className="bg-orange-400 text-white hover:bg-green-700 px-4 py-2 rounded-md"
              onClick={handleMarathiPrint}
            >
              <span className="text-center">सेव्ह अँड प्रिंट</span>
            </button>
          </div>

          <div className="bg-gray-200  rounded-lg shadow-md  max-w-2xl">
            <div className="text-center">
              <h3 className=" text-red-500 text-lg font-semibold">{message}</h3>
            </div>
            <h2 className="text-lg font-semibold ">Expense</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-1">AdvancePaid</td>
                  <td className="border p-1">
                    {AdvancePaid.reduce(
                      (total, entry) => total + entry.amount,
                      0
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="border p-1">SUBTOTAL:</td>
                  <td className="border p-1"> {totalPrice}</td>
                </tr>
                <tr>
                  <td className="border p-1">DISCOUNT:</td>
                  <td className="border p-1">{discount}</td>
                </tr>
                <tr>
                  <td className="border p-1">TAXES:</td>
                  <td className="border p-1">{gst}</td>
                </tr>

                <tr>
                  <td className="border p-1">INVOICE TOTAL :</td>
                  <td className="border p-1">{total}</td>
                </tr>

                <tr>
                  <td className="border p-1">PAYMENT IN CASH:</td>
                  <td className="border p-1">
                    <input
                      type="text"
                      id="cash"
                      value={cashPay}
                      onChange={(e) => setCashPay(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter payed cash"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border p-1">PAYMENT IN CARD:</td>
                  <td className="border p-1">
                    <input
                      type="text"
                      id="card"
                      value={cardPay}
                      onChange={(e) => setCardPay(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter payed cash or enter 0"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="border p-3">PAYMENT IN UPI:</td>
                  <td className="border p-1">
                    <input
                      type="text"
                      id="upi"
                      value={upiPay}
                      onChange={(e) => setUPIPay(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter payed cash or enter 0"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-1">BORROW:</td>
                  <td className="border p-1">
                    <input
                      type="text"
                      id="borrow"
                      value={borrow}
                      onChange={(e) => setBorrow(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter payed cash or enter 0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------------invoice ganrator------------------------- */}
        <Invoice
          componentRef={componentRef}
          details={invoice}
          language={language}
        />


        <ReactToPrint
          trigger={() => <button style={{ display: 'none' }} />}
          content={() => componentRef.current}
          ref={printRef}
        />
      </div>
      <AdvancePayPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        advancePay={AdvancePaid}
      />
      {showPopup && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-center text-lg font-semibold mb-3 text-red-500">
              Missing Fields
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {missingFields.map((field, index) => (
                <li key={index} className="capitalize">
                  {field} is required
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {blocking && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-20 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-5">
              Payment Details
            </h2>
            <div className="mb-4">
              <p className="text-gray-600 text-lg mb-2">
                <span className="font-medium">Total Amount:</span> {total}
              </p>
              <p className="text-gray-600 text-lg mb-4">
                <span className="font-medium">Advance Payment: </span>
              </p>
              <input
                type="number"
                name="cash"
                value={AdvancePay}
                onChange={(e) => setAdvancePay(e.target.value)}
                placeholder="Enter advance payment amount"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSaveData}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingSale;
