import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import Barcode from "react-barcode";
import axiosInstance from "../axiosConfig";
const Invoice = ({ componentRef, details, setPrint, language }) => {
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
  }, []);

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
  console.log(details);
  return language == "Marathi" ? (
    details?.type === "customer" ? (
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
                      {(e.price
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
                  <td className="border p-1 text-center">
                    {e.discountedPrice}
                  </td>
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
            आपला बाजार भेट दिल्याबद्दल धन्यवाद!
          </p>
        </div>
      </div>
    ) : (
      details && (
        <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
          <div
            ref={componentRef}
            className="max-w-4xl mx-auto p-4 bg-white text-black"
          >
            <div
              className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}
            >
              <div className="flex flex-col items-start ">
                <h1 className="text-2xl font-bold mt-2">
                  {invoiceDetails.title}
                </h1>
                {settings.displayOptions.address &&
                  invoiceDetails.address.map((line, index) => (
                    <p
                      key={index}
                      dangerouslySetInnerHTML={{ __html: line }}
                    ></p>
                  ))}
              </div>
              {settings.displayOptions.showLogo && (
                <div className="w-24 h-24 border flex items-center justify-center">
                  <img src={settings.Logo || logo} alt="लोगो वरती घाला" />
                </div>
              )}
            </div>
            <div
              className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}
            >
              {settings.displayOptions.showQR && (
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
                    <td className="border p-1 truncate">
                      {e.productId?.title}
                    </td>
                    <td className="border p-1 text-center">{e.quantity}</td>
                    <td className="border p-1 text-center">
                      {(e.purchaseRate / e.quantity).toFixed(2)}
                    </td>
                    <td className="border p-1 text-center">{e.GST}</td>
                    <td className="border p-1 text-center">
                      {e.purchaseRate * e.quantity}
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

                <div
                  className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
                >
                  <span>जीएसटी</span>
                  <span>₹{details.GST}</span>
                </div>
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
            <p className="text-center font-bold">
              आपल्या व्यवसायासाठी धन्यवाद!
            </p>
          </div>
        </div>
      )
    )
  ) : details?.type === "customer" ? (
    <div className="invoice__preview mt-20 bg-white p-5 w-32 rounded-2xl border-4 border-blue-200">
      <div
        ref={componentRef}
        className="max-w-4xl flex flex-col items-center mx-auto p-4 bg-white text-black"
      >
        {settings.displayOptions.showLogo && (
          <div className="w-24 h-24 border flex items-center justify-center">
            <img src={settings.Logo || logo} alt="Insert Logo Above" />
          </div>
        )}

        <div
          className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4} justify-center`}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mt-2">
              {invoiceDetailEngilsh.title}
            </h1>
            {settings.displayOptions.address &&
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

        <table className="w-full border-collapse border mb-2 text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-1">Description</th>
              <th className="border p-1">Quantity</th>
              {settings.productDataVisibility.unitPrice && (
                <th className="border p-1">Unit Price</th>
              )}
              {settings.productDataVisibility.GST && (
                <th className="border p-1">GST</th>
              )}
              {settings.productDataVisibility.Discount && (
                <th className="border p-1">Discount</th>
              )}
              {settings.productDataVisibility.price && (
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
                    {(e.price
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
                <span>Total</span>
                <span>₹{details.totalPrice}</span>
              </div>
            )}
            {settings.displayOptions.showDiscount && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>Discount</span>
                <span>₹{details.discount}</span>
              </div>
            )}
            {settings.displayOptions.showGST && (
              <div
                className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}
              >
                <span>GST</span>
                <span>₹{details.GST}</span>
              </div>
            )}
            {settings.displayOptions?.showPayType && (
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

        <p className="text-center font-bold">Thank you for shopping with us!</p>
      </div>
    </div>
  ) : (
    details && (
      <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
        <div
          ref={componentRef}
          className="max-w-4xl mx-auto p-4 bg-white text-black"
        >
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
                    <p >
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
                    {(e.purchaseRate / e.quantity).toFixed(2)}
                  </td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">
                    {e.purchaseRate * e.quantity}
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
            {/* <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2> */}
            <div
              className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}
            ></div>
          </div>
          <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
        </div>
      </div>
    )
  );
};

export default Invoice;
