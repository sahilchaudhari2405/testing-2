import React from "react";
import logo from "../../logo.png";
import Barcode from "react-barcode";

const InvoiceSaleGstMarathi = ({
  componentRef,
  settings,
  invoiceDetailMarathi,
  currentDate,
  details,
  sharedClasses,
}) => {
  const {
    company,
    invoiceInfo,
    billingInfo,
    shippingInfo,
    items,
    totals,
    taxes,
    terms,
    bankDetails,
  } = details;
  console.log(details);

  return (
    <div
      ref={componentRef}
      className="p-8 bg-white shadow-md max-w-4xl mx-auto border border-gray-200"
    >
      {/* शीर्षक विभाग */}
      <header className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-red-500">
            {settings.language.marathi.UserDetails.title}
          </h1>
          {settings.GSTBill.displayOptions.address && (
            <p>
              {settings.language.marathi.UserDetails.address},
              {settings.language.marathi.UserDetails.state}
            </p>
          )}
          {settings.GSTBill.displayOptions.mobileNumber && (
            <p>फोन: {settings.language.marathi.UserDetails.phone}</p>
          )}
          {settings.GSTBill.displayOptions.GSTIN && (
            <p>GSTIN: {settings.language.marathi.BankDetails.GSTIN}</p>
          )}
          {settings.GSTBill.displayOptions.PAN_Number && (
            <p>
              पॅन नंबर: {settings.language.marathi.BankDetails.PAN_Number}
            </p>
          )}
        </div>
        <div className="text-right">
          {settings.GSTBill.displayOptions.showLogo && (
            <div className="flex justify-end ">
              <div className="w-12 h-12">
                <img
                  className="object-contain w-full h-full mx-auto"
                  src={settings.Logo || logo}
                  alt="वर लोगो ठेवा"
                />
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold">कर चालान</h2>
          <p>
            चालान दिनांक: <span className="font-medium">{currentDate}</span>
          </p>
          {settings.GSTBill.displayOptions.email && (
            <p>
              ई-मेल:{" "}
              <span className="font-medium">
                {settings.language.marathi.UserDetails.email}
              </span>
            </p>
          )}
        </div>
      </header>

      {/* बिलाचे आणि शिपचे तपशील */}
      <section className="grid grid-cols-3 gap-2 my-1">
        <div>
          <h3 className="font-semibold mb-1">बिल चे</h3>
          <p>{details.ClinetID.Name?.toUpperCase()}</p>
          <p>
            {details.ClinetID.Address?.toUpperCase()},
            {details.ClinetID.state?.toUpperCase()}
          </p>
          <p>पिनकोड: {details.ClinetID.Pin}</p>
          <p>फोन: {details.ClinetID.Mobile}</p>
        </div>
        <div className="flex flex-col justify-end items-baseline">
          {settings.GSTBill.displayOptions.GSTIN && (
            <p className="whitespace-nowrap">
              GSTIN: {details.ClinetID.BankDetails.GSTIN}
            </p>
          )}
          {settings.GSTBill.displayOptions.PAN_Number && (
            <p className="whitespace-nowrap">
              पॅन नंबर: {details.ClinetID.BankDetails.PAN_Number}
            </p>
          )}
          {settings.GSTBill.displayOptions.GSTIN && (
            <p className="whitespace-nowrap">ई-मेल: {details.ClinetID.Email}</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-1">शिप चे</h3>
          <p>{details.ClinetID.SHIPTO.Name}</p>
          <p>{details.ClinetID.SHIPTO.address}</p>
          <p>पिनकोड: {details.ClinetID.SHIPTO.Pin}</p>
        </div>
      </section>

      {/* आयटम टेबल */}
      <section className="space-y-2 items-center">
        {/* पहिले टेबल */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm text-center">
            <thead>
              <tr className="bg-red-500 text-cyan-50">
                <th className="border border-gray-300 px-1">अनुक्रमांक</th>
                <th className="border border-gray-300 px-1">आयटम</th>
                {settings.GSTBill.productDataVisibility.HSN && (
                  <th className="border border-gray-300 px-1">HSN</th>
                )}
                <th className="border border-gray-300 px-1">प्रमाण</th>
                {settings.GSTBill.productDataVisibility.MRP && (
                  <th className="border border-gray-300 px-1">MRP</th>
                )}
                {settings.GSTBill.productDataVisibility.Discount && (
                  <th className="border border-gray-300 px-1">सवलत</th>
                )}
                {settings.GSTBill.productDataVisibility.Rate && (
                  <th className="border border-gray-300 px-1">दर</th>
                )}
                {settings.GSTBill.productDataVisibility.Tax && (
                  <th className="border border-gray-300 px-1">कर</th>
                )}
                <th className="border border-gray-300 px-1">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {details.orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-1 whitespace-nowrap ">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-1">
                    {item.product.title}
                  </td>
                  {settings.GSTBill.productDataVisibility.HSN && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap break-words">
                      {item.product?.HSN}
                    </td>
                  )}
                  <td className="border border-gray-300 px-1  whitespace-nowrap">
                    {item.quantity}
                  </td>
                  {settings.GSTBill.productDataVisibility.MRP && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap">
                      {item.product?.price}
                    </td>
                  )}
                  {settings.GSTBill.productDataVisibility.Discount && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap">
                      {item.product.price
                        ? item.product.price - item.OneUnit
                        : (item.product.discountedPrice - item.OneUnit).toFixed(
                            2
                          )}
                    </td>
                  )}
                  {settings.GSTBill.productDataVisibility.Rate && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap">
                      {item.OneUnit}
                    </td>
                  )}
                  {settings.GSTBill.productDataVisibility.Tax && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap">
                      {item.product.SGST + item.product.CGST}%
                    </td>
                  )}
                  {settings.GSTBill.productDataVisibility.Amount && (
                    <td className="border border-gray-300 px-1  whitespace-nowrap">
                      {item.finalPriceWithGST}
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-gray-300">
                <th className="border border-gray-300 px-1">अनुक्रमांक</th>
                <th className="border border-gray-300 px-1">आयटम</th>
                {/* Additional summary fields */}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InvoiceSaleGstMarathi;
