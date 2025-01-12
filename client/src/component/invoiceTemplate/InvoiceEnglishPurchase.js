import React, { forwardRef } from "react";
import Barcode from "react-barcode";
import logo from "../../logo.png";
const InvoicePreviewEnglishPurchase =(
  { invoiceDetailEngilsh, settings, details, currentDate, sharedClasses,componentRef }) => {
    return (
      <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
        <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}
          >
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold mt-2">
                {invoiceDetailEngilsh.title}
              </h1>
              {settings.displayOptions.address &&
                invoiceDetailEngilsh.address.map((line, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
                ))}
            </div>
            {settings.displayOptions.showLogo && (
              <div className="w-24 h-24 border flex items-center justify-center">
                <img src={settings.Logo || logo} alt="Insert Logo Above" />
              </div>
            )}
          </div>

          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
          >
            {settings.displayOptions.showQR && (
              <div>
                <span className={sharedClasses.fontBold}>INVOICE NO: </span>
                <Barcode
                  value={details._id}
                  width={0.8}
                  height={40}
                  displayValue={false}
                />
              </div>
            )}
            <div>
              <span className={sharedClasses.fontBold}>DATE: </span>
              <span>{currentDate}</span>
            </div>
          </div>

          <div
            className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}
          >
            <div className="w-1/2 pr-2">
              <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
              <div className="flex gap-4 min-w-full">
                {/* Left Column */}
                <div className="flex flex-col items-start">
                  <p>
                    <span className="font-bold">Customer Name: </span>
                    {details.Name?.toUpperCase()}
                  </p>
                  {settings.displayOptions.address && (
                    <p>
                      <span className="font-bold">Address: </span>
                      {details.Address?.toUpperCase()}
                    </p>
                  )}
                </div>
                {/* Right Column */}
                <div className="flex flex-col items-start">
                  {settings.displayOptions.mobileNumber && (
                    <p>
                      <span className="font-bold">Phone: </span>
                      {details.mobileNumber}
                    </p>
                  )}
                  {settings.displayOptions.email && (
                    <p>
                      <span className="font-bold">Email: </span>
                      {details.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse border mb-2 text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-1">DESCRIPTION</th>
                <th className="border p-1">QUANTITY</th>
                <th className="border p-1">UNIT PRICE</th>
                <th className="border p-1">GST</th>
                <th className="border p-1">TOTAL PRICE</th>
              </tr>
            </thead>
            <tbody>
              {details.orderItems?.map((e, index) => (
                <tr key={index}>
                  <td className="border p-1 truncate">{e.productId?.title}</td>
                  <td className="border p-1 text-center">{e.quantity}</td>
                  <td className="border p-1 text-center">
                    {e.productId.purchaseRate.toFixed(2)}
                  </td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">
                    {e.productId.purchaseRate * e.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}
          >
            <div className="w-full">
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>SUBTOTAL</span>
                <span>₹{details.totalPurchaseRate}</span>
              </div>

              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>GST</span>
                <span>₹{details.GST}</span>
              </div>
              {settings.displayOptions.showPayType && (
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Payment Methods</span>
                  <div className="flex flex-col w-full">
                    {details.paymentType?.cash > 0 && (
                      <div className="flex justify-between">
                        <span>Cash:</span>
                        <span>₹{details.paymentType?.cash}</span>
                      </div>
                    )}
                    {details.paymentType?.Card > 0 && (
                      <div className="flex justify-between">
                        <span>Card:</span>
                        <span>₹{details.paymentType?.Card}</span>
                      </div>
                    )}
                    {details.paymentType?.UPI > 0 && (
                      <div className="flex justify-between">
                        <span>UPI:</span>
                        <span>₹{details.paymentType?.UPI}</span>
                      </div>
                    )}
                    {details.paymentType?.borrow > 0 && (
                      <div className="flex justify-between">
                        <span>Credit:</span>
                        <span>₹{details.paymentType?.borrow}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}
              >
                <span>Amount Pay</span>
                <span>₹{details.AmountPaid}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div
              className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}
            ></div>
          </div>
          <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
        </div>
      </div>
    );
  }


export default InvoicePreviewEnglishPurchase;
