import React from "react";
import Barcode from "react-barcode";
import logo from "../../logo.png";
const InvoicePreviewEnglishSales = ({
  componentRef,
  settings,
  invoiceDetailEngilsh,
  currentDate,
  details,
  sharedClasses,
}) => {
  console.log(settings);
  return (
    <div className="invoice__preview mt-20 bg-white p-5 w-32 rounded-2xl border-4 border-blue-200">
      <div
        ref={componentRef}
        className="max-w-4xl flex flex-col items-center mx-auto p-4 bg-white text-black"
      >
        {settings.Sale.displayOptions.showLogo && (
          <div className="w-24 h-24 border flex items-center justify-center">
            <img src={settings.Logo || logo} alt="Insert Logo Above" />
          </div>
        )}

        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4} justify-center`}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mt-2">
              {invoiceDetailEngilsh?.title}
            </h1>
            {settings.Sale.displayOptions.address &&
              invoiceDetailEngilsh.address.map((line, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
              ))}
          </div>
        </div>

        <div
          className={`${sharedClasses.flex} flex-col w-full ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
        >
          <div>
            <span className={sharedClasses.fontBold}>Invoice Date: </span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="flex gap-4 min-w-full">
          {/* Left Column */}
          <div className="flex flex-col items-start">
            <p>
              <span className="font-bold">Customer Name: </span>
              {details.Name?.toUpperCase()}
            </p>
            {settings.Sale.displayOptions.address && (
              <p>
                <span className="font-bold">Address: </span>
                {details.Address?.toUpperCase()}
              </p>
            )}
          </div>
          {/* Right Column */}
          <div className="flex flex-col items-start">
            {settings.Sale.displayOptions.mobileNumber && (
              <p>
                <span className="font-bold">Phone: </span>
                {details.mobileNumber}
              </p>
            )}
            {settings.Sale.displayOptions.email && (
              <p>
                <span className="font-bold">Email: </span>
                {details.email}
              </p>
            )}
          </div>
        </div>

        <table className="w-full border-collapse border mb-2 text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-1">Description</th>
              <th className="border p-1">Quantity</th>
              {settings.Sale.productDataVisibility.unitPrice && (
                <th className="border p-1">Unit Price</th>
              )}
              {settings.Sale.productDataVisibility.GST && (
                <th className="border p-1">GST</th>
              )}
              {settings.Sale.productDataVisibility.Discount && (
                <th className="border p-1">Discount</th>
              )}
              {settings.Sale.productDataVisibility.price && (
                <th className="border p-1">Price</th>
              )}
              <th className="border p-1">Discounted Price</th>
            </tr>
          </thead>
          <tbody>
            {details?.orderItems?.map((e, index) => (
              <tr key={index}>
                <td className="border p-1 truncate">{e.product?.title}</td>
                <td className="border p-1 text-center">{e.quantity}</td>
                {settings.Sale.productDataVisibility.unitPrice && (
                  <td className="border p-1 text-center">
                    {(e.discountedPrice / e.quantity).toFixed(2)}
                  </td>
                )}
                {settings.Sale.productDataVisibility.GST && (
                  <td className="border p-1 text-center">{e.CGST+e.SGST}</td>
                )}
                {settings.Sale.productDataVisibility.Discount && (
                  <td className="border p-1 text-center">
                    {(e.price
                      ? e.price - e.discountedPrice
                      : (e.product.discountedPrice -
                          e.discountedPrice / e.quantity) *
                        e.quantity
                    ).toFixed(2)}
                  </td>
                )}
                {settings.Sale.productDataVisibility.price && (
                  <td className="border p-1 text-center">{e.price}</td>
                )}
                <td className="border p-1 text-center">{e.discountedPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}
        >
          <div className="w-full">
            {settings.Sale.displayOptions.showTotalPrice && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>Total</span>
                <span>₹{details.totalPrice}</span>
              </div>
            )}
            {settings.Sale.displayOptions.showDiscount && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>Discount</span>
                <span>₹{details.discount}</span>
              </div>
            )}
            {settings.Sale.displayOptions.showGST && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>GST</span>
                <span>₹{details.GST}</span>
              </div>
            )}
            {settings.Sale.displayOptions?.showPayType && (
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
              <span>Grand Total</span>
              <span>₹{details.finalPriceWithGST}</span>
            </div>
          </div>
        </div>

        {settings.Sale.displayOptions.showQR && (
          <div>
            <Barcode
              value={details._id}
              width={0.8}
              height={40}
              displayValue={false}
            />
          </div>
        )}

        <p className="text-center font-bold">
          Thank you for shopping with {settings.language.english.title}!
        </p>
      </div>
    </div>
  );
};

export default InvoicePreviewEnglishSales;
