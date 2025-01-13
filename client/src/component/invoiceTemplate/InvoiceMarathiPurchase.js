import React, { useRef } from "react";
import Barcode from "react-barcode";
import logo from "../../logo.png";
const InvoicePreviewMarathiPurchase = ({
  componentRef,
  invoiceDetails,
  settings,
  details,
  sharedClasses,
  currentDate,
}) => {
  return (
    <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
      <div
        ref={componentRef}
        className="max-w-4xl mx-auto p-4 bg-white text-black"
      >
        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}
        >
          <div className="flex flex-col items-start ">
            <h1 className="text-2xl font-bold mt-2">{invoiceDetails.title}</h1>
            {settings.Purchase.displayOptions.address &&
              invoiceDetails.address.map((line, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
              ))}
          </div>
          {settings.Purchase.displayOptions.showLogo && (
            <div className="w-24 h-24 border flex items-center justify-center">
              <img src={settings.Logo || logo} alt="लोगो वरती घाला" />
            </div>
          )}
        </div>
        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
        >
          {settings.Purchase.displayOptions.showQR && (
            <div>
              <span className={sharedClasses.fontBold}>चलन क्र.: </span>
              <Barcode
                value={details._id}
                width={0.8}
                height={40}
                displayValue={false}
              />
            </div>
          )}
          <div>
            <span className={sharedClasses.fontBold}>तारीख: </span>
            <span>{currentDate}</span>
          </div>
        </div>
        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}
        >
          <div className="w-1/2 pr-2">
            <h2 className={sharedClasses.fontBold}>बिल:</h2>
            <div className="flex gap-4 min-w-full">
              {/* Left Column */}
              <div className="flex flex-col items-start">
                <p>
                  <span className="font-bold">चलाकाचे नाव: </span>
                  {details.Name?.toUpperCase()}
                </p>
                {settings.Purchase.displayOptions.address && (
                  <p>
                    <span className="font-bold">पत्ता: </span>
                    {details.Address?.toUpperCase()}
                  </p>
                )}
              </div>
              {/* Right Column */}
              <div className="flex flex-col items-start">
                {settings.Purchase.displayOptions.mobileNumber && (
                  <p>
                    <span className="font-bold">फोन: </span>
                    {details.mobileNumber}
                  </p>
                )}
                {settings.Purchase.displayOptions.email && (
                  <p>
                    <span className="font-bold">ईमेल: </span>
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
              <th className="border p-1">वर्णन</th>
              <th className="border p-1">संख्या</th>
              <th className="border p-1">युनिट किंमत</th>
              <th className="border p-1">जीएसटी</th>
              <th className="border p-1">एकूण किंमत</th>
            </tr>
          </thead>
          <tbody>
            {details.orderItems?.map((e, index) => (
              <tr key={index}>
                <td className="border p-1 truncate">{e.productId?.title}</td>
                <td className="border p-1 text-center">{e.quantity}</td>
                <td className="border p-1 text-center">
                  {(e.productId?.purchaseRate).toFixed(2)}
                </td>
                <td className="border p-1 text-center">{e.GST}</td>
                <td className="border p-1 text-center">
                  {e.productId?.purchaseRate * e.quantity}
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
              <span>उपएकूण</span>
              <span>₹{details.totalPurchaseRate}</span>
            </div>

            {settings.Purchase.productDataVisibility.GST && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>जीएसटी</span>
                <span>₹{details.GST}</span>
              </div>
            )}
            {settings.Purchase.displayOptions.showPayType && (
              <div className="flex flex-col items-center">
                <span className="font-semibold">पेमेंट कसे केले</span>
                <div className="flex flex-col w-full">
                  {details.paymentType?.cash > 0 && (
                    <div className="flex justify-between">
                      <span>नगद:</span>
                      <span>₹{details.paymentType?.cash}</span>
                    </div>
                  )}
                  {details.paymentType?.Card > 0 && (
                    <div className="flex justify-between">
                      <span>कार्ड:</span>
                      <span>₹{details.paymentType?.Card}</span>
                    </div>
                  )}
                  {details.paymentType?.UPI > 0 && (
                    <div className="flex justify-between">
                      <span>यूपीआय:</span>
                      <span>₹{details.paymentType?.UPI}</span>
                    </div>
                  )}
                  {details.paymentType?.borrow > 0 && (
                    <div className="flex justify-between">
                      <span>उधार:</span>
                      <span>₹{details.paymentType?.borrow}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}
            >
              <span>भरणा रक्कम</span>
              <span>₹{details.AmountPaid}</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h2 className={sharedClasses.fontBold}>अटी व शर्ती:</h2>
          <div
            className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}
          ></div>
        </div>
        <p className="text-center font-bold">आपल्या व्यवसायासाठी धन्यवाद!</p>
      </div>
    </div>
  );
};

export default InvoicePreviewMarathiPurchase;
