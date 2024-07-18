import React, { useRef,useEffect,useState} from 'react';
import { FaBarcode } from 'react-icons/fa'; // Import the barcode icon from react-icons
import ReactToPrint from "react-to-print";
import logo from '../logo.png'
const Purchase = () => {
  const sharedClasses = {
    flex: 'flex',
    justifyBetween: 'justify-between',
    itemsCenter: 'items-center',
    mb4: 'mb-4',
    border: 'border text-center',
    p2: 'p-2',
    fontBold: 'font-bold',
  }
  const [list, setList] = useState([]);
  const [total, setTotal] = useState();
  const [GST, setGST] = useState();
  const [discount, setDiscount] = useState();

  const details=[{
    id:99048945534,
    description:"product name 1",
    quantity:2,
    discount:2,
    gst:2,
    price:100
  },
  {
    id:99048945049,
    description:"product name 2",
    quantity:1,
    discount:5,
    gst:4,
    price:34,

  },
  {
    id:99048945545,
    description:"product name 3",
    quantity:3,
    discount:3,
    gst:1,
    price:18,

  },
  {
    id:990489454954,
    description:"product name 4",
    quantity:4,
    discount:12,
    gst:2,
    price:20,

  }
  ]
  useEffect(() => {
    setList(details);
    const totalAmount = details.reduce((total, item) => total + (item.price*item.quantity), 0);
    const disc = details.reduce((total, item) => total + (item.discount*item.quantity), 0);
    const GST = details.reduce((total, item) => total + ((item.price*item.gst/100)*item.quantity), 0);
    setTotal(totalAmount);
    setGST(GST);
    setDiscount(disc);
  }, []);
  const componentRef = useRef();
  return (
    <div className="bg-gray-100 mt-20 p-6 rounded-lg shadow-lg">
      <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-lg font-bold">Purchase</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className='font-bold'>salescounter1</span></span>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">LogOut</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium">Type</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Purchase</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Invoice</label>
            <input type="date" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ref.</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Mobile</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">GST No.</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ship To</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">State</label>
            <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Maharashtra (27)</option>
            </select>
          </div>
        </div>
        
        {/* New Input Fields */}
        <div className="flex flex-nowrap bg-gray-200 px-3 pt-3 rounded-md space-x-2 mb-6">
          <div className=" mb-4">
            <label htmlFor="list" className="block text-gray-700 text-sm font-medium">List</label>
            <input type="checkbox" id="list" className="border border-gray-300 rounded p-2" />
          </div>
          <div className=" m-4">
            <FaBarcode className='h-12'/>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="barcode" className="block text-gray-700 text-sm font-medium">Barcode</label>
            <input type="text" id="barcode" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter barcode" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="brand" className="block text-gray-700 text-sm font-medium">Brand</label>
            <input type="text" id="brand" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter brand" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-medium">Description</label>
            <input type="text" id="description" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter description" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-medium">Category</label>
            <input type="text" id="category" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter category" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="stock-type" className="block text-gray-700 text-sm font-medium">Stock Type</label>
            <input type="text" id="stock-type" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter stock type" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="unit" className="block text-gray-700 text-sm font-medium">Unit</label>
            <input type="text" id="unit" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter unit" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="qty" className="block text-gray-700 text-sm font-medium">Qty</label>
            <input type="text" id="qty" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter quantity" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="purchase-rate" className="block text-gray-700 text-sm font-medium">Purchase Rate</label>
            <input type="text" id="purchase-rate" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter purchase rate" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="profit" className="block text-gray-700 text-sm font-medium">Profit%</label>
            <input type="text" id="profit" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter profit percentage" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="hsn" className="block text-gray-700 text-sm font-medium">HSN</label>
            <input type="text" id="hsn" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter HSN" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="gst" className="block text-gray-700 text-sm font-medium">GST%</label>
            <input type="text" id="gst" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter GST percentage" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="total" className="block text-gray-700 text-sm font-medium">Total</label>
            <input type="text" id="total" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter total amount" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label htmlFor="amount-paid" className="block text-gray-700 text-sm font-medium">Amount Paid</label>
            <input type="text" id="amount-paid" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter amount paid" />
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/6 ml-6 my-6">
            <button className='bg-blue-600 text-white p-2 rounded-md'>Enter</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="bg-gray-300 text-gray-600">
                <th className="p-3 border border-gray-600 text-left">List</th>
                <th className="p-3 border border-gray-600 text-left">Barcode</th>
                <th className="p-3 border border-gray-600 text-left">Brand</th>
                <th className="p-3 border border-gray-600 text-left">Description</th>
                <th className="p-3 border border-gray-600 text-left">Category</th>
                <th className="p-3 border border-gray-600 text-left">Stock Type</th>
                <th className="p-3 border border-gray-600 text-left">Unit</th>
                <th className="p-3 border border-gray-600 text-left">Qty</th>
                <th className="p-3 border border-gray-600 text-left">Purchase Rate</th>
                <th className="p-3 border border-gray-600 text-left">Profit%</th>
                <th className="p-3 border border-gray-600 text-left">HSN</th>
                <th className="p-3 border border-gray-600 text-left">GST%</th>
                <th className="p-3 border border-gray-600 text-left">Total</th>
                <th className="p-3 border border-gray-600 text-left">Amount Paid</th>
                <th className="p-3 border border-gray-600 text-left">Actions</th>
              </tr> 
            </thead>
            <tbody>
              {/* Add rows dynamically here */}
              <tr>
                <td className="p-3 border border-gray-600">1</td>
                <td className="p-3 border border-gray-600">123456789012</td>
                <td className="p-3 border border-gray-600">Brand A</td>
                <td className="p-3 border border-gray-600">Product Description</td>
                <td className="p-3 border border-gray-600">Category A</td>
                <td className="p-3 border border-gray-600">Stock Type A</td>
                <td className="p-3 border border-gray-600">Unit A</td>
                <td className="p-3 border border-gray-600">10</td>
                <td className="p-3 border border-gray-600">100.00</td>
                <td className="p-3 border border-gray-600">10%</td>
                <td className="p-3 border border-gray-600">1234</td>
                <td className="p-3 border border-gray-600">18%</td>
                <td className="p-3 border border-gray-600">1000.00</td>
                <td className="p-3 border border-gray-600">500.00</td>
                <td className="p-3 border border-gray-600 text-center">
                  <button className="bg-yellow-500 text-white px-1 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 ">Delete</button>
                </td>
              </tr>
              {/* Repeat rows as needed */}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
    <div>
      <span class="text-muted-foreground">TOTAL</span>
      <span class="text-primary px-3">2</span>
    </div>
    <div class="flex space-x-2">
      <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">Save</button>
     
           <ReactToPrint
            trigger={() => (
              <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">Save & Print</button>
            )}
            content={() => componentRef.current}
          />
      <button class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">PDF</button>
    </div>
  </div>

        {/* <div className="bg-gray-200 p-6 rounded-lg shadow-md mt-6 max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Expense</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-3">INVOICE TOTAL :</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CASH:</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN CARD:</td>
                  <td className="border p-3">0</td>
                </tr>
                <tr>
                  <td className="border p-3">PAYMENT IN UPI:</td>
                  <td className="border p-3">0</td>
                </tr>
              </tbody>
            </table>
          </div> */}



      </div>

      
          {/* ---------------------invoice ganrator------------------------- */}


          <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">

            <div ref={componentRef}  className="max-w-4xl mx-auto p-4 bg-white text-black">
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
        <div>
          <h1 className="text-2xl font-bold mb-4">INVOICE</h1>
          <p>AAPLA BAJAR</p>
          <p>SHRIGONDA, AHMADNAGAR</p>
          <p>AHMADNAGAR, MAHARASHTRA, 444002</p>
          <p>PHONE: 9849589588</p>
          <p>EMAIL: aaplabajar1777@gmail.com</p>
        </div>
        <div className="w-24 h-24 border flex items-center justify-center">
          <img src={logo} alt="Insert Logo Above" />
        </div>
      </div>
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.border} ${sharedClasses.p2} ${sharedClasses.mb4}`}>
        <div>
          <span className={sharedClasses.fontBold}>INVOICE #: </span>
          <span>985934857944</span>
        </div>
        <div>
          <span className={sharedClasses.fontBold}>INVOICE DATE: </span>
          <span>18/07/2024</span>
        </div>
      </div>
      <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.mb4}`}>
        <div className="w-1/2 pr-2">
          <h2 className={sharedClasses.fontBold}>BILL TO:</h2>
          <p>Shivam Bole</p>
          <p>Pune,Maharashtra</p>
          <p>Pune,Maharashtra,444003</p>
          <p>9637837434</p>
          <p>shivam@gmail.com</p>
        </div>
      </div>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-black text-white">
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>QUANTITY</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>DESCRIPTION</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>GST</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>DISCOUNT</th>
            <th className={sharedClasses.border + ' ' + sharedClasses.p2}>UNIT PRICE</th>
      
          </tr>
        </thead>
        <tbody>
          {list.map((e, index) => (
            <tr key={index}>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2 + ' h-12'}>{e.quantity}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.description}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.gst}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.discount}</td>
              <td className={sharedClasses.border + ' ' + sharedClasses.p2}>{e.price}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`${sharedClasses.flex} justify-end ${sharedClasses.mb4}`}>
        <div className="w-1/4">
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>SUBTOTAL</span>
            <span>${total}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>DISCOUNT</span>
            <span>${discount}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} mb-2`}>
            <span>GST</span>
            <span>${GST}</span>
          </div>
          <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.fontBold}`}>
            <span>TOTAL</span>
            <span>${total-discount+GST}</span>
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
    </div>
  );
};

export default Purchase;
