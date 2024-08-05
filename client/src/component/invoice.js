// import React ,{useState,useEffect}from 'react';
// import logo from "../logo.png";
// import Barcode from 'react-barcode';
// const Invoice = ({ componentRef, details }) => {
//   const [currentDate, setCurrentDate] = useState('');
//     const sharedClasses = {
//         flex: 'flex ',
//         justifyBetween: 'justify-between',
//         itemsCenter: 'items-center',
//         mb4: 'mb-4',
//         border: 'border text-center',
//         p2: 'p-2',
//         fontBold:'font-bold',
//       };
//       useEffect(() => {
//         // Get the current date in the required format (YYYY-MM-DD)
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
//         const day = String(today.getDate()).padStart(2, '0');
//         const formattedDate = `${year}-${month}-${day}`;
    
//         // Set the current date as the default value
//         setCurrentDate(formattedDate);
//       }, []);
//       console.log(details)  

// //   return (
// //     details&&details.type=="customer"?
// //     <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200 hidden">
// //       <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
// //         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
// //           <div>
// //             <h1 className="text-2xl font-bold mb-4">AAPLA BAJAR</h1>
// //             <p>AAPLA BAJAR</p>
// //             <p>SHRIGONDA, AHMADNAGAR</p>
// //             <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
// //             <p>PHONE:9423750349</p>
// //             <p>EMAIL:aaplabajar@gmail.com</p>
// //           </div>
// //           <div className="w-24 h-24 border flex items-center justify-center">
// //             <img src={logo} alt="Insert Logo Above" />
// //           </div>
// //         </div>
// //         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
// //         <div>
// //             <span className={sharedClasses.fontBold}>INVOICE: </span>
// //             <div><Barcode value={details._id} width={0.8} // Adjust the width of the bars
// //             height={70}   /></div>
// //           </div>
// //           <div>
// //             <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
// //             <span>{currentDate}</span>
// //           </div>
// //         </div>
// //         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
// //           <div className="w-1/2 pr-2">
// //             <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
// //             <p>{details.Name?.toUpperCase()}</p>
// //             <p>{details.Address?.toUpperCase()}</p>
// //             <p>PHONE:{details.mobileNumber}</p>
// //             <p>EMAIL:{details.email}</p>
// //           </div>
// //         </div>
// //         <table className="w-full border-collapse border mb-4">
// //           <thead>
// //             <tr className="bg-black text-white">
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>DESCRIPTION</th>
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>QUANTITY</th>
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>GST</th>
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>DISCOUNT</th>
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>PRICE</th>
// //               <th className={sharedClasses.border + " " + sharedClasses.p2}>UNIT PRICE</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {details?.orderItems?.map((e, index) => (
// //               <tr key={index}>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.product?.title }</td>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2 + "h-12"}>{e.quantity}</td>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.GST}</td>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2}>{(e.price - e.discountedPrice)}</td>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.price}</td>
// //                 <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.discountedPrice}</td>
                
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         <div className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}>
// //           <div className="w-1/4">
// //             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
// //               <span>SUBTOTAL</span>
// //               <span>₹{details.totalPrice}</span>
// //             </div>
// //             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
// //               <span>DISCOUNT</span>
// //               <span>₹{(details.totalPrice-details.totalDiscountedPrice)}</span>
// //             </div>
// //             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
// //               <span>GST</span>
// //               <span>₹{details.GST}</span>
// //             </div>
// //             <div>
// //       <span>PAYMENT BY</span>
// //       <span>Cash:₹{details.paymentType.cash}</span>
// //       <span>Card:₹{details.paymentType.Card}</span>
// //       <span>UPI:₹{details.paymentType.UPI}</span>
// //       <span>Borrow:₹{details.paymentType?.borrow}</span>
// //       </div>
// //             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
// //               <span>Amount Pay</span>
// //               <span>₹{details.finalPriceWithGST}</span>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="mb-4">
// //           <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
// //           <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
// //         </div>
// //         <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
// //       </div>
// //     </div>
// //     :
// // details && (
// //   <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200 hidden">
// //      <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
// //   <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
// //     <div>
// //       <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
// //       <p>APALA BAJAR</p>
// //       <p>SHRIGONDA, AHMADNAGAR</p>
// //       <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
// //       <p>PHONE: 9849589588</p>
// //       <p>EMAIL: aaplabajar1777@gmail.com</p>
// //     </div>
// //     <div className="w-24 h-24 border flex items-center justify-center">
// //       <img src={logo} alt="Insert Logo Above" />
// //     </div>
// //   </div>
// //   <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
// //     <div>
// //       <span className={sharedClasses.fontBold}>INVOICE: </span>
// //       <div><Barcode value={details._id} width={0.8} // Adjust the width of the bars
// //       height={70}   /></div>
// //     </div>
// //     <div>
// //       <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
// //       <span>{details.updatedAt?.substring(0, 10)}</span>
// //     </div>
// //   </div>
// //   <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
// //     <div className="w-1/2 pr-2">
// //       <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
// //       <p>{details.Name?.toUpperCase()}</p>
// //       <p>{details.Address?.toUpperCase()}</p>
// //       <p>PHONE:{details.mobileNumber}</p>
// //       <p>EMAIL:{details.email}</p>
// //     </div>
// //   </div>
// //   <table className="w-full border-collapse border mb-4">
// //     <thead>
// //       <tr className="bg-black text-white">
// //         <th className={sharedClasses.border + " " + sharedClasses.p2}>DESCRIPTION</th>
// //         <th className={sharedClasses.border + " " + sharedClasses.p2}>QUANTITY</th>
// //         <th className={sharedClasses.border + " " + sharedClasses.p2}>PURCHASE PRICE</th>
// //         <th className={sharedClasses.border + " " + sharedClasses.p2}>RETAIL PRICE</th>
// //         <th className={sharedClasses.border + " " + sharedClasses.p2}>UNIT PRICE</th>
// //       </tr>
// //     </thead>
// //     <tbody>
// //       {details.orderItems?.map((e, index) => (
// //         <tr key={index}>
// //           <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.productId?.title}</td>
// //           <td className={sharedClasses.border + " " + sharedClasses.p2 + "h-12"}>{e.quantity}</td>
// //           <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.purchaseRate} </td>
// //           <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.retailPrice}</td>
// //           <td className={sharedClasses.border + " " + sharedClasses.p2}>{e.retailPrice}</td>
          
// //         </tr>
// //       ))}
// //     </tbody>
// //   </table>
// //   <div className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}>
// //     <div className="w-1/4">
// //       <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
// //         <span>SUBTOTAL</span>
// //         <span>₹{details.totalPurchaseRate}</span>
// //       </div>
// //       <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
// //         <span>TOTAL ITEMS</span>
// //         <span>₹{details.totalItem}</span>
// //       </div>
// //       <div>
// //       <span>PAYMENT BY</span>
// //       <div className='flex ml-5'>
// //       <span>Cash:₹{details.paymentType?.cash}</span>
// //       <span>Card:₹{details.paymentType?.Card}</span>
// //       <span>UPI:₹{details.paymentType?.UPI}</span>
// //       <span>Borrow:₹{details.paymentType?.borrow}</span>
// //       </div>
// //       </div>
// //       <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
// //         <span>Amount Pay</span>
// //         <span>₹{details.totalPurchaseRate}</span>
// //       </div>
// //     </div>
// //   </div>
// //   <div className="mb-4">
// //     <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
// //     <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
// //   </div>
// //   <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
// // </div>
// //   </div>
// // )
// //   );

// return (
//   details && details.type === "customer" ? (
//     <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200">
//       <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
//         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
//           <div className="w-24 h-24 border flex items-center justify-center">
//             <img src={logo} alt="Insert Logo Above" />
//           </div>
//           <div className='flex flex-col items-center'>
//             <h1 className="text-2xl font-bold mt-2">AAPLA BAJAR</h1>
//             <p>SHRIGONDA, AHMADNAGAR</p>
//             <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
//             <p>PHONE: 9423750349</p>
//             <p>EMAIL: aaplabajar@gmail.com</p>
//           </div>
//         </div>
//         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
//           <div>
//             <span className={sharedClasses.fontBold}>INVOICE: </span>
//             <div><Barcode value={details._id} width={0.8} height={70} /></div>
//           </div>
//           <div>
//             <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
//             <span>{currentDate}</span>
//           </div>
//         </div>
//         <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
//           <div className="w-1/2 pr-2">
//             <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
//             <p>{details.Name?.toUpperCase()}</p>
//             <p>{details.Address?.toUpperCase()}</p>
//             <p>PHONE: {details.mobileNumber}</p>
//             <p>EMAIL: {details.email}</p>
//           </div>
//         </div>
//         <table className="w-full border-collapse border mb-2 text-xs">
//           <thead>
//             <tr className="bg-gray-800 text-white">
//               <th className="border p-1">DESCRIPTION</th>
//               <th className="border p-1">QUANTITY</th>
//               <th className="border p-1">GST</th>
//               <th className="border p-1">DISCOUNT</th>
//               <th className="border p-1">PRICE</th>
//               <th className="border p-1">UNIT PRICE</th>
//             </tr>
//           </thead>
//           <tbody>
//             {details?.orderItems?.map((e, index) => (
//               <tr key={index}>
//                 <td className="border p-1 truncate">{e.product?.title}</td>
//                 <td className="border p-1 text-center">{e.quantity}</td>
//                 <td className="border p-1 text-center">{e.GST}</td>
//                 <td className="border p-1 text-center">{(e.price - e.discountedPrice)}</td>
//                 <td className="border p-1 text-center">{e.price}</td>
//                 <td className="border p-1 text-center">{e.discountedPrice}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}>
//           <div className="w-full">
//             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//               <span>SUBTOTAL</span>
//               <span>₹{details.totalPrice}</span>
//             </div>
//             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//               <span>DISCOUNT</span>
//               <span>₹{(details.totalPrice - details.totalDiscountedPrice)}</span>
//             </div>
//             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//               <span>GST</span>
//               <span>₹{details.GST}</span>
//             </div>
//             <div className='flex flex-col items-center'>
//               <span className='font-semibold'>PAYMENT BY</span>
//               <div className='flex flex-col w-full'>
//                 <div className='flex justify-between'><span>Cash:</span><span> ₹{details.paymentType.cash}</span></div>
//                 <div className='flex justify-between'><span>Card:</span><span>₹{details.paymentType.Card}</span></div>
//                 <div className='flex justify-between'><span>UPI:</span><span>₹{details.paymentType.UPI}</span></div>
//                 <div className='flex justify-between'><span>Borrow:</span><span>₹{details.paymentType.borrow}</span></div>
//               </div>
//             </div>
//             <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
//               <span>Amount Pay </span>
//               <span>₹{details.finalPriceWithGST}</span>
//             </div>
//           </div>
//         </div>
//         <div className="mb-4">
//           <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
//           <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
//         </div>
//         <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
//       </div>
//     </div>
//   ) : (
//     details && (
//       <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200 hidden">
//         <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
//           <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
//             <div>
//               <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
//               <p>APALA BAJAR</p>
//               <p>SHRIGONDA, AHMADNAGAR</p>
//               <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
//               <p>PHONE: 9849589588</p>
//               <p>EMAIL: aaplabajar1777@gmail.com</p>
//             </div>
//             <div className="w-24 h-24 border flex items-center justify-center">
//               <img src={logo} alt="Insert Logo Above" />
//             </div>
//           </div>
//           <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
//             <div>
//               <span className={sharedClasses.fontBold}>INVOICE: </span>
//               <div><Barcode value={details._id} width={0.8} height={70} /></div>
//             </div>
//             <div>
//               <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
//               <span>{details.updatedAt?.substring(0, 10)}</span>
//             </div>
//           </div>
//           <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
//             <div className="w-1/2 pr-2">
//               <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
//               <p>{details.Name?.toUpperCase()}</p>
//               <p>{details.Address?.toUpperCase()}</p>
//               <p>PHONE: {details.mobileNumber}</p>
//               <p>EMAIL: {details.email}</p>
//             </div>
//           </div>
//           <table className="w-full border-collapse border mb-4 text-xs">
//             <thead>
//               <tr className="bg-gray-800 text-white">
//                 <th className="border p-1">DESCRIPTION</th>
//                 <th className="border p-1">QUANTITY</th>
//                 <th className="border p-1">PURCHASE PRICE</th>
//                 <th className="border p-1">RETAIL PRICE</th>
//                 <th className="border p-1">UNIT PRICE</th>
//               </tr>
//             </thead>
//             <tbody>
//               {details.orderItems?.map((e, index) => (
//                 <tr key={index}>
//                   <td className="border p-1 truncate">{e.productId?.title}</td>
//                   <td className="border p-1 text-center">{e.quantity}</td>
//                   <td className="border p-1 text-center">{e.purchaseRate}</td>
//                   <td className="border p-1 text-center">{e.retailPrice}</td>
//                   <td className="border p-1 text-center">{e.retailPrice}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className={`${sharedClasses.flex} w-full justify-center ${sharedClasses.mb4}`}>
//             <div className="w-full">
//               <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//                 <span>SUBTOTAL</span>
//                 <span>₹{details.totalPurchaseRate}</span>
//               </div>
//               <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//                 <span>TOTAL ITEMS</span>
//                 <span>₹{details.totalItem}</span>
//               </div>
//               <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
//                 <span>GST</span>
//                 <span>₹{details.GST}</span>
//               </div>
//               <div className='flex flex-col items-center'>
//                 <span className='font-semibold'>PAYMENT BY</span>
//                 <div className='flex flex-col w-full'>
//                   <div className='flex justify-between'><span>Cash:</span><span> ₹{details.paymentType?.cash}</span></div>
//                   <div className='flex justify-between'><span>Card:</span><span>₹{details.paymentType?.Card}</span></div>
//                   <div className='flex justify-between'><span>UPI:</span><span>₹{details.paymentType?.UPI}</span></div>
//                   <div className='flex justify-between'><span>Borrow:</span><span>₹{details.paymentType?.borrow}</span></div>
//                 </div>
//               </div>
//               <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
//                 <span>Amount Pay</span>
//                 <span>₹{details.totalPurchaseRate}</span>
//               </div>
//             </div>
//           </div>
//           <div className="mb-4">
//             <h2 className={sharedClasses.fontBold}>TERMS & CONDITIONS:</h2>
//             <div className={`${sharedClasses.border} ${sharedClasses.p2} h-24`}></div>
//           </div>
//           <p className="text-center font-bold">THANK YOU FOR YOUR BUSINESS!</p>
//         </div>
//       </div>
//     )
//   );




// };

// export default Invoice;

import React, { useState, useEffect } from 'react';
import logo from "../logo.png";
import Barcode from 'react-barcode';
const Invoice = ({ componentRef, details,setPrint}) => {
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
        if (setPrint) {
          setPrint(false);
        }
        // Set the current date as the default value
        setCurrentDate(formattedDate);
      }, []);
      console.log(details)  

   
  return (
    details?.type === "customer" ? (
      <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200">
        <div ref={componentRef} className="max-w-4xl mx-auto p-4 bg-white text-black">
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
            <div className="w-24 h-24 border flex items-center justify-center">
              <img src={logo} alt="Company Logo" />
            </div>
            <div className='flex flex-col items-center'>
              <h1 className="text-2xl font-bold mt-2">AAPLA BAJAR</h1>
              <p>SHRIGONDA, AHMADNAGAR</p>
              <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
              <p>PHONE: 9423750349</p>
              <p>EMAIL: aaplabajar@gmail.com</p>
            </div>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
            <div>
              <span className={sharedClasses.fontBold}>INVOICE: </span>
              <Barcode value={details._id} width={0.8} height={70} />
            </div>
            <div>
              <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
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
                <th className="border p-1">GST</th>
                <th className="border p-1">DISCOUNT</th>
                <th className="border p-1">PRICE</th>
                <th className="border p-1">UNIT PRICE</th>
              </tr>
            </thead>
            <tbody>
              {details.orderItems?.map((e, index) => (
                <tr key={index}>
                  <td className="border p-1 truncate">{e.product?.title}</td>
                  <td className="border p-1 text-center">{e.quantity}</td>
                  <td className="border p-1 text-center">{e.GST}</td>
                  <td className="border p-1 text-center">{(e.price - e.discountedPrice)}</td>
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
                <span>₹{(details.totalPrice - details.totalDiscountedPrice)}</span>
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
                <span>₹{details.finalPriceWithGST}</span>
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
    ) : (
      details && (
        <div className="invoice__preview mt-20 bg-white p-5 w-fit rounded-2xl border-4 border-blue-200">
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
                <Barcode value={details._id} width={0.8} height={70} />
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
                  <th className="border p-1">GST</th>
                  <th className="border p-1">DISCOUNT</th>
                  <th className="border p-1">PRICE</th>
                  <th className="border p-1">UNIT PRICE</th>
                </tr>
              </thead>
              <tbody>
                {details.orderItems?.map((e, index) => (
                  <tr key={index}>
                    <td className="border p-1 truncate">{e.product?.title}</td>
                    <td className="border p-1 text-center">{e.quantity}</td>
                    <td className="border p-1 text-center">{e.GST}</td>
                    <td className="border p-1 text-center">{(e.price - e.discountedPrice)}</td>
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
                  <span>₹{(details.totalPrice - details.totalDiscountedPrice)}</span>
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
                  <span>₹{details.finalPriceWithGST}</span>
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
  );
};

export default Invoice;
