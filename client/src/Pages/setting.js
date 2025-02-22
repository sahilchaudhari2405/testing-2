import axios from "axios";
import { useEffect, useState, useRef } from "react";
import InvoiceTest from "../component/invoicetest"; // Ensure this is the correct path
import ReactToPrint from "react-to-print";
import axiosInstance from "../axiosConfig";
import mockDetails from "../component/data/Purchase";
import sampleInvoiceData from "../component/data/gstData";
import ExpireDate from "../component/ExpireDate";
const InvoiceSettings = () => {
  const [settings, setSettings] = useState({
    language: {
      english: {
        UserDetails: {
          title: "",
          address: "",
          state: "",
          pin: "",
          customerService: "",
          phone: "",
          email: "",
        },
        BankDetails: {
          Account_Holder: "",
          Account_Number: "",
          Bank: "",
          Branch: "",
          IFSC: "",
          UPI_ID: "",
          GSTIN: "",
          PAN_Number: "",
        },
        TermsConditions: [],
      },
      marathi: {
        UserDetails: {
          title: "",
          address: "",
          state: "",
          pin: "",
          customerService: "",
          phone: "",
          email: "",
        },
        BankDetails: {
          Account_Holder: "",
          Account_Number: "",
          Bank: "",
          Branch: "",
          IFSC: "",
          UPI_ID: "",
          GSTIN: "",
          PAN_Number: "",
        },
        TermsConditions: [],
      },
    },
    Logo: "",
    loyalty:0,
    Sale: {
      displayOptions: {
        email: true,
        address: true,
        mobileNumber: true,
        showLogo: true,
        showTotalPrice: true,
        showDiscount: true,
        showGST: true,
        showPayType: true,
        showQR: true,
      },
      productDataVisibility: {
        unitPrice: true,
        GST: true,
        Discount: true,
        price: true,
      },
    },
    Purchase: {
      displayOptions: {
        email: true,
        address: true,
        mobileNumber: true,
        showLogo: true,
        showTotalPrice: true,
        showDiscount: true,
        showGST: true,
        showPayType: true,
        showQR: true,
      },
      productDataVisibility: {
        unitPrice: true,
        GST: true,
        Discount: true,
        price: true,
      },
    },
    GSTBill: {
      displayOptions: {
        email: true,
        address: true,
        mobileNumber: true,
        showLogo: true,
        TotalTaxAmount: true,
        showDiscount: true,
        TaxableAmount: true,
        showPayType: true,
        showQR: true,
        Account_Holder: true,
        Account_Number: true,
        Bank: true,
        Branch: true,
        IFSC: true,
        UPI_ID: true,
        GSTIN: true,
        PAN_Number: true,
        SIGN: true,
        TermsConditions: true,
      },
      productDataVisibility: {
        HSN: true,
        Tax: true,
        MRP: true,
        Discount: true,
        Rate: true,
        Amount: true,
      },
    },
    ContentionBill: {
      displayOptions: {
        email: true,
        address: true,
        mobileNumber: true,
        showLogo: true,
        TotalTaxAmount: true,
        showDiscount: true,
        TaxableAmount: true,
        showPayType: true,
        showQR: true,
        Account_Holder: true,
        Account_Number: true,
        Bank: true,
        Branch: true,
        IFSC: true,
        UPI_ID: true,
        GSTIN: true,
        PAN_Number: true,
        SIGN: true,
        TermsConditions: true,
      },
      productDataVisibility: {
        HSN: true,
        Tax: true,
        MRP: true,
        Discount: true,
        Rate: true,
        Amount: true,
      },
    },
  });

  const printRef = useRef();
  const componentRef = useRef();
  const [GstBill, setGstBill] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState("english");
  const [LogoUpload, setLogoUploade] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("invoiceSettings");
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/users/setting');
        console.log(response.data.data);
        const fetchedData = response.data.data;
        if (fetchedData) {
          setSettings(fetchedData); // Set settings if data is not null
          localStorage.setItem("invoiceSettings", JSON.stringify(fetchedData));
        } else {
          console.error("No settings data found");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    if (data) {
      const parsedData = JSON.parse(data);
      console.log(parsedData)
      if (parsedData) {
        setSettings(parsedData); // Set parsed data if it's not null
      } else {
        fetchSettings(); // Fetch from API if localStorage data is invalid
      }
    } else {
      fetchSettings(); // Fetch from API if no data in localStorage
    }
  }, []);

  useEffect(() => {
    if (invoice && printRef.current) {
      printRef.current.handlePrint();
    }
    setInvoice(null);
  }, [invoice]);

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/setting/create",
        settings
      );
      alert("Settings saved successfully!");
      console.log(response);
      localStorage.setItem(
        "invoiceSettings",
        JSON.stringify(response.data.data)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handlePreview = (language) => {
    setPreviewLanguage(language);
    setGstBill(false);
    setInvoice(details);
  };

  const handlePreviewPurchase = (language) => {
    setPreviewLanguage(language);
    setInvoice(mockDetails);
  };
  const handlePreviewGstEnglish = (language) => {
    setPreviewLanguage(language);
    setGstBill(true);
    setInvoice(details);
  };
  const handleChange = (e, section, subSection, field, subField) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => {
      if (subField) {
        // Handle nested subField updates
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [field]: {
                ...prev[section][subSection][field],
                [subField]: value,
              },
            },
          },
        };
      } else if (field) {
        // Handle field-level updates
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [field]: value,
            },
          },
        };
      } else {
        // Handle top-level section updates
        return {
          ...prev,
          [section]: value,
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoUploade(file);
  };
  const [currentFeature, setCurrentFeature] = useState(""); // For user input
  const [selectedLanguage, setSelectedLanguage] = useState("english"); // Language selector
  
  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setSettings({
        ...settings,
        language: {
          ...settings.language,
          [selectedLanguage]: {
            ...settings.language[selectedLanguage],
            TermsConditions: [
              ...settings.language[selectedLanguage].TermsConditions,
              currentFeature.trim(),
            ],
          },
        },
      });
      setCurrentFeature(""); // Clear the input field
    }
  };
  
  const handleRemoveFeature = (index) => {
    setSettings({
      ...settings,
      language: {
        ...settings.language,
        [selectedLanguage]: {
          ...settings.language[selectedLanguage],
          TermsConditions: settings.language[selectedLanguage].TermsConditions.filter(
            (_, i) => i !== index
          ),
        },
      },
    });
  };
  
  const uploadToCloudinary = async () => {
    if (!LogoUpload) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", LogoUpload);
    formData.append("upload_preset", "so8be3fc"); // Access from .env

    const cloudName = process.env.CLOUDINARY_API_KEY; // Access from .env
    console.log(cloudName);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dpvmepvae/image/upload`,
        formData
      );
      console.log(response.data.secure_url);
      setSettings({ ...settings, Logo: response.data.secure_url });
      settings.Logo = response.data.secure_url;
      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo.");
    }
  };

  const details = {
    paymentType: {
      cash: 115,
      Card: null,
      UPI: null,
      borrow: null
    },
    _id: "67855e1e39bc841f0cbef87a",
    user: "67827a9cc45397e095966c46",
    ClinetID: {
      _id: "67835d95d97b7ac3c9b588b3",
      Name: "sahil chaudhari",
      Address: "gaol bazar, chandrapur",
      State: "Maharastra",
      Mobile: 9373576380,
      ClosingBalance: [
        "67835d95d97b7ac3c9b588af"
      ],
      CompletePurchase: [
        "67835d95d97b7ac3c9b588b1"
      ],
      totalCompletePurchase: 2516,
      totalClosingBalance: 0,
      createdAt: "2025-01-12T06:13:41.950Z",
      updatedAt: "2025-01-13T18:40:30.882Z",
      Email: "SahilChaudhari@gmail.com",
      Pin: "442402",
      BankDetails: {
        GSTIN: "AFUDS222",
        PAN_Number: "SDFSAF"
      },
      SHIPTO: {
        Name: "VEDANT CHAUDHARI",
        address: "AT POST MARDA",
        Pin: "442403"
      }
    },
    orderItems: [
      {
        _id: "67855e1e39bc841f0cbef878",
        product: {
          _id: "67827df17dd3eea565ee3c7b",
          title: "DABUR LAL TEL 100ML",
          description: "DABUR LAL TEL 100ML",
          price: 120,
          discountedPrice: 115,
          discountPercent: 0,
          weight: 0,
          quantity: -3,
          brand: null,
          imageUrl: "https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png",
          slug: "DABUR LAL TEL 100ML",
          ratings: [],
          reviews: [],
          numRatings: 0,
          category: "67827ddd7dd3eea565ee3a0d",
          BarCode: "8901207003875",
          stockType: null,
          unit: "PCS",
          purchaseRate: 98.597,
          profitPercentage: 0,
          HSN: '220',
          CGST: 8,
          SGST: 8,
          retailPrice: 115,
          totalAmount: 115,
          amountPaid: 0
        },
        quantity: 1,
        purchaseRate: 98.597,
        price: 120,
        type: "normal",
        CGST: 12,
        SGST: 12,
        totalProfit: 16.403000000000006,
        OneUnit: 115,
        discountedPrice: 115,
        finalPriceWithGST: 145,
        userId: "67827a9cc45397e095966c46"
      }
    ],
    Name: "sahil chaudhari",
    mobileNumber: 9373576380,
    email: "No",
    orderDate: "2025-01-13T18:40:30.482Z",
    totalPrice: 120,
    totalDiscountedPrice: 115,
    totalPurchaseRate: 98.597,
    type: "customer",
    GST: 111,
    discount: 5,
    orderStatus: "first time",
    totalItem: 1,
    totalProfit: 16.403000000000006,
    finalPriceWithGST: 115,
    createdAt: "2025-01-13T18:40:30.485Z",
    updatedAt: "2025-01-13T18:40:30.487Z"
  };
  
  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-10">
        <ExpireDate/>
      <div className="container mx-auto max-w-6xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Invoice Settings
        </h1>
        {/* Language Settings */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Language Settings
          </h2>
          {Object.entries(settings.language).map(([lang, langDetails]) => (
            <div key={lang} className="mb-6">
              <h3 className="text-xl font-medium text-gray-600 capitalize">
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {Object.entries(langDetails.UserDetails).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>  handleChange(e, "language", lang, "UserDetails", key)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Loyalty Settings
          </h2>
        <div>
  <label className="flex items-center space-x-2">
    <span className="capitalize">Loyalty</span>
    <input
      type="text"
      value={settings.loyalty}
      onChange={(e) => handleChange(e, "loyalty")}
      className="h-10 w-20 border border-gray-300 rounded-md text-center"
    />
  </label>
</div>
</div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            BankDetails Settings
          </h2>
          {Object.entries(settings.language).map(([lang, langDetails]) => (
            <div key={lang} className="mb-6">
              <h3 className="text-xl font-medium text-gray-600 capitalize">
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {Object.entries(langDetails.BankDetails).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>  handleChange(e, "language", lang, "BankDetails", key)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
        </div>
 
        <div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Select Language</label>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      >
        <option value="english">English</option>
        <option value="marathi">Marathi</option>
      </select>
    </div>

    <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
    <div className="flex space-x-2 mt-1">
      <input
        type="text"
        value={currentFeature}
        onChange={(e) => setCurrentFeature(e.target.value)}
        placeholder="Enter a feature"
        className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={handleAddFeature}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add
      </button>
    </div>

    <ul className="mt-3 space-y-2">
      {settings.language[selectedLanguage].TermsConditions.map((feature, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
        >
          <span>{feature}</span>
          <button
            type="button"
            onClick={() => handleRemoveFeature(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>


  </div>
        {/* Logo Upload */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Logo</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={uploadToCloudinary}
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
            >
              Upload Logo
            </button>
            {settings.Logo && (
              <div className="mt-4">
                <img
                  src={settings.Logo}
                  alt="Logo Preview"
                  className="w-32 h-32 rounded object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Display Options */}
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 mb-5">
              Display Options Sales
            </h2>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Display Options
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.Sale.displayOptions).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "Sale", "displayOptions", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Data Visibility */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Product Data Visibility
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.Sale.productDataVisibility).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "Sale", "productDataVisibility", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 mb-5">
              Display Options Purchase
            </h2>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Display Options
            </h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.Purchase.displayOptions).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "Purchase", "displayOptions", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Data Visibility */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Product Data Visibility
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.Purchase.productDataVisibility).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "Purchase", "productDataVisibility", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 mb-5">
              Display Options GSTBill
            </h2>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Display Options
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.GSTBill.displayOptions).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "GSTBill", "displayOptions", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Data Visibility */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Product Data Visibility
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.GSTBill.productDataVisibility).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "GSTBill", "productDataVisibility", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-gray-700 mb-5">
              Display Options ContentionBill
            </h2>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Display Options
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.ContentionBill.displayOptions).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "ContentionBill", "displayOptions", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Product Data Visibility */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Product Data Visibility
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {Object.entries(settings.ContentionBill.productDataVisibility).map(
                ([key, value]) => (
                  <div key={key}>
                   <label htmlFor={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleChange(e, "ContentionBill", "productDataVisibility", key)
                        }
                         className="h-5 w-5 text-blue-600"
                      />
                     <span className="capitalize">{key}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handlePreview("English")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
            >
              Preview Sale (English)
            </button>
            <button
              onClick={() => handlePreview("Marathi")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700"
            >
              Preview Sale (Marathi)
            </button>
            <button
              onClick={() => handlePreviewPurchase("English")}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
            >
              Preview Purchase (English)
            </button>
            <button
              onClick={() => handlePreviewPurchase("Marathi")}
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
            >
              Preview Purchase (Marathi)
            </button>
            <button
              onClick={() => handlePreviewGstEnglish("English")}
              className="bg-red-400 text-white px-6 py-2 rounded-md shadow hover:bg-red-500"
            >
              Preview Sale Gst (English)
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-2 rounded-md shadow hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>

      <InvoiceTest
        componentRef={componentRef}
        details={invoice}
        language={previewLanguage}
        settings={settings}
        GstBill={GstBill}
      />

      <ReactToPrint
        trigger={() => <button style={{ display: "none" }} />}
        content={() => componentRef.current}
        ref={printRef}
      />
    </div>
  );
};

export default InvoiceSettings;
