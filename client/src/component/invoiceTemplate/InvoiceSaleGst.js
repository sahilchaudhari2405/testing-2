import React from "react";
import logo from "../../logo.png";
import Barcode from "react-barcode";
const InvoiceSaleGstEnglish = ({
  componentRef,
  settings,
  invoiceDetailEngilsh,
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
      {/* Header Section */}
      <header className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-red-500">
            {settings.language.english.UserDetails.title}
          </h1>
          {settings.GSTBill.displayOptions.address && (
            <p>
              {settings.language.english.UserDetails.address},
              {settings.language.english.UserDetails.state}
            </p>
          )}
          {settings.GSTBill.displayOptions.mobileNumber && (
            <p>Phone: {settings.language.english.UserDetails.phone}</p>
          )}
          {settings.GSTBill.displayOptions.GSTIN && (
            <p>GSTIN: {settings.language.english.BankDetails.GSTIN}</p>
          )}
          {settings.GSTBill.displayOptions.PAN_Number && (
            <p>
              PAN Number: {settings.language.english.BankDetails.PAN_Number}
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
                  alt="Insert Logo Above"
                />
              </div>
            </div>
          )}
          <h2 className="text-xl font-semibold">TAX INVOICE</h2>
          <p>
            Invoice Date: <span className="font-medium">{currentDate}</span>
          </p>
          {settings.GSTBill.displayOptions.email && (
            <p>
              Email:{" "}
              <span className="font-medium">
                {settings.language.english.UserDetails.email}
              </span>
            </p>
          )}
        </div>
      </header>

      {/* Bill To / Ship To Section */}
      <section className="grid grid-cols-3 gap-2 my-1">
        <div>
          <h3 className="font-semibold mb-1">BILL TO</h3>
          <p>{details.ClinetID.Name?.toUpperCase()}</p>

          <p>
            {details.ClinetID.Address?.toUpperCase()},
            {details.ClinetID.state?.toUpperCase()}
          </p>
          <p>PinCode: {details.ClinetID.Pin}</p>
          <p>Phone: {details.ClinetID.Mobile}</p>
        </div>
        <div className="flex flex-col justify-end items-baseline">
          {settings.GSTBill.displayOptions.GSTIN && (
            <p className="whitespace-nowrap">
              GSTIN: {details.ClinetID.BankDetails.GSTIN}
            </p>
          )}
          {settings.GSTBill.displayOptions.PAN_Number && (
            <p className="whitespace-nowrap">
              PAN Number: {details.ClinetID.BankDetails.PAN_Number}
            </p>
          )}
          {settings.GSTBill.displayOptions.GSTIN && (
            <p className="whitespace-nowrap">Email: {details.ClinetID.Email}</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-1">SHIP TO</h3>
          <p>{details.ClinetID.SHIPTO.Name}</p>
          <p>{details.ClinetID.SHIPTO.address}</p>
          <p>Pin: {details.ClinetID.SHIPTO.Pin}</p>
        </div>
      </section>

      {/* Item Table */}
      <section className="space-y-2 items-center">
        {/* First Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm text-center">
            <thead>
              <tr className="bg-red-500 text-cyan-50">
                <th className="border border-gray-300 px-1">S. No.</th>
                <th className="border border-gray-300 px-1">Item</th>
                {settings.GSTBill.productDataVisibility.HSN && (
                  <th className="border border-gray-300 px-1">HSN</th>
                )}
                <th className="border border-gray-300 px-1">Quantity</th>
                {settings.GSTBill.productDataVisibility.MRP && (
                  <th className="border border-gray-300 px-1">MRP</th>
                )}
                {settings.GSTBill.productDataVisibility.Discount && (
                  <th className="border border-gray-300 px-1">Discount</th>
                )}
                {settings.GSTBill.productDataVisibility.Rate && (
                  <th className="border border-gray-300 px-1">Rate</th>
                )}
                {settings.GSTBill.productDataVisibility.Tax && (
                  <th className="border border-gray-300 px-1">Tax</th>
                )}
                <th className="border border-gray-300 px-1">Amount</th>
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
                <th className="border border-gray-300 px-1">S. No.</th>
                <th className="border border-gray-300 px-1">Item</th>
                {settings.GSTBill.productDataVisibility.HSN && (
                  <th className="border border-gray-300 px-1">HSN</th>
                )}
                <th className="border border-gray-300 px-1">Quantity</th>
                {settings.GSTBill.productDataVisibility.MRP && (
                  <th className="border border-gray-300 px-1">
                    MRP: {details.totalPrice}
                  </th>
                )}
                {settings.GSTBill.productDataVisibility.Discount && (
                  <th className="border border-gray-300 px-1">
                    Discount: {details.discount}
                  </th>
                )}
                {settings.GSTBill.productDataVisibility.Rate && (
                  <th className="border border-gray-300 px-1">
                    Rate: {details.totalDiscountedPrice}
                  </th>
                )}
                {settings.GSTBill.productDataVisibility.Tax && (
                  <th className="border border-gray-300 px-1">
                    Tax: {details.GST}
                  </th>
                )}
                <th className="border border-gray-300 px-1">
                  Amount: {details.finalPriceWithGST}
                </th>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Second Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-1" rowSpan="2">
                  HSN
                </th>
                {settings.GSTBill.displayOptions.TaxableAmount && (
                  <th className="border border-gray-300 px-1" rowSpan="2">
                    Taxable Amount
                  </th>
                )}
                <th className="border border-gray-300 px-1" colSpan="2">
                  CGST
                </th>
                <th className="border border-gray-300 px-1" colSpan="2">
                  SGST
                </th>
                {settings.GSTBill.displayOptions.TotalTaxAmount && (
                  <th className="border border-gray-300 px-1" rowSpan="2">
                    Total Tax Amount
                  </th>
                )}
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Amount</th>
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {details.orderItems.map((item, index) => (
                <tr key={index}>
                  {settings.GSTBill.productDataVisibility.HSN && (
                    <td className="border border-gray-300 px-1">
                      {item.product?.HSN || "N/A"}
                    </td>
                  )}
                  {settings.GSTBill.displayOptions.TotalTaxAmount && (
                    <td className="border border-gray-300 px-1">
                      {item.discountedPrice || 0}
                    </td>
                  )}
                  <td className="border border-gray-300 px-1">
                    {item.product?.CGST || 0}
                  </td>
                  <td className="border border-gray-300 px-1">
                    {item.CGST || 0}
                  </td>
                  <td className="border border-gray-300 px-1">
                    {item.product?.SGST || 0}
                  </td>
                  <td className="border border-gray-300 px-1">
                    {item.SGST || 0}
                  </td>
                  {settings.GSTBill.displayOptions.TotalTaxAmount && (
                    <td className="border border-gray-300 px-1">
                      {item.finalPriceWithGST || 0}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {settings.GSTBill.displayOptions.TermsConditions && (
                  <th className="border border-gray-300 p-1">
                    Terms & Conditions
                  </th>
                )}
                <th className="border border-gray-300 p-1">Bank Details</th>
                <th className="border border-gray-300 p-1">
                  Authorised Signatory
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {settings.GSTBill.displayOptions.TermsConditions && (
                  <td className="border border-gray-300 p-2 text-sm align-top">
                    <ul className="list-disc list-inside m-0">
                      {settings.language.english.TermsConditions.map(
                        (term, index) => (
                          <li key={index}>{term}</li>
                        )
                      )}
                    </ul>
                  </td>
                )}
                <td className="border border-gray-300 p-2 text-sm">
                  {settings.GSTBill.displayOptions.Account_Holder && (
                    <p className="whitespace-nowrap">
                      Account Holder:{" "}
                      {settings.language.english.BankDetails.Account_Holder}
                    </p>
                  )}
                  {settings.GSTBill.displayOptions.Account_Number && (
                    <p className="whitespace-nowrap">
                      Account Number:{" "}
                      {settings.language.english.BankDetails.Account_Number}
                    </p>
                  )}
                  {settings.GSTBill.displayOptions.Bank && (
                    <p className="whitespace-nowrap">
                      Bank: {settings.language.english.BankDetails.Bank}
                    </p>
                  )}
                  {settings.GSTBill.displayOptions.Branch && (
                    <p className="whitespace-nowrap">
                      Branch: {settings.language.english.BankDetails.Branch}
                    </p>
                  )}
                  {settings.GSTBill.displayOptions.IFSC && (
                    <p className="whitespace-nowrap">
                      IFSC Code: {settings.language.english.BankDetails.IFSC}
                    </p>
                  )}
                  {settings.GSTBill.displayOptions.UPI_ID && (
                    <p className="whitespace-nowrap">
                      UPI ID: {settings.language.english.BankDetails.UPI_ID}
                    </p>
                  )}
                </td>
                <td className=" border-gray-300 flex flex-col">
                  {settings.GSTBill.displayOptions.showQR && (
                    <p className="flex  justify-center ">
                      <Barcode
                        value={details._id}
                        width={0.6}
                        height={20}
                        displayValue={false}
                      />
                    </p>
                  )}
                  <p className="font-semibold text-sm text-center px-1">
                    Authorised Signatory For {settings.language.english.BankDetails.Account_Holder || settings.language.english.UserDetails.title}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InvoiceSaleGstEnglish;
