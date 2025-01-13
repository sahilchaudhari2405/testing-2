import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import Barcode from "react-barcode";
import axiosInstance from "../axiosConfig";
import InvoicePreviewMarathiPurchase from "./invoiceTemplate/InvoiceMarathiPurchase";
import InvoicePreviewMarathiSales from "./invoiceTemplate/InvoiceMarathiSale";
import InvoicePreviewEnglishSales from "./invoiceTemplate/InvoiceEnglishSales";
import InvoicePreviewEnglishPurchase from "./invoiceTemplate/InvoiceEnglishPurchase";
import InvoiceSaleGstEnglish from "./invoiceTemplate/InvoiceSaleGst";
const InvoiceTest = ({ componentRef, details, setPrint, language,GstBill }) => {
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

  useEffect(() => {
    const data = localStorage.getItem("invoiceSettings");
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/users/setting");
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
      console.log(parsedData);
      if (parsedData) {
        setSettings(parsedData); // Set parsed data if it's not null
      } else {
        fetchSettings(); // Fetch from API if localStorage data is invalid
      }
    } else {
      fetchSettings(); // Fetch from API if no data in localStorage
    }
  }, [details]);

  const [currentDate, setCurrentDate] = useState("");
  const sharedClasses = {
    flex: "flex ",
    justifyBetween: "justify-between",
    itemsCenter: "items-center",
    mb4: "mb-4",
    border: "border text-center",
    p2: "p-2",
    fontBold: "font-bold",
  };
  const invoiceDetails = {
    title: settings.language.marathi.title,
    address: [
      `${settings.language.marathi.address}`,
      `<span class='font-bold'>ग्राहक सेवा</span>:${settings.language.marathi.customerService}`,
      `<span class='font-bold'>फोन</span>:${settings.language.marathi.phone}`,
      `<span class='font-bold'>ईमेल</span>: ${settings.language.marathi.email}`,
    ],
  };
  const invoiceDetailEngilsh = {
    title: settings.language.english.title,
    address: [
      `${settings.language.english.address}`,
      `<span class='font-bold'>Customer Service</span>: ${settings.language.english.customerService}`,
      `<span class='font-bold'>Phone</span>: ${settings.language.english.phone}`,
      `<span class='font-bold'>Email</span>: ${settings.language.english.email}`,
    ],
  };
  useEffect(() => {
    // Get the current date in the required format (YYYY-MM-DD)
    console.log("Data");
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    // if (setPrint) {
    //   setPrint(false);
    // }
    // Set the current date as the default value
    setCurrentDate(formattedDate);
  }, [details]);
  console.log(GstBill)
  console.log(language)
  return language == "Marathi" ? (
    details?.type === "customer" ? (
      <InvoicePreviewMarathiSales
      componentRef={componentRef}
      settings={settings}
      invoiceDetails={invoiceDetails}
      currentDate={currentDate}
      details={details}
      sharedClasses={sharedClasses}
      />

    ) : (
      details && (
        <InvoicePreviewMarathiPurchase
        componentRef={componentRef}
        settings={settings}
        invoiceDetails={invoiceDetails}
        currentDate={currentDate}
        details={details}
        logo={logo}
        sharedClasses={sharedClasses}
        />
      )
    )
  ) : details?.type === "customer" ? (
     (GstBill)? <InvoiceSaleGstEnglish
     componentRef={componentRef}
     settings={settings}
     invoiceDetailEngilsh={invoiceDetailEngilsh}
     currentDate={currentDate}
     details={details}
     sharedClasses={sharedClasses}
     />:   <InvoicePreviewEnglishSales
     componentRef={componentRef}
     settings={settings}
     invoiceDetailEngilsh={invoiceDetailEngilsh}
     currentDate={currentDate}
     details={details}
     sharedClasses={sharedClasses}
     />
  ) : (
    details && (
     <InvoicePreviewEnglishPurchase
     componentRef={componentRef}
     settings={settings}
     invoiceDetailEngilsh={invoiceDetailEngilsh}
     currentDate={currentDate}
     details={details}
     sharedClasses={sharedClasses}
     />
    )
  );
};

export default InvoiceTest;
