import React from "react";
import Barcode from "react-barcode";
import logo from '../../logo.png'
const InvoicePreviewMarathiSales = ({
  componentRef,
  settings,
  invoiceDetails,
  currentDate,
  details,
  sharedClasses,
}) => {
  return (
    <div className="invoice__preview mt-20 bg-white p-5 w-32 rounded-2xl border-4 border-blue-200">
      <div
        ref={componentRef}
        className="max-w-4xl flex flex-col items-center mx-auto p-4 bg-white text-black"
      >
        {settings.displayOptions.showLogo && (
          <div className="w-24 h-24 border flex items-center justify-center">
            <img src={settings.Logo || logo} alt="लोगो वरती घाला" />
          </div>
        )}

        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4} justify-center`}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mt-2">
              {invoiceDetails.title}
            </h1>
            {settings.displayOptions.address &&
              invoiceDetails.address.map((line, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: line }}></p>
              ))}
          </div>
        </div>

        <div
          className={`${sharedClasses.flex} flex-col w-full ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
        >
          <div>
            <span className={sharedClasses.fontBold}>चलन दिनांक: </span>
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="flex gap-4 min-w-full">
          {/* Left Column */}
          <div className="flex flex-col items-start">
            <p>
              <span className="font-bold">चलाकाचे नाव: </span>
              {details.Name?.toUpperCase()}
            </p>
            {settings.displayOptions.address && (
              <p>
                <span className="font-bold">पत्ता: </span>
                {details.Address?.toUpperCase()}
              </p>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start">
            {settings.displayOptions.mobileNumber && (
              <p>
                <span className="font-bold">फोन: </span>
                {details.mobileNumber}
              </p>
            )}
            {settings.displayOptions.email && (
              <p>
                <span className="font-bold">ईमेल: </span>
                {details.email}
              </p>
            )}
          </div>
        </div>

        <table className="w-full border-collapse border mb-2 text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-1">वर्णन</th>
              <th className="border p-1">प्रमाण</th>
              {settings.productDataVisibility.unitPrice && (
                <th className="border p-1">युनिट किंमत</th>
              )}
              {settings.productDataVisibility.GST && (
                <th className="border p-1">जीएसटी</th>
              )}
              {settings.productDataVisibility.Discount && (
                <th className="border p-1">सवलत</th>
              )}
              {settings.productDataVisibility.price && (
                <th className="border p-1">किंमत</th>
              )}
              <th className="border p-1">सवलतीनंतरची किंमत</th>
            </tr>
          </thead>
          <tbody>
            {details?.orderItems?.map((e, index) => (
              <tr key={index}>
                <td className="border p-1 truncate">{e.product?.title}</td>
                <td className="border p-1 text-center">{e.quantity}</td>
                {settings.productDataVisibility.unitPrice && (
                  <td className="border p-1 text-center">
                    {(e.discountedPrice / e.quantity).toFixed(2)}
                  </td>
                )}
                {settings.productDataVisibility.GST && (
                  <td className="border p-1 text-center">{e.GST}</td>
                )}
                {settings.productDataVisibility.Discount && (
                  <td className="border p-1 text-center">
                    {(
                      e.price
                        ? e.price - e.discountedPrice
                        : (e.product.discountedPrice -
                            e.discountedPrice / e.quantity) *
                          e.quantity
                    ).toFixed(2)}
                  </td>
                )}
                {settings.productDataVisibility.price && (
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
            {settings.displayOptions.showTotalPrice && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>उपयोगिता</span>
                <span>₹{details.totalPrice}</span>
              </div>
            )}
            {settings.displayOptions.showDiscount && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>सवलत</span>
                <span>₹{details.discount}</span>
              </div>
            )}
            {settings.displayOptions.showGST && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>जीएसटी</span>
                <span>₹{details.GST}</span>
              </div>
            )}
            {settings.displayOptions.showPayType && (
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
              <span>प्रदान रक्कम </span>
              <span>₹{details.finalPriceWithGST}</span>
            </div>
          </div>
        </div>

        {settings.displayOptions.showQR && (
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
          {settings.language.marathi.title} भेट दिल्याबद्दल धन्यवाद!
        </p>
      </div>
    </div>
  );
};

export default InvoicePreviewMarathiSales;
