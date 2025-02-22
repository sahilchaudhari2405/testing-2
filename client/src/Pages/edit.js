import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosConfig";
import { toast } from "react-toastify";
import BarcodeReader from "react-barcode";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchCart, addToCart } from "../Redux/Cart/cartSlice";
import Invoice from "../component/invoice";
import ReactToPrint from "react-to-print";
import { FaSave, FaTrash } from "react-icons/fa";
// import BarcodeReader from "react-barcode-reader";
import { jwtDecode } from "jwt-decode";
import ExpireDate from "../component/ExpireDate";

const Edit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId: orderIdFromURL } = useParams();
  const [editOrderItemId, setEditOrderItemId] = useState(null);
  const [editOrderItem, setEditOrderItem] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [totalBills, setTotalBills] = useState();
  const [totalPrice, setPayprice] = useState();
  const [popupVisible, setPopupVisible] = useState(false);
  const printRef = useRef();
  const [language, SetLanguage] = useState("");
  const [details, setDetails] = useState(null);
  const componentRef = useRef();

  const [remainingAmount, setRemainingAmount] = useState(null);
  const [remainingAmountPayBack, setRemainingAmountPayBack] = useState(null);
  const [payment, setPayment] = useState({
    cash: 0,
    card: 0,
    upi: 0,
    borrow: 0,
  });
  // Function to handle input changes for payment and borrow
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    console.log( name, value )
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: parseFloat(value) || 0, // Ensure value is numeric or 0
    }));
  };
  const handleCancel = () => {
    setPayment({
      cash: 0,
      card: 0,
      upi: 0,
      borrow: 0,
    });
    setError("");
    setRemainingAmount(0); // Reset remaining amount
    setPopupVisible(false);
    setPayprice(0); // Close the popup
  };
  const openPopupForPay = (item, editedItemData) => {
    setPopupVisible(true);
    console.log("Item:", item);
    console.log("Edited Item Data:", editedItemData);
  
    if (!item || !editedItemData) {
      console.error("Missing required data.");
      return;
    }
  
    const gstRate = (item.product?.CGST || 0) + (item.product?.SGST || 0);
    console.log("GST Rate:", gstRate);
  
    // Calculate the difference in quantity
    const remainingQuantity = editedItemData.quantity - item.quantity;
    const remainingQuantityPayBack = item.quantity - editedItemData.quantity;
  
    console.log("Remaining Quantity:", remainingQuantity);
    console.log("Remaining Quantity Pay Back:", remainingQuantityPayBack);
  
    // Set total price for the edited item
    setPayprice(editedItemData.finalPriceWithGST);
  
    // Ensure OneUnit price exists
    const oneUnitPrice = editedItemData.OneUnit > 0 ? editedItemData.OneUnit : item.OneUnit;
  
    // Calculate amounts based on positive differences
    const remainingAmount = remainingQuantity > 0 ? remainingQuantity * oneUnitPrice : 0;
    const remainingAmountPayBack = remainingQuantityPayBack > 0 ? remainingQuantityPayBack * oneUnitPrice : 0;
  
    console.log("Remaining Amount (before GST):", remainingAmount);
    console.log("Remaining Amount Pay Back (before GST):", remainingAmountPayBack);
  
    // Calculate final prices with GST
    const gstFinalPrice = remainingAmount + (remainingAmount * gstRate) / 100;
    const gstFinalPricePayBack = remainingAmountPayBack + (remainingAmountPayBack * gstRate) / 100;
  
    // Calculate total unit price and final price with GST
    const totalUnitPrice = editedItemData.OneUnit * editedItemData.quantity;
    console.log("Total Unit Price:", totalUnitPrice);
    
    const editGstPrice = totalUnitPrice + (totalUnitPrice * gstRate) / 100;
    console.log("Edited GST Price:", editGstPrice);
  
    // Price change calculations
    const priceChangePay = editedItemData.finalPriceWithGST - item.finalPriceWithGST;
    const priceChangePayBack = item.finalPriceWithGST - editGstPrice;
  
    // Update state with correct values
    setRemainingAmount(gstFinalPrice > 0 ? gstFinalPrice : priceChangePay > 0 ? priceChangePay : 0);
    setRemainingAmountPayBack(
      gstFinalPricePayBack > 0 ? gstFinalPricePayBack : priceChangePayBack > 0 ? priceChangePayBack : 0
    );
  
    console.log("Final Remaining Amount with GST:", gstFinalPrice);
    console.log("Final Remaining Amount Pay Back with GST:", gstFinalPricePayBack);
  };
  
  
  // Effect to update remaining amount whenever payment fields change
  // useEffect(() => {
  //   const totalPaid =
  //     parseFloat(payment.cash) +
  //     parseFloat(payment.card) +
  //     parseFloat(payment.upi) +
  //     parseFloat(payment.borrow);

  //   const remaining = remainingAmount - totalPaid;
  //   setRemainingAmount(remaining);
  // }, [payment]); // Triggered whenever payment state changes

  // Function to handle form submission and validate payments
  const handleSavePayment = () => {
        const totalPaid =
      parseFloat(payment.cash) +
      parseFloat(payment.card) +
      parseFloat(payment.upi) +
      parseFloat(payment.borrow);
    if (remainingAmount === totalPaid) {
      handleSave();
      setError("");
      // Close the popup after saving
    } else {
      toast.warning(`You still need to pay ₹${remainingAmount-totalPaid}.`);
    }
  };

  const [editItem, setEditItem] = useState({
    // product: {
    //     title: "",
    //     price: 0,
    //     discountedPrice: 0,
    //     discountPercent: 0,
    //     quantity: 0,
    //     purchaseRate: 12.5,
    //     profitPercentage: 0,
    //     HSN: null,
    //     GST: 0,
    //     retailPrice: 15,
    //     totalAmount: 15,
    //     amountPaid: 0,
    //     __v: 0
    // },
    quantity: 0,
    purchaseRate: 0,
    price: 0,
    SGST: 0,
    CGST: 0,
    totalProfit: 0,
    discountedPrice: 0,
    finalPriceWithGST: 0,
  });
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isviewProductModalOpen, setIsViewProductModalOpen] = useState(false);
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
    SGST: 0,
    CGST: 0,
    retailPrice: 64,
    totalAmount: 64,
    amountPaid: 0,
    __v: 0,
  });
  const [editedItemData, setEditedItemData] = useState({});
  const [invoiceData, setinvoice] = useState({});
  const [formData, setFormData] = useState({
    Name: "",
    mobileNumber: "",
    email: "",
    orderDate: "",
    paymentType: {
      cash: 0,
      Card: 0,
      UPI: 0,
      borrow:0,
    },
    orderItems: [],
    billImageURL: "",
    totalPrice: "",
    totalDiscountedPrice: "",
    totalPurchaseRate: "",
    GST: "",
    discount: 0,
    orderStatus: "first time",
    totalItem: "",
    totalProfit: "",
    finalPriceWithGST: "",
  });

  // State variables for form fields
  const [addprocudtoneditformData, setaddprocudtoneditformData] = useState({
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
    sgst: "",
    cgst: "",
    total: "",
  });
    const [BankDetails, setBankDetails] = useState({
      GSTIN: "",
      PAN_Number: "",
    });
    const [SHIPTO, setSHIPTO] = useState({
      Name: "",
      address: "",
      Pin: "",
    });
  const [orderId, setOrderId] = useState("");
  const [paymenttype, setpaymenttype] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchedOrder, setfetchedOrder] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [Inputdescriptionforsearch, setInputdescriptionforsearch] =
    useState("");
  const [showModaldescription, setShowModaldescription] = useState(false);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [productDetails, setProductDetails] = useState();
  const [showMobileModal, setShowMobileModal] = useState(false);

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
    axiosInstance.post("/users/auth/logout").catch((err) => console.error(err));
    // window.location.href = '/login';
    navigate("/login");
  };

  React.useEffect(() => {
    handleTokenExpiration();
  }, []);

  useEffect(() => {
    setMatchingProducts([]);
    handleSearchandChange();
  }, [Inputdescriptionforsearch]);

  useEffect(() => {
    if (productDetails) {
      setaddprocudtoneditformData({
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

  useEffect(() => {
    if (orderIdFromURL) {
      setOrderId(orderIdFromURL);
      handleOrderIdChange({ target: { value: orderIdFromURL } });
      fetchOrderData();
    }
  }, [orderId]);
  const [editingItemId, setEditingItemId] = useState(null); // Track which item is being edited
  const [editableOrderItems, setEditableOrderItems] = useState(
    formData.orderItems
  );

  const handleEdit = (itemId) => {
    setEditingItemId(itemId);
  };

  const handleSave = async (itemId) => {
    console.log(payment,paymenttype)
    try {
      const oneUnit = editedItemData.discountedPrice / editedItemData.quantity;
      const Discount =
        (editedItemData.product?.price > oneUnit
          ? editedItemData.product?.price - oneUnit
          : editedItemData.product.discountedPrice - oneUnit) *
        editedItemData.quantity;
      const payload = {
        orderId: orderId,
        productCode: editedItemData.product.BarCode,
        discountedPrice: editedItemData.discountedPrice,
        quantity: editedItemData.quantity,
        price: editedItemData.price,
        discount: Discount,
        GST: editedItemData.GST,
        finalPriceWithGST: editedItemData.finalPriceWithGST,
        OneUnit: oneUnit,
        payment,
      };
console.log(payload)
      const response = await axiosInstance
        .post("/sales/order/addCustomProductOnEdit", payload)
        .then(async (response) => {
          toast.success("Order updated successfully!");
          handleSetData(response.data.data);
          setPopupVisible(false);
          setEditingItem(null);
        })
        .catch((err) => {
          alert("Failed to update order.");
        });
      setEditingItemId(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
    setEditingItemId(null);
  };
  useEffect(() => {
    if (details && printRef.current) {
      printRef.current.handlePrint();
    }
    setDetails(null);
  }, [details]);
  const handleInputChange = (e, field) => {
    const { value } = e.target;

    setEditedItemData((prevState) => {
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

      // const totalValue = ((mrp * quantity - discount) * (1 + gst / 100)).toFixed(2);
      const totalValue = OneUnit * quantity;
      const { product } = editItem;
      const discount =
        mrp > OneUnit
          ? mrp - OneUnit
          : newState.product.discountedPrice - OneUnit;
      newState.discountedPrice = OneUnit * quantity;
      // console.log(discount);
      newState.discount = discount;
      newState.finalPriceWithGST = OneUnit * quantity;

      return newState;
    });
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
  };

  const handleEditClick = (e, item) => {
    e.preventDefault();
    setEditingItem(item._id);
    setEditedItemData(item);
  };



  const handleScan = (data) => {
    // console.log(isChecked)
    if (isChecked && data) {
      setOrderId(data);
      fetchOrderData();
    }
  };

  const fetchProduct = async (barcode) => {
    try {
      const response = await axiosInstance.get(
        `/products/product/view/${barcode}`
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  const handleScanproduct = (data) => {
    // console.log(isChecked)
    if (isChecked && data) {
      // dispatch(fetchProduct(data));

      fetchProduct(data).then((product) => {
        setProductDetails(product);

        setaddprocudtoneditformData({
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
      });
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

  const handlePrint = () => {
    SetLanguage("English");
    setDetails(invoiceData);
  };

  const handleMarathiPrint = () => {
    SetLanguage("Marathi");

    setDetails(invoiceData);
  };
  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  const formatDateToDisplay = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchOrderData = async () => {
    if (!orderId) {
      setError("Please enter an Order ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sales/order/getCounterOrderbyID/${orderId}`
      );
      handleSetData(response.data.data);
      setBankDetails(response.data.data.ClinetID.BankDetails)
      setSHIPTO(response.data.data.ClinetID.SHIPTO)
      setError("");

    } catch (err) {
      setError("Failed to fetch order data. Please check the Order ID.");

      setFormData({
        Name: "",
        mobileNumber: "",
        email: "",
        orderDate: "",
        orderItems: [],
        paymentType: {
          cash: 0,
          Card: 0,
          UPI: 0,
          borrow:0,
        },
        billImageURL: "",
        totalPrice: "",
        totalDiscountedPrice: "",
        totalPurchaseRate: "",
        GST: "",
        discount: 0,
        orderStatus: "first time",
        totalItem: "",
        totalProfit: "",
        finalPriceWithGST: "",
      });
    }
  };

  const handleSetData = (orderData) => {
    setinvoice(orderData);
    setFormData(orderData);
    const formattedOrderDate = orderData.orderDate.split("T")[0];
    const displayOrderDate = formatDateToDisplay(formattedOrderDate);
    setfetchedOrder(true);
    setLoading(false);
  };
  const handleChangeGSTBILL = (e) => {
    const { name, value } = e.target;
    const [group, field] = name.split("."); // Expecting name in format: group.field

    if (group === "BankDetails") {
      setBankDetails((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    } else if (group === "SHIPTO") {
      setSHIPTO((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeAddProductonEdit = (e) => {
    const { id, value } = e.target;
    setaddprocudtoneditformData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // const handlePaymentChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevData => ({
  //     ...prevData,
  //     paymentType: {
  //       ...prevData.paymentType,
  //       [name]: Number(value)
  //     }
  //   }));
  //   console.log("changed formdata: ", formData);

  // };
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
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewProductModalOpen(true);
  };
  const handleRemoveOrderItem = async (e, orderId, itemId) => {
    e.preventDefault();

    const remove_payload = {
      itemId: itemId,
      orderId: orderId,
    };

    axiosInstance
      .put("/sales/order/RemoveOneItem", remove_payload)
      .then(async (response) => {
        toast.success("Order item removed successfully!");
        fetchOrderData();
      })
      .catch((err) => {
        toast.error("Failed to remove item.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/sales/order/updateOrderbyID/${orderId}`, {formData,BankDetails,SHIPTO})
      .then(async (response) => {
        toast.success("Order updated successfully!");
        handleSetData(response.data.data);
      })
      .catch((err) => {
        alert("Failed to update order.");
      });
  };

  const cancelOrder = async () => {
    const cancelOrder_payload = {
      orderId: orderId,
    };

    axiosInstance
      .put("/sales/order/cancelOrder", cancelOrder_payload)
      .then(async (response) => {
        toast.success("Order cancelled successfully!");
        await fetchOrderData();
      })
      .catch((err) => {
        toast.error("Failed to cancel order");
      });
      setBankDetails({
        GSTIN:"",
        PAN_Number:"",
      });
      setSHIPTO({
        Name:"",
        address:"",
        Pin:"",
      })
    setFormData({
      Name: "",
      mobileNumber: "",
      email: "",
      orderDate: "",
      orderItems: [],
      paymentType: {
        cash: 0,
        Card: 0,
        UPI: 0,
        borrow:0,
      },
      billImageURL: "",
      totalPrice: "",
      totalDiscountedPrice: "",
      totalPurchaseRate: "",
      GST: "",
      discount: 0,
      orderStatus: "first time",
      totalItem: "",
      totalProfit: "",
      finalPriceWithGST: "",
    });
  };

  const handleDecreaseQuantity = async (e, iteamId) => {
    //fefds decreaseQuantity
    e.preventDefault();
    const decreaseQuantity_payload = {
      orderId: orderId,
      iteamId: iteamId,
      paymentType: paymenttype,
    };

    axiosInstance
      .put("/sales/order/decreaseQuantity", decreaseQuantity_payload)
      .then(async (response) => {
        toast.success("Quantity decreased successfully!");
        fetchOrderData();
      })
      .catch((err) => {
        toast.error("Failed to decrease quantity");
      });
  };
  const decreaseQuantity = (id) => {
    const item = formData.orderItems[0].find((item) => item._id === id);
    if (item.quantity > 1) {
      // dispatch(updateCartQuantity({ productId: id, quantity: item.quantity - 1 })).then(() => {
      //   dispatch(fetchCart());
      // });
    }
  };
  const closeModal = () => {
    setIsViewProductModalOpen(false);
    setSelectedProduct(null);
  };
  //fucntions to add new item to order
  const fetchProducts = async (id) => {
    try {
      const response = await axiosInstance.get(`/products/product/view/${id}`); // Adjust the URL to your API endpoint
      // setProducts(response.data);
      dispatch(addToCart(id)).then(() => {
        dispatch(fetchCart());
      });
      setProductDetails({});
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Product not found!");
      }
    }
  };

  const [handlekeyPress, setHandleKeyPress] = useState(false);

  useEffect(() => {
    if (handlekeyPress) {
      handleAddProductSubmit();
    }
    setHandleKeyPress(false);
  }, [productDetails]);

  const handleKeyPress = (e) => {
    setHandleKeyPress(true);
    if (e.key === "Enter") {
      if (e.target.value.trim() != "") {
        const barcode = addprocudtoneditformData.barcode;
        fetchProduct(barcode).then((product) => {
          setProductDetails(product);
        });
      }

      setaddprocudtoneditformData({
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

  const handleKeys = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };
  const handleReturn = () => {
    navigate("/view");
  };
  const handleSelectProduct = (product) => {
    setaddprocudtoneditformData({
      barcode: product.BarCode,
      brand: product.brand || "",
      description: product.description || "",
      category: product.category.name || "",
      stockType: product.stockType || "",
      unit: product.unit || "",
      qty: product.quantity,
      hsn: product.HSN,
      gst: product.GST,
      total: product.totalAmount,
    });
    setProductDetails(product);
    setShowModaldescription(false);
    setShowMobileModal(false);
  };

  const handleSearchandChange = async () => {
    setaddprocudtoneditformData({
      ...addprocudtoneditformData,
      description: Inputdescriptionforsearch,
    });
    if (Inputdescriptionforsearch) {
      const response = await axiosInstance.post(
        "/products/product/sortProductsfordescription",
        { description: Inputdescriptionforsearch }
      );
      const filteredOrders = response.data.data;
      setMatchingProducts(filteredOrders);
      setShowModaldescription(true);
    } else {
      setShowModaldescription(false);
    }
  };
  const handleAddProductSubmit = async (e = null) => {
    if (e) {
      e.preventDefault();
    }
    if (productDetails) {
      const id = productDetails.BarCode;
      const payload = {
        orderId: orderId,
        productCode: id,
      };
      const response = await axiosInstance.post(
        "/sales/order/addProductOnEdit",
        payload
      );
      await fetchOrderData();
    }
    // setProductDetails({...productDetails,['qty']:" "});
    setProductDetails();
    setaddprocudtoneditformData({
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
      sgst: "",
      cgst: "",
      total: "",
    });
  };

  const saveAndClosePopup = () => {
    // Perform any validation or save logic here
    if (
      !formData.paymentType.cash &&
      !formData.paymentType.Card &&
      !formData.paymentType.UPI
    ) {
      setError("Please fill in at least one payment type");
    } else {
      setPopupVisible(false); // Close the popup
    }
  };
  return (
    <div className="bg-gray-100 mt-20  mx-6 rounded-lg shadow-lg">
        <ExpireDate/>
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
        {fetchedOrder && (
          <div className="bg-blue-100 rounded">
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
                <label className="block text-gray-700 font-medium">
                  Mobile Number
                </label>
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
              <label className="block text-gray-700 font-medium">GSTIN</label>
              <input
                type="text"
                name="BankDetails.GSTIN"
                placeholder="GSTIN"
                value={BankDetails.GSTIN}
                onChange={handleChangeGSTBILL}
                 className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div>
            <label className="block text-gray-700 font-medium">PAN_Number</label>
              <input
                type="text"
                name="BankDetails.PAN_Number"
                placeholder="PAN Number"
                value={BankDetails.PAN_Number}
                onChange={handleChangeGSTBILL}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></input>
            </div>
            <div>
            <label className="block text-gray-700 font-medium">SHIPTO Name</label>

              <input
                type="text"
                name="SHIPTO.Name"
                placeholder="Name"
                value={SHIPTO.Name}
                onChange={handleChangeGSTBILL}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div>
            <label className="block text-gray-700 font-medium">SHIPTO Address</label>
              <input
                type="text"
                name="SHIPTO.address"
                placeholder="Address"
                value={SHIPTO.address}
                onChange={handleChangeGSTBILL}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div>
            <label className="block text-gray-700 font-medium">SHIPTO PinCode</label>
              <input
                type="text"
                name="SHIPTO.Pin"
                placeholder="Pin"
                value={SHIPTO.Pin}
                onChange={handleChangeGSTBILL}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Order Date
                </label>
                <input
                  type="date"
                  name="orderDate"
                  value={formatDateForInput(formData.orderDate)}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
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
            </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Bill Image URL
                </label>
                <input
                  type="text"
                  name="billImageURL"
                  value={formData.billImageURL}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Total Price
                </label>
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
                <label className="block text-gray-700 font-medium">
                  Total Discounted Price
                </label>
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
                <label className="block text-gray-700 font-medium">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Order Status
                </label>
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
                <label className="block text-gray-700 font-medium">
                  Total Items
                </label>
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
                <label className="block text-gray-700 font-medium">
                  Final Price with GST
                </label>
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

            <form>
              <div className="flex flex-nowrap bg-gray-200 px-3  text-center rounded-md space-x-2 mb-2">
                <BarcodeReader
                  onError={handleError}
                  onScan={handleScanproduct}
                />

                {/* <div className="mb-2 flex justify-center items-center text-center">
                <button
                  type="button"
                  onClick={handleReverseOrder}
                  className={`w-full text-white py-1 px-4 rounded font-medium transition-colors ${
                    reverseOrder ? 'bg-orange-500 hover:bg-green-500' : 'bg-green-500 hover:bg-blue-800'
                  }`}
                >
                {reverseOrder ? 'Reset' : 'Reverse'}
                </button>
              </div> */}
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
                    value={addprocudtoneditformData.barcode}
                    onKeyDown={handleKeyPress}
                    onChange={handleChangeAddProductonEdit}
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
                    value={addprocudtoneditformData.brand}
                    onChange={handleChangeAddProductonEdit}
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
                    value={addprocudtoneditformData.description}
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
                    value={addprocudtoneditformData.category}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
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
                    value={addprocudtoneditformData.stockType}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
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
                    value={addprocudtoneditformData.unit}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
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
                    value={addprocudtoneditformData.qty}
                    onKeyDown={handleKeys}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={addprocudtoneditformData.saleRate}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={addprocudtoneditformData.hsn}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter HSN"
                  />
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
                  <label
                    htmlFor="sgst"
                    className="block text-gray-700 text-sm font-medium"
                  >
                    SGST%
                  </label>
                  <input
                    type="text"
                    id="sgst"
                    value={addprocudtoneditformData.sgst}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter SGST percentage"
                  />
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
                  <label
                    htmlFor="cgst"
                    className="block text-gray-700 text-sm font-medium"
                  >
                    CGST%
                  </label>
                  <input
                    type="text"
                    id="cgst"
                    value={addprocudtoneditformData.cgst}
                    onKeyDown={handleKeys}
                    onChange={handleChangeAddProductonEdit}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter CGST percentage"
                  />
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/6 ml-6 mt-5">
                  <button
                    onClick={(e) => {
                      handleAddProductSubmit(e);
                      setaddprocudtoneditformData({
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
                        sgst: "",
                        cgst: "",
                        total: "",
                      });
                    }}
                    className="w-full bg-green-700 text-white py-1 rounded font-medium hover:bg-green-800 transition-colors"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </form>
            <div className="p-4 bg-blue-300">
              <h1 className="text-xl font-bold mb-4">Order Items</h1>
              {formData.orderItems?.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-300 text-gray-600">
                      <th className="p-1 border border-gray-600 text-left">
                        #
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Description
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        MRP
                      </th>
                      <th className="p-1 border border-gray-600 text-left w-[60px]">
                        Net Qty
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Single Unit price
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Single Disc.
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Disc.
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Total Discount Price
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        SGST%
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        CGST%
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Total Value
                      </th>
                      <th className="p-1 border border-gray-600 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.orderItems.map((item, index) => (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                        <td className="py-1 px-3 border border-gray-600 text-left">
                          {item.product?.title}
                        </td>
                        <td className="p-1 border border-gray-600">
                          {item.product.price}
                        </td>
                        <td className="p-1 border border-gray-600">
                          <div className="flex flex-row items-center">
                            <input
                              type="number"
                              value={
                                editingItem === item._id
                                  ? editedItemData.quantity
                                  : item.quantity
                              }
                              min="1"
                              className="w-12 sm:w-12 text-center border m-1 sm:mb-0"
                              onChange={(e) => handleInputChange(e, "quantity")}
                            />

                            {editingItem !== item._id && (
                              <button
                                className=" bg-blue-500 mt-1 px-2 py-0 rounded-sm text-lg"
                                onClick={(e) =>
                                  handleDecreaseQuantity(e, item._id)
                                }
                              >
                                -
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-1 border border-gray-600">
                          {editingItem === item._id ? (
                            <input
                              type="number"
                              name="OneUnit"
                              value={editedItemData.OneUnit}
                              onChange={(e) => handleInputChange(e, "OneUnit")}
                            />
                          ) : (
                            item.OneUnit
                          )}
                        </td>
                        <td className="p-1 border border-gray-600">
                          {editingItem === item._id ? (
                            <input
                              type="number"
                              value={
                                editedItemData.product?.price >
                                editedItemData.OneUnit
                                  ? editedItemData.product.price -
                                    editedItemData.OneUnit
                                  : editedItemData.product.discountedPrice -
                                    editedItemData.OneUnit
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
                          {editingItem === item._id ? (
                            <input
                              type="number"
                              value={
                                (editedItemData.product.price >
                                editedItemData.OneUnit
                                  ? editedItemData.product.price -
                                    editedItemData.OneUnit
                                  : editedItemData.product.discountedPrice -
                                    editedItemData.OneUnit) *
                                editedItemData.quantity
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
                          {editingItem === item._id ? (
                            <div>{editedItemData.discountedPrice}</div>
                          ) : (
                            item.discountedPrice
                          )}
                        </td>
                        <td className="p-1 border border-gray-600">
                          {editingItem === item._id ? (
                            <input
                              type="number"
                              value={editedItemData.SGST}
                              onChange={(e) => handleInputChange(e, "SGST")}
                            />
                          ) : (
                            item.SGST
                          )}
                        </td>
                        <td className="p-1 border border-gray-600">
                          {editingItem === item._id ? (
                            <input
                              type="number"
                              value={editedItemData.CGST}
                              onChange={(e) => handleInputChange(e, "CGST")}
                            />
                          ) : (
                            item.CGST
                          )}
                        </td>
                        <td className="p-1 border border-gray-600">
                          {editingItem === item._id ? (
                            <div>{editedItemData.finalPriceWithGST}</div>
                          ) : (
                            item.finalPriceWithGST
                          )}
                        </td>
                        <td className="px-4 py-2 border border-gray-600">
                          <div className="flex items-center space-x-2">
                            {editingItem === item._id ? (
                              <>
                                <button
                                  onClick={() =>
                                   {
                                    openPopupForPay(item, editedItemData);
                                   }
                                  }
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700"
                                  onClick={() =>
                                    handleViewProduct(item.product)
                                  }
                                >
                                  View Product
                                </button>
                                <button
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  onClick={(e) =>
                                    handleRemoveOrderItem(e, orderId, item._id)
                                  }
                                >
                                  Delete
                                </button>
                                <button
                                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                  onClick={(e) => handleEditClick(e, item)}
                                >
                                  Edit
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h1 className="text-lg font-semibold text-red-500 mb-4">
                  Order Items are Empty
                </h1>
              )}
            </div>

            <div className="flex p-4 bg-blue-700 rounded-b-lg justify-end space-x-4">
              <button
                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                onClick={handleReturn}
              >
                Return
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                onClick={handleMarathiPrint}
              >
                सेव्ह अँड प्रिंट
              </button>
              <button
                className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                onClick={handlePrint}
              >
                English bill
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={handleSubmit}
              >
                Save changes
              </button>
              <div
                onClick={cancelOrder}
                className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ${
                  fetchedOrder ? "" : "opacity-50 cursor-not-allowed"
                }`}
              >
                Cancel this Order
              </div>
              <button
                type="button"
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                onClick={() => {
                  setFormData({
                    Name: "",
                    mobileNumber: "",
                    email: "",
                    orderDate: "",
                    orderItems: [],
                    paymentType: {
                      cash: 0,
                      Card: 0,
                      UPI: 0,
                      borrow:0,
                    },
                    billImageURL: "",
                    totalPrice: "",
                    totalDiscountedPrice: "",
                    totalPurchaseRate: "",
                    GST: "",
                    discount: 0,
                    orderStatus: "first time",
                    totalItem: "",
                    totalProfit: "",
                    finalPriceWithGST: "",
                  });
                  setOrderId("");
                  setError("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <Invoice
          componentRef={componentRef}
          details={details}
          language={language}
        />

        <ReactToPrint
          trigger={() => <button style={{ display: "none" }} />}
          content={() => componentRef.current}
          ref={printRef}
        />
      </div>
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
                  <div>${selectedProduct.discountedPrice}</div>
                </div>
                <div className="text-gray-700 mb-2 w-full justify-between flex ">
                  <div>
                    <strong>Discount Percent:</strong>
                  </div>{" "}
                  <div> {selectedProduct.discountPercent}%</div>
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
                    <strong>Bar Code:</strong>
                  </div>{" "}
                  <div> {selectedProduct.BarCode}</div>
                </div>
                <div className="text-gray-700 mb-2 w-full justify-between flex ">
                  <div>
                    <strong>Stock Type:</strong>
                  </div>{" "}
                  <div> {selectedProduct.stockType || "N/A"}</div>
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
                    <strong>SGST:</strong>
                  </div>{" "}
                  <div> {selectedProduct.SGST}%</div>
                </div>
                <div className="text-gray-700 mb-2 w-full justify-between flex ">
                  <div>
                    <strong>CGST:</strong>
                  </div>{" "}
                  <div> {selectedProduct.CGST}%</div>
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
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <h3 className="text-lg font-semibold mb-4">
              Total Amount: ₹{totalPrice.toFixed(2)}
            </h3>

            <div className="space-y-4">
              <span className="text-gray-600">Borrow Amount</span>
              <input
                type="number"
                name="borrow"
                value={payment.borrow || ""}
                onChange={handlePaymentChange}
                placeholder=""
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
              />
              <span className="text-gray-600">cash Amount</span>
              <input
                type="number"
                name="cash"
                value={payment.cash || ""}
                onChange={handlePaymentChange}
                placeholder=""
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
              />
              <span className="text-gray-600">card Amount</span>
              <input
                type="number"
                name="card"
                value={payment.card || ""}
                onChange={handlePaymentChange}
                placeholder=""
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
              />
              <span className="text-gray-600">UPI Amount</span>
              <input
                type="number"
                name="upi"
                value={payment.upi || ""}
                onChange={handlePaymentChange}
                placeholder=""
                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{
                  appearance: "textfield",
                  MozAppearance: "textfield",
                  WebkitAppearance: "none",
                }}
              />
            </div>

            {/* Remaining amount */}
            <h4
              className={`mt-4 ${
                "text-green-500" 
              }`}
            >
       
           { `Remaining Amount to Pay With GST: ₹${remainingAmount}`}
           <div className=" text-orange-400">   { `Remaining Amount to Pay Back With GST: ₹${remainingAmountPayBack}`}</div>
            </h4>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => handleSavePayment()}
                className="bg-green-400 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out flex items-center"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out flex items-center"
              >
                <FaTrash className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
