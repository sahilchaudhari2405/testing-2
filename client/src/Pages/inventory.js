import React from 'react';
import { FaBarcode } from 'react-icons/fa'; // Import the barcode icon from react-icons

const Inventory = () => {
  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg ">
      <div className="bg-slate-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-lg font-bold">Inventory</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className='font-bold'>salescounter1</span></span>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">LogOut</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Print Report</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Excel Report</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Generate Barcode</button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 flex-col bg-gray-100 p-3 rounded-md">
          <div className="flex items-center space-x-2 mb-4">
          <img aria-hidden="true" alt="barcode-icon" src="https://openui.fly.dev/openui/24x24.svg?text=🛒" />
          <input type="text" placeholder="Barcode/Serial" className="border border-zinc-300 px-2 py-1 rounded" />
          <input type="text" placeholder="Description/Batch Search" className="border border-zinc-300 px-2 py-1 rounded" />
          <input type="text" placeholder="Category" className="border border-zinc-300 px-2 py-1 rounded" />
          <input type="text" placeholder="Brand" className="border border-zinc-300 px-2 py-1 rounded" />
          <input type="text" placeholder="Size" className="border border-zinc-300 px-2 py-1 rounded" />
          <input type="text" placeholder="Expiring in Days" className="border border-zinc-300 px-2 py-1 rounded" />
          <label className="flex items-center space-x-1">
            <input type="checkbox" className="border border-zinc-300 rounded" />
            <span>Low Stock</span>
          </label>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Brand</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Size</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Manage HSN</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Manage Units</button>
          <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Categories</button>
          <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded">Add Item</button>
        </div>
        </div>
       
        
        <div className="overflow-x-auto">
          <table className="w-full mb-6 border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead className=" ">
              <tr className='bg-gray-600 text-white'>
                <th className="border border-zinc-800  px-4 py-2">#</th>
                <th className="border border-zinc-800  px-4 py-2">Description</th>
                <th className="border border-zinc-800  px-4 py-2">Category</th>
                <th className="border border-zinc-800  px-4 py-2">Brand</th>
                <th className="border border-zinc-800  px-4 py-2">Location</th>
                <th className="border border-zinc-800  px-4 py-2">Ageing</th>
                <th className="border border-zinc-800  px-4 py-2">GST</th>
                <th className="border border-zinc-800  px-4 py-2">Barcode</th>
                <th className="border border-zinc-800  px-4 py-2">Qty.</th>
                <th className="border border-zinc-800  px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-zinc-800 px-4 py-2">1)</td>
                <td className="border border-zinc-800 px-4 py-2">SENSEVIERIA BLACK JACK 18-I</td>
                <td className="border border-zinc-800 px-4 py-2">General</td>
                <td className="border border-zinc-800 px-4 py-2">-</td>
                <td className="border border-zinc-800 px-4 py-2">-</td>
                <td className="border border-zinc-800 px-4 py-2">4 day</td>
                <td className="border border-zinc-800 px-4 py-2">0%</td>
                <td className="border border-zinc-800 px-4 py-2">-1 PCS</td>
                <td className="border border-zinc-800 px-4 py-2">350</td>
                <td className="border border-zinc-800 px-4 py-2 flex space-x-2">
                  <button className="text-blue-500">
                    <img aria-hidden="true" alt="edit-icon" src="https://openui.fly.dev/openui/24x24.svg?text=✏️" />
                  </button>
                  <button className="text-red-500">
                    <img aria-hidden="true" alt="delete-icon" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
                  </button>
                </td>
              </tr>
              <tr className="bg-zinc-100">
                <td className="border border-zinc-800 px-4 py-2">2)</td>
                <td className="border border-zinc-800 px-4 py-2">KISAN PEANUT BUTTER</td>
                <td className="border border-zinc-800 px-4 py-2">General</td>
                <td className="border border-zinc-800 px-4 py-2">-</td>
                <td className="border border-zinc-800 px-4 py-2">-</td>
                <td className="border border-zinc-800 px-4 py-2">6 day</td>
                <td className="border border-zinc-800 px-4 py-2">0%</td>
                <td className="border border-zinc-800 px-4 py-2">2 PCS</td>
                <td className="border border-zinc-800 px-4 py-2">50</td>
                <td className="border border-zinc-800 px-4 py-2 flex space-x-2">
                  <button className="text-blue-500">
                    <img aria-hidden="true" alt="edit-icon" src="https://openui.fly.dev/openui/24x24.svg?text=✏️" />
                  </button>
                  <button className="text-red-500">
                    <img aria-hidden="true" alt="delete-icon" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
