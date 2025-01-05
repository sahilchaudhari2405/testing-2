import axios from "axios";
import { useEffect, useState, useRef } from "react";
import InvoiceTest from "../component/invoicetest"; // Ensure this is the correct path
import ReactToPrint from "react-to-print";
import axiosInstance from "../axiosConfig";
const InvoiceSettings = () => {
  const [settings, setSettings] = useState({
    language: {
      english: {
        title: "",
        address: "",
        customerService: "",
        phone: "",
        email: "",
      },
      marathi: {
        title: "",
        address: "",
        customerService: "",
        phone: "",
        email: "",
      },
    },
    Logo: "",
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
  });

  const printRef = useRef();
  const componentRef = useRef();
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
  const response= await axiosInstance.post("/users/setting/create", settings);
      alert("Settings saved successfully!");
      console.log(response)
      localStorage.setItem("invoiceSettings", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handlePreview = (language) => {
    setPreviewLanguage(language);
    setInvoice(details);
  };

  const handlePreviewPurchase = (language) => {
    setPreviewLanguage(language);
    details.type = "purchase";
    setInvoice(details);
  };

  const handleChange = (e, section, subSection, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => {
      if (subSection) {
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
      } else if (field) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
        return { ...prev, [section]: value };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoUploade(file);
  };

  const uploadToCloudinary = async () => {
    if (!LogoUpload) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", LogoUpload);
    formData.append("upload_preset","so8be3fc" ); // Access from .env

    const cloudName = process.env.CLOUDINARY_API_KEY; // Access from .env
console.log(cloudName)
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dpvmepvae/image/upload`,
        formData
      );
      console.log(response.data.secure_url)
      setSettings({ ...settings, Logo: response.data.secure_url });
     settings.Logo=response.data.secure_url
      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo.");
    }
  };

  const details = {
    type: "customer",
    Name: "John Doe",
    Address: "123 Main Street, Springfield, IL",
    mobileNumber: "+1234567890",
    email: "john.doe@example.com",
    orderItems: [
      { product: { title: "Product 1" }, quantity: 2, discountedPrice: 200, price: 250, GST: 18 },
      { product: { title: "Product 2" }, quantity: 1, discountedPrice: 150, price: 180, GST: 18 },
    ],
    totalPrice: 500,
    discount: 50,
    GST: 90,
    finalPriceWithGST: 540,
    paymentType: { cash: 200, Card: 150, UPI: 100, borrow: 90 },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto max-w-5xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice Settings</h1>

        {/* Language Settings */}
        <div className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Language Settings</h2>
  {Object.keys(settings.language).map((lang) => (
    <div key={lang} className="mb-6">
      <h3 className="text-xl font-medium text-gray-600 capitalize">{lang}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(settings.language[lang])
          .filter((field) => field !== "_id") // Exclude _id
          .map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                value={settings.language[lang][field]}
                onChange={(e) => handleChange(e, "language", lang, field)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
      </div>
    </div>
  ))}
</div>

        {/* Logo Upload */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Logo</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={uploadToCloudinary}>Upload Logo</button>
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

        {/* Display Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Display Options</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(settings.displayOptions).map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.displayOptions[field]}
                  onChange={(e) => handleChange(e, "displayOptions", null, field)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="capitalize">{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Data Visibility */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product Data Visibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(settings.productDataVisibility).map((field) => (
              <label key={field} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.productDataVisibility[field]}
                  onChange={(e) =>
                    handleChange(e, "productDataVisibility", null, field)
                  }
                  className="h-5 w-5 text-blue-600"
                />
                <span className="capitalize">{field}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4">
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
