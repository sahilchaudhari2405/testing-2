import React, { useState, useEffect } from 'react';  // Add useEffect here
import ProductCard from '../component/Card';
import Modal from '../component/Modal';
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/Product/productSlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);

  // Ensure all hooks are called at the top level
  const [formValues, setFormValues] = useState({
    barcode: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    expiringDays: '',
    lowStock: false,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);  // Set initial state to false

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error fetching products</div>;
  }

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };



  // Handle form submission
  const handleFilter = (e) => {
    e.preventDefault();
    console.log('Form Values:', formValues);
    const filteredProducts = products.filter(
      (product) =>
        // console.log(product)
        product.title.toLowerCase().includes(formValues.category.toLowerCase()) ||
        product.category.name.toLowerCase().includes(formValues.category.toLowerCase()) ||
        product.brand.toLowerCase().includes(formValues.category.toLowerCase())
    );
    console.log(filteredProducts)
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          <form onSubmit={handleFilter}>
            <div className="flex items-center space-x-2 mb-4">
              <img aria-hidden="true" alt="barcode-icon" src="https://openui.fly.dev/openui/24x24.svg?text=🛒" />
              <input
                type="text"
                name="barcode"
                value={formValues.barcode}
                onChange={handleChange}
                placeholder="Barcode/Serial"
                className="border border-zinc-300 px-2 py-1 w-fit rounded"
              />
              <input
                type="text"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Description/Batch Search"
                className="border border-zinc-300 px-2 py-1 rounded"
              />
              <input
                type="text"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                placeholder="Category"
                className="border border-zinc-300 px-2 py-1 rounded"
              />
              <input
                type="text"
                name="brand"
                value={formValues.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="border border-zinc-300 px-2 py-1 rounded w-fit"
              />
              <input
                type="text"
                name="size"
                value={formValues.size}
                onChange={handleChange}
                placeholder="Size"
                className="border border-zinc-300 px-2 py-1 rounded w-[90px]"
              />
              <input
                type="text"
                name="expiringDays"
                value={formValues.expiringDays}
                onChange={handleChange}
                placeholder="Expiring in Days"
                className="border border-zinc-300 px-2 py-1 rounded"
              />
              <label className="flex items-center space-x-1 w-[90px]">
                <input
                  type="checkbox"
                  name="lowStock"
                  checked={formValues.lowStock}
                  onChange={handleChange}
                  className="border border-zinc-300 rounded"
                />
                <span>Low Stock</span>
              </label>
              <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded">Apply</button>
            </div>
          </form>  
          <div className="flex space-x-2 mb-4">
            <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Brand</button>
            <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Quantity</button>
            <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Manage HSN</button>
            <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Manage Units</button>
            <button className="bg-white border border-zinc-300 text-black px-4 py-2 rounded">Categories</button>
            <button 
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded" 
              onClick={handleOpenModal}
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg text-foreground p-4 space-y-4 mt-5 overflow-scroll h-[60vh]">
          <ProductCard
            imgSrc="https://placehold.co/50"
            imgAlt="Adidas NEO Light Green 36"
            productName="Adidas NEO Light Green 36"
            productDetails="Man Shoes • Stocked Product: 12 in stock • low"
            retailPrice="$280.00"
            wholesalePrice="$300.00"
          />
          <ProductCard
            imgSrc="https://placehold.co/50"
            imgAlt="Adidas NEO Light Green 36"
            productName="Adidas NEO Light Green 36"
            productDetails="Man Shoes • Stocked Product: 12 in stock • low"
            retailPrice="$280.00"
            wholesalePrice="$300.00"
          />
          <ProductCard
            imgSrc="https://placehold.co/50"
            imgAlt="Adidas NEO Light Green 36"
            productName="Adidas NEO Light Green 36"
            productDetails="Man Shoes • Stocked Product: 12 in stock • low"
            retailPrice="$280.00"
            wholesalePrice="$300.00"
          />
       
        </div>
      </div>
      <Modal show={isModalOpen} onClose={handleCloseModal}>
      </Modal>
    </div>
  );
};

export default Inventory;
