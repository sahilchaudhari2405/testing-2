import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../Redux/Product/productSlice'; // Adjust the path accordingly
import Modal from './Modal'; // Import the Modal component
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import JsBarcode from 'jsbarcode';
import { toast } from "react-toastify";

// Existing styles
const cardClasses = "bg-white p-4 rounded-lg flex items-center justify-between";
const textClasses = "text-muted-foreground text-primary text-destructive";


// Import data from Excel file
export const importExcelData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Convert the array of arrays into an array of objects
    const headers = jsonData[0];
    const rows = jsonData.slice(1);
    const formattedData = rows.map((row) => {
      const obj = {};
      row.forEach((cell, index) => {
        obj[headers[index]] = cell;
      });
      return obj;
    });

    callback(formattedData);
  };
  reader.readAsArrayBuffer(file);
};

// Export data to Excel file
export const exportExcelData = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Data');
  XLSX.writeFile(workbook, 'inventory_data.xlsx');
};

const ProductCard = ({ items }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQuantityPopupVisible, setIsQuantityPopupVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [barcodePreviews, setBarcodePreviews] = useState([]); // New state for barcode previews
  const startsWithLetter = (code) => /^[A-Za-z]/.test(code);
  const popupRef = useRef(null);
  const dispatch = useDispatch();

  const handlePopupToggle = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteProduct(items._id));
    setIsPopupVisible(false);
  };

  const handleEdit = () => {
    setCurrentProduct(items);
    setIsModalVisible(true);
    setIsPopupVisible(false);
  };

  const handleGenerateBarcode = () => {
    setIsQuantityPopupVisible(true);
    setIsPopupVisible(false);
  };

  const generateBarcodes = () => {
    const previews = [];
    for (let i = 0; i < quantity; i++) {
      if (startsWithLetter(items.BarCode)) {
        // Create canvas elements
        const titleCanvas = document.createElement("canvas");
        const textCanvas = document.createElement("canvas");
        const barcodeCanvas = document.createElement("canvas");
  
        // Set up title canvas
        const titleContext = titleCanvas.getContext('2d');
        titleCanvas.width = 200; // Adjust width as needed
        titleCanvas.height = 30; // Adjust height as needed
        titleContext.font = "bold 14px Arial";
        titleContext.textAlign = "center";
        titleContext.textBaseline = "middle";
        titleContext.fillText("आपला बाजार श्रीगोंदा", titleCanvas.width / 2, titleCanvas.height / 2);
  
        // Truncate title to first 20 characters
        const truncatedTitle = items.title.length > 20 ? items.title.substring(0, 20) + '...' : items.title;
  
        // Set up additional text canvas
        const textContext = textCanvas.getContext('2d');
        textCanvas.width = 200; // Adjust width as needed
        textCanvas.height = 20; // Adjust height as needed
        textContext.font = "normal 10px Arial";
        textContext.textAlign = "center";
        textContext.textBaseline = "middle";
        textContext.fillText(truncatedTitle, textCanvas.width / 2, textCanvas.height / 2);
  
        // Set up barcode canvas
        JsBarcode(barcodeCanvas, items.BarCode, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 100,
          displayValue: true,
          text: `BARCODE: ${items.BarCode}\nMRP: ₹${items.price}`,
          fontSize: 10,
          textAlign: "center",
          textPosition: "bottom",
        });
  
        // Combine canvases
        const finalCanvas = document.createElement("canvas");
        const finalContext = finalCanvas.getContext('2d');
        finalCanvas.width = Math.max(titleCanvas.width, textCanvas.width, barcodeCanvas.width);
        finalCanvas.height = titleCanvas.height + textCanvas.height + barcodeCanvas.height;
  
        // Draw title canvas
        finalContext.drawImage(titleCanvas, 0, 0);
        
        // Draw additional text canvas below title
        finalContext.drawImage(textCanvas, 0, titleCanvas.height);
  
        // Draw barcode canvas below additional text
        finalContext.drawImage(barcodeCanvas, 0, titleCanvas.height + textCanvas.height);
  
        previews.push(finalCanvas.toDataURL("image/png"));
      }
      else{
        toast.error("Sorry don't Have barcode for this!!")
      }
    }
    setBarcodePreviews(previews);
    setIsQuantityPopupVisible(false);
  };
  




  const handlePrintBarcodes = () => {
    const doc = new jsPDF();
    const margin = 10; // Margin around the page
    const barcodeWidth = 60; // Width of each barcode image
    const barcodeHeight = 30; // Height of each barcode image
    const numColumns = 3; // Number of columns on the page
    const numRows = 10; // Number of rows on the page
    const xOffset = 5; // Horizontal space between barcodes
    const yOffset = 10; // Vertical space between barcodes
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Initial positions
    let xPosition = margin;
    let yPosition = margin;
  
    barcodePreviews.forEach((barcodeImage, index) => {
      if (index > 0 && index % (numColumns * numRows) === 0) {
        // Add a new page if the current one is full
        doc.addPage();
        xPosition = margin; // Reset X position
        yPosition = margin; // Reset Y position
      }
  
      // Add barcode image
      doc.addImage(barcodeImage, 'PNG', xPosition, yPosition, barcodeWidth, barcodeHeight);
  
      // Update X and Y positions for the next barcode
      if ((index + 1) % numColumns === 0) {
        xPosition = margin; // Reset X position for new row
        yPosition += barcodeHeight + yOffset; // Move down to the next row
      } else {
        xPosition += barcodeWidth + xOffset; // Move right to the next column
      }
  
      // Check if we need to add a new page for the next barcode
      if (yPosition + barcodeHeight > pageHeight - margin) {
        doc.addPage();
        xPosition = margin;
        yPosition = margin;
      }
    });
  
    doc.save("barcodes.pdf");
  };
  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cardClasses} id={items._id}>
      <div className="flex items-center space-x-4">
        <img src={items.imageUrl} alt={items.title} className="rounded-lg w-24 h-25" />
        <div>
          <h2 className="text-lg font-semibold">
            {items.title}{" "}/
            <span className="text-md font-bold">
              <span className=" font-semibold">Category: </span>
              {/* {console.log(items.category)} */}
              {items.category == null ? "GENERAL" : items.category.name}
            </span>{" "}
          </h2>{" "}
          <span className="text-md font-bold">
            <span className=" font-semibold">BRAND: </span>
            {items.brand}
          </span>
          <p className="text-black">Quantity:{items.quantity}</p>
        </div>
      </div>
      <div
        className="flex space-x-8 relative"
        onMouseLeave={() => setIsPopupVisible(false)}
      >
        <div>
          <p className="text-muted-foreground">GST</p>
          <p>{items.GST}%</p>
        </div>

        <div>
          <p className="text-muted-foreground">BARCODE</p>
          <p>{items.BarCode}</p>
        </div>
        <div>
          <p className="text-muted-foreground">AGEING</p>
          <p>{items.ageing || "0"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">RETAIL PRICE</p>
          <p>{items.discountedPrice}</p>
        </div>
        <div>
          <p className="text-muted-foreground">PURCHASE RATE</p>
          <p>{items.purchaseRate}</p>
        </div>
        <div>
          <p className="text-muted-foreground">MRP</p>
          <p>{items.price}</p>
        </div>
        <button className="text-muted-foreground" onClick={handlePopupToggle}>
          •••
        </button>

        {isPopupVisible && (
          <div
            ref={popupRef}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          >
            <button
              className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-gray-100"
              onClick={handleGenerateBarcode} // New button to handle barcode generation
            >
              Generate Barcode
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-gray-100"
              onClick={handleEdit}
            >
              Edit
            </button>
            
            <button
              className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-gray-100"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isModalVisible && (
        <Modal
          show={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          product={items}
        />
      )}

      {isQuantityPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Enter Quantity</h3>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-full mt-2"
              min="1"
            />
            <div className="mt-4 flex space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={generateBarcodes}
              >
                Preview Barcodes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsQuantityPopupVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {barcodePreviews.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-screen-lg">
            <h3 className="text-lg font-semibold">Barcode Preview</h3>
            <div className="flex overflow-x-auto space-x-4">
              {barcodePreviews.map((preview, index) => (
                <div key={index} className="flex-shrink-0 w-60">
                  <img src={preview} alt={`Barcode ${index}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handlePrintBarcodes}
              >
                Print Barcodes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setBarcodePreviews([])} // Clear previews
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
