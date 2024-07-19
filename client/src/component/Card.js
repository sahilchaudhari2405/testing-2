import React, { useState, useRef, useEffect } from 'react';

const cardClasses = "bg-white p-4 rounded-lg flex items-center justify-between";
const textClasses = "text-muted-foreground text-primary text-destructive";

const ProductCard = ({ imgSrc, imgAlt, productName, productDetails, retailPrice, wholesalePrice }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef(null);

  const handlePopupToggle = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    console.log("hallo")
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cardClasses}>
      <div className="flex items-center space-x-4">
        <img src={imgSrc} alt={imgAlt} className="rounded-lg" />
        <div>
          <h2 className="text-lg font-semibold">{productName}</h2>
          <p className="text-muted-foreground">{productDetails}</p>
        </div>
      </div>
      <div className="flex space-x-8 relative" onMouseLeave={() => setIsPopupVisible(false)}>
        <div>
          <p className="text-muted-foreground">RETAIL PRICE</p>
          <p>{retailPrice}</p>
        </div>
        <div>
          <p className="text-muted-foreground">WHOLESALE PRICE</p>
          <p>{wholesalePrice}</p>
        </div>
        <button className="text-muted-foreground" onClick={handlePopupToggle}>•••</button>

        {isPopupVisible && (
          <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-gray-100" onClick={() => { /* Handle edit action */ }}>
              Edit
            </button>
            <button className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-gray-100" onClick={() => { /* Handle delete action */ }}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
