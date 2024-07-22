import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../Redux/Product/productSlice'; // Adjust the path accordingly
import Modal from './Modal'; // Import the Modal component

const cardClasses = "bg-white p-4 rounded-lg flex items-center justify-between";
const textClasses = "text-muted-foreground text-primary text-destructive";

const ProductCard = ({
  items
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // New state for modal visibility
  const [currentProduct, setCurrentProduct] = useState(null); // New state for current product details
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
    setCurrentProduct({
items
    });
    setIsModalVisible(true);
    setIsPopupVisible(false);
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
              {items.category==null?"GENERAL":items.category.name}
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
          <p>{items.ageing|| "0"}</p>
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
          product={currentProduct} // Pass current product details to Modal
        />
      )}
    </div>
  );
};

export default ProductCard;
