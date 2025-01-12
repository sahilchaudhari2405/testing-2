import React from "react";

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
          <h1 className="text-2xl font-bold text-red-500">{company.name}</h1>
          <p>{company.address}</p>
          <p>Phone: {company.phone}</p>
          <p>GSTIN: {company.gstin}</p>
          <p>PAN Number: {company.pan}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">TAX INVOICE</h2>
          <p>
            Invoice No:{" "}
            <span className="font-medium">{invoiceInfo.number}</span>
          </p>
          <p>
            Invoice Date:{" "}
            <span className="font-medium">{invoiceInfo.date}</span>
          </p>
          <p>
            Email: <span className="font-medium">{company.email}</span>
          </p>
          <p>
            Website: <span className="font-medium">{company.website}</span>
          </p>
          <p>
            FSSAI No: <span className="font-medium">{company.fssai}</span>
          </p>
        </div>
      </header>

      {/* Bill To / Ship To Section */}
      <section className="grid grid-cols-2 gap-2 my-4">
        <div>
          <h3 className="font-semibold mb-2">BILL TO</h3>
          <p>{billingInfo.name}</p>
          <p>{billingInfo.address}</p>
          <p>Pin: {billingInfo.pin}</p>
          <p>Phone: {billingInfo.phone}</p>
          <p>PAN Number: {billingInfo.pan}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">SHIP TO</h3>
          <p>{shippingInfo.name}</p>
          <p>{shippingInfo.address}</p>
          <p>Pin: {shippingInfo.pin}</p>
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
                <th className="border border-gray-300 px-1">HSN</th>
                <th className="border border-gray-300 px-1">Quantity</th>
                <th className="border border-gray-300 px-1">MRP</th>
                <th className="border border-gray-300 px-1">Discount</th>
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Tax</th>
                <th className="border border-gray-300 px-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-1 whitespace-nowrap ">{index + 1}</td>
                  <td className="border border-gray-300 px-1">
                    {item.name}
                  </td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap break-words">
                    {item.hsn}
                  </td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.quantity}</td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.rate}</td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.discount}</td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.rate}</td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.tax}</td>
                  <td className="border border-gray-300 px-1  whitespace-nowrap">{item.amount}</td>
                </tr>
              ))}
              <tr className="bg-gray-300">
                <th className="border border-gray-300 px-1"></th>
                <th className="border border-gray-300 px-1">Total</th>
                <th className="border border-gray-300 px-1"></th>
                <th className="border border-gray-300 px-1">Quantity</th>
                <th className="border border-gray-300 px-1">MRP</th>
                <th className="border border-gray-300 px-1">Discount</th>
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Tax/Unit</th>
                <th className="border border-gray-300 px-1">Amount</th>
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
                <th className="border border-gray-300 px-1" rowSpan="2">
                  Taxable Amount
                </th>
                <th className="border border-gray-300 px-1" colSpan="2">
                  CGST
                </th>
                <th className="border border-gray-300 px-1" colSpan="2">
                  SGST
                </th>
                <th className="border border-gray-300 px-1" rowSpan="2">
                  Total Tax Amount
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Amount</th>
                <th className="border border-gray-300 px-1">Rate</th>
                <th className="border border-gray-300 px-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-1">{item.hsn}</td>
                  <td className="border border-gray-300 px-1">
                    {item.taxableAmount}
                  </td>
                  <td className="border border-gray-300 px-1">{item.cgstRate}</td>
                  <td className="border border-gray-300 px-1">
                    {item.cgstAmount}
                  </td>
                  <td className="border border-gray-300 px-1">{item.sgstRate}</td>
                  <td className="border border-gray-300 px-1">
                    {item.sgstAmount}
                  </td>
                  <td className="border border-gray-300 px-1">
                    {item.totalTaxAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1">Terms & Conditions</th>
                <th className="border border-gray-300 p-1">Bank Details</th>
                <th className="border border-gray-300 p-1">
                  Authorised Signatory
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 text-sm align-top">
                  <ul className="list-disc list-inside m-0">
                    {terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 p-2 text-sm">
                  <p className="whitespace-nowrap">
                    Account Holder: {bankDetails.holder}
                  </p>
                  <p className="whitespace-nowrap">
                    Account Number: {bankDetails.number}
                  </p>
                  <p className="whitespace-nowrap">Bank: {bankDetails.bank}</p>
                  <p className="whitespace-nowrap">
                    Branch: {bankDetails.branch}
                  </p>
                  <p className="whitespace-nowrap">
                    IFSC Code: {bankDetails.ifsc}
                  </p>
                  <p className="whitespace-nowrap">UPI ID: {bankDetails.upi}</p>
                </td>
                <td className=" border-gray-300 flex flex-col justify-end">
                  <p className="font-semibold text-sm text-center px-1">
                    Authorised Signatory For Akash Enterprises
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
