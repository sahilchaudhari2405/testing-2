import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import Barcode from "react-barcode";
import axiosInstance from "../axiosConfig";
import InvoicePreviewMarathiPurchase from "./invoiceTemplate/InvoiceMarathiPurchase";
import InvoicePreviewMarathiSales from "./invoiceTemplate/InvoiceMarathiSale";
import InvoicePreviewEnglishSales from "./invoiceTemplate/InvoiceEnglishSales";
import InvoicePreviewEnglishPurchase from "./invoiceTemplate/InvoiceEnglishPurchase";
import InvoiceSaleGstEnglish from "./invoiceTemplate/InvoiceSaleGst";
const InvoiceTest = ({ componentRef, details, setPrint, language,GstBill,settings }) => {

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
    title: settings.language.marathi.UserDetails.title,
    address: [
      `${settings.language.marathi.UserDetails.address}, ${settings.language.marathi.UserDetails.state}`,
      `<span class='font-bold'>PinCode</span>: ${settings.language.marathi.UserDetails.pin}`,
      `<span class='font-bold'>ग्राहक सेवा</span>:${settings.language.marathi.UserDetails.customerService}`,
      `<span class='font-bold'>फोन</span>:${settings.language.marathi.UserDetails.phone}`,
      `<span class='font-bold'>ईमेल</span>: ${settings.language.marathi.UserDetails.email}`,
    ],
  };
  const invoiceDetailEngilsh = {
    title: settings.language.english.UserDetails.title,
    address: [
      `${settings.language.english.UserDetails.address}, ${settings.language.english.UserDetails.state}`,
      `<span class='font-bold'>PinCode</span>: ${settings.language.english.UserDetails.pin}`,
      `<span class='font-bold'>Customer Service</span>: ${settings.language.english.UserDetails.customerService}`,
      `<span class='font-bold'>Phone</span>: ${settings.language.english.UserDetails.phone}`,
      `<span class='font-bold'>Email</span>: ${settings.language.english.UserDetails.email}`,
    ],
  };
  console.log(GstBill)
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
     />:<InvoicePreviewEnglishSales
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
