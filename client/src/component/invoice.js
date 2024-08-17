import React, { useState, useEffect } from 'react';
import logo from "../logo.png";
import Barcode from 'react-barcode';
const Invoice = ({ componentRef, details,setPrint,language}) => {
  const [currentDate, setCurrentDate] = useState('');
    const sharedClasses = {
        flex: 'flex ',
        justifyBetween: 'justify-between',
        itemsCenter: 'items-center',
        mb4: 'mb-4',
        border: 'border text-center',
        p2: 'p-2',
        fontBold:'font-bold',
      };

      useEffect(() => {
        // Get the current date in the required format (YYYY-MM-DD)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // if (setPrint) {
        //   setPrint(false);
        // }
        // Set the current date as the default value
        setCurrentDate(formattedDate);
      }, []);
      console.log(details)  

   
  return (
    (language=='Marathi')? (details?.type === "customer" ? (
      <div className="invoice__preview mt-20 bg-white p-5  w-32 rounded-2xl border-4 border-blue-200">
        <div ref={componentRef} className="max-w-4xl flex flex-col items-center mx-auto p-4 bg-white text-black">
          <div className="w-24 h-24 border flex items-center justify-center">
            <img src={logo} alt="लोगो वरती घाला" />
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4} justify-center`}>
            <div className='flex flex-col items-center'>
              <h1 className="text-2xl font-bold mt-2">आपला बाजार</h1>
              <p>श्रीगोंदा, अहमदनगर</p>
              <p>ग्राहक सेवा +91 9576383726</p>
              {/* <p>अहमदनगर, महाराष्ट्र, 444002</p>
              <p>फोन: 9423750349</p>
              <p>ईमेल: aaplabajar@gmail.com</p> */}
            </div>
          </div>
          <div className={`${sharedClasses.flex} flex-col w-full ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
            <div>
              <span className={sharedClasses.fontBold}>चलन दिनांक: </span>
              <span>{currentDate}</span>
            </div>
          </div>
          <div className={`${sharedClasses.flex} justify-self-start  w-full ${sharedClasses.mb4}`}>
            <div className="w-full flex gap-4 pr-2">
              <div><h2 className={sharedClasses.fontBold}>चलन प्राप्तकर्ता:   </h2></div>
              <div><p>{details.Name?.toUpperCase()}</p></div>
              {/* <p>{details.Address?.toUpperCase()}</p> */}
              {/* <p>फोन: {details.mobileNumber}</p>
              <p>ईमेल: {details.email}</p> */}
            </div>
          </div>
          <table className="w-full border-collapse border mb-2 text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-1">वर्णन</th>
                <th className="border p-1">प्रमाण</th>
                <th className="border p-1">युनिट किंमत</th>
                <th className="border p-1">जीएसटी</th>
                <th className="border p-1">सवलत</th>
                <th className="border p-1">किंमत</th>
                <th className="border p-1">सवलतीनंतरची किंमत</th>
              </tr>
            </thead>
            <tbody>
              {details?.orderItems?.map((e, index) => (
                <tr key={index}>
                  <td className="border p-1 truncate">{e.product?.title}</td>
                  <td className="border p-1 text-center">{e.quantity}</td>
                  <td className="border p-1 text-center">{(e.discountedPrice/e.quantity)}</td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">{((e.price != 0) ? e.price - e.discountedPrice : (e.product.discountedPrice - (e.discountedPrice / e.quantity)) * e.quantity)}</td>
                  <td className="border p-1 text-center">{e.price}</td>
                  <td className="border p-1 text-center">{e.discountedPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
    
          <div className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}>
            <div className="w-full">
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>उपयोगिता</span>
                <span>₹{details.totalPrice}</span>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>सवलत</span>
                <span>₹{details.discount}</span>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>जीएसटी</span>
                <span>₹{details.GST}</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-semibold'>पेमेंट कसे केले</span>
                <div className='flex flex-col w-full'>
                  {details.paymentType.cash > 0 && <div className='flex justify-between'><span>नगद:</span><span> ₹{details.paymentType.cash}</span></div>}
                  {details.paymentType.Card > 0 && <div className='flex justify-between'><span>कार्ड:</span><span>₹{details.paymentType.Card}</span></div>}
                  {details.paymentType.UPI > 0 && <div className='flex justify-between'><span>यूपीआय:</span><span>₹{details.paymentType.UPI}</span></div>}
                  {details.paymentType.borrow > 0 && <div className='flex justify-between'><span>उधार:</span><span>₹{details.paymentType.borrow}</span></div>}
                </div>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
                <span>प्रदान रक्कम </span>
                <span>₹{details.finalPriceWithGST}</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            {/* <h2 className={sharedClasses.fontBold}>अटी व शर्ती:</h2> */}
            {/* <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div> */}
          </div>
          <div>
            {/* <span className={sharedClasses.fontBold}>चलन: </span> */}
            <div>
              <Barcode value={details._id} width={1.5} height={40} displayValue={false} />
            </div>
          </div>
          <p className="text-center font-bold">आपला बाजार भेट दिल्याबद्दल धन्यवाद!</p>
        </div>
      </div>
    ) : (
      details && (
        <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
          <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
              <div>
                {/* <h1 className="text-2xl font-bold mb-4">चलन</h1> */}
                <h1 className="text-2xl font-bold mt-2">आपला बाजार</h1>
                <p>आपला बाजार</p>
                <p>श्रीगोंदा, अहमदनगर</p>
                <p>अहमदनगर, महाराष्ट्र, 444002</p>
                <p>फोन: 9849589588</p>
                <p>ईमेल: aaplabajar1777@gmail.com</p>
              </div>
              <div className="w-24 h-24 border flex items-center justify-center">
                <img src={logo} alt="कंपनी लोगो" />
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
              <div>
                <span className={sharedClasses.fontBold}>चलन क्रमांक: </span>
                <Barcode displayValue={false} value={details._id} width={0.8} height={70} />
              </div>
              <div>
                <span className={sharedClasses.fontBold}>दिनांक: </span>
                <span>{currentDate}</span>
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
              <div className="w-1/2 pr-2">
                <h2 className={sharedClasses.fontBold}>चलन प्राप्तकर्ता:</h2>
                <p>{details.Name?.toUpperCase()}</p>
                <p>{details.Address?.toUpperCase()}</p>
                <p>फोन: {details.mobileNumber}</p>
                <p>ईमेल: {details.email}</p>
              </div>
            </div>
            <table className="w-full border-collapse border mb-2 text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-1">वर्णन</th>
                  <th className="border p-1">प्रमाण</th>
                  <th className="border p-1">युनिट किंमत</th>
                  <th className="border p-1">किंमत</th>
                </tr>
              </thead>
              <tbody>
                {details?.orderItems?.map((e, index) => (
                  <tr key={index}>
                    <td className="border p-1 truncate">{e.product?.title}</td>
                    <td className="border p-1 text-center">{e.quantity}</td>
                    <td className="border p-1 text-center">{e.price}</td>
                    <td className="border p-1 text-center">{e.price * e.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
    
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
              <div>
                <span className={sharedClasses.fontBold}>उपयोगिता </span>
              </div>
              <div>
                <span>₹{details.totalPrice}</span>
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
              <div>
                <span className={sharedClasses.fontBold}>सवलत </span>
              </div>
              <div>
                <span>₹{details.discount}</span>
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
              <div>
                <span className={sharedClasses.fontBold}>कर </span>
              </div>
              <div>
                <span>₹{details.GST}</span>
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
              <div>
                <span>प्रदान रक्कम </span>
              </div>
              <div>
                <span>₹{details.finalPriceWithGST}</span>
              </div>
            </div>
            <div className="mb-4">
              <h2 className={sharedClasses.fontBold}>अटी व शर्ती:</h2>
              <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
            </div>
          </div>
        </div>
      )
    )):(details?.type === "customer" ? (
   

      <div className="invoice__preview mt-20 bg-white p-5  w-32 rounded-2xl border-4 border-blue-200">
        <div  ref={componentRef} className="max-w-4xl flex flex-col items-center mx-auto p-4 bg-white text-black">
            <div className="w-24 h-24 border flex items-center justify-center">
              <img src={logo} alt="Insert Logo Above" />
            </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4} justify-center`}>
            <div className='flex flex-col items-center'>
              <h1 className="text-2xl font-bold mt-2">APLA BAJAR</h1>
              <p>SHRIGONDA, AHMADNAGAR</p>
              <p>Customer Care +91 9576383726</p>
              {/* <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
              <p>PHONE: 9423750349</p>
              <p>EMAIL: aaplabajar@gmail.com</p> */}
            </div>
            
          </div>
          <div className={`${sharedClasses.flex} flex-col w-full ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
            
            <div>
              <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
              <span>{currentDate}</span>
            </div>
            
          </div>
          <div className={`${sharedClasses.flex} justify-self-start  w-full ${sharedClasses.mb4}`}>
            <div className="w-full flex gap-4 pr-2">
              <div><h2 className={sharedClasses.fontBold}>BILL TO:   </h2></div>
              <div><p>{details.Name?.toUpperCase()}</p></div>
              {/* <p>{details.Address?.toUpperCase()}</p> */}
              {/* <p>PHONE:{details.mobileNumber}</p>
              <p>EMAIL:{details.email}</p> */}
            </div>
          </div>
          <table className="w-full border-collapse border mb-2 text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-1">DESCRIPTION</th>
                <th className="border p-1">QUANTITY</th>
                <th className="border p-1">UNIT PRICE</th>
                <th className="border p-1">GST</th>
                <th className="border p-1">DISCOUNT</th>
                <th className="border p-1">PRICE</th>
                <th className="border p-1">DISCOUNTEDPRICE</th>
              </tr>
            </thead>
            <tbody>
              {details?.orderItems?.map((e, index) => (
                <tr key={index}>
                  <td className="border p-1 truncate">{e.product?.title}</td>
                  <td className="border p-1 text-center">{e.quantity}</td>
                  <td className="border p-1 text-center">{(e.discountedPrice/e.quantity)}</td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">{((e.price!=0)? e.price - e.discountedPrice : (e.product.discountedPrice-(e.discountedPrice/e.quantity))*e.quantity)}</td>
                  <td className="border p-1 text-center">{e.price}</td>
                  <td className="border p-1 text-center">{e.discountedPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}>
            <div className="w-full">
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>SUBTOTAL</span>
                <span>₹{details.totalPrice}</span>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>DISCOUNT</span>
                <span>₹{details.discount}</span>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                <span>GST</span>
                <span>₹{details.GST}</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-semibold'>PAYMENT BY</span>
                <div className='flex flex-col w-full'>
                  {details.paymentType.cash > 0 && <div className='flex justify-between'><span>Cash:</span><span> ₹{details.paymentType.cash}</span></div>}
                  {details.paymentType.Card > 0 && <div className='flex justify-between'><span>Card:</span><span>₹{details.paymentType.Card}</span></div>}
                  {details.paymentType.UPI > 0 && <div className='flex justify-between'><span>UPI:</span><span>₹{details.paymentType.UPI}</span></div>}
                  {details.paymentType.borrow > 0 && <div className='flex justify-between'><span>Borrow:</span><span>₹{details.paymentType.borrow}</span></div>}
                </div>
              </div>
              <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
                <span>Amount Pay </span>
                <span>₹{details.finalPriceWithGST}</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            {/* <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2> */}
            {/* <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div> */}
          </div>
          <div>
            {/* <span className={sharedClasses.fontBold}>INVOICE: </span> */}
            <div>
              <Barcode value={details._id} width={1.5} height={40} displayValue={false} />
              </div>
          </div>
          <p className="text-center font-bold">THANK YOU FOR VISITING APALA BAJAR!</p>
        </div>
      </div>
    ) : (
      details && (
        <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
          <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
              <div>
                {/* <h1 className="text-2xl font-bold mb-4">INVOICE</h1> */}
               <h1 className="text-2xl font-bold mt-2">AAPLA BAJAR</h1>
                <p>APALA BAJAR</p>
                <p>SHRIGONDA, AHMADNAGAR</p>
                <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
                <p>PHONE: 9849589588</p>
                <p>EMAIL: aaplabajar1777@gmail.com</p>
              </div>
              <div className="w-24 h-24 border flex items-center justify-center">
                <img src={logo} alt="Company Logo" />
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
              <div>
                <span className={sharedClasses.fontBold}>INVOICE NO: </span>
                <Barcode displayValue={false} value={details._id} width={0.8} height={70} />
              </div>
              <div>
                <span className={sharedClasses.fontBold}>DATE: </span>
                <span>{currentDate}</span>
              </div>
            </div>
            <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
              <div className="w-1/2 pr-2">
                <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
                <p>{details.Name?.toUpperCase()}</p>
                <p>{details.Address?.toUpperCase()}</p>
                <p>PHONE: {details.mobileNumber}</p>
                <p>EMAIL: {details.email}</p>
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
                  <td className="border p-1 text-center">{(e.purchaseRate/e.quantity).toFixed(2) }</td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">{e.purchaseRate * e.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
            <div className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}>
              <div className="w-full">
                <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                  <span>SUBTOTAL</span>
                  <span>₹{details.totalPurchaseRate}</span>
                </div>
              
                <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
                  <span>GST</span>
                  <span>₹{details.GST}</span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='font-semibold'>PAYMENT BY</span>
                  <div className='flex flex-col w-full'>
                    <div className='flex justify-between'><span>Cash:</span><span> ₹{details.paymentType?.cash}</span></div>
                    <div className='flex justify-between'><span>Card:</span><span>₹{details.paymentType?.Card}</span></div>
                    <div className='flex justify-between'><span>UPI:</span><span>₹{details.paymentType?.UPI}</span></div>
                    <div className='flex justify-between'><span>Borrow:</span><span>₹{details.paymentType?.borrow}</span></div>
                  </div>
                </div>
                <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
                  <span>Amount Pay</span>
                  <span>₹{details.AmountPaid }</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
              <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
            </div>
            <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
          </div>
        </div>
      )
    )    
  )
)
};

export default Invoice;


   




