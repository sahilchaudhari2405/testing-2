import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ProductCard from '../component/Card';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../Redux/User/userSlices';
import { toast } from 'react-toastify';
import Modal from '../component/Modal';
import { fetchProducts } from "../Redux/Product/productSlice";
import { fetchCategories } from "../Redux/Category/categoriesSlice";
import CategorySuggestions from '../component/CategorySuggestions';
import { importExcelData, exportExcelData } from '../component/Card'; 
import axiosInstance from '../axiosConfig';

const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const { products, status } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [prod, setProd] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    barcode: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    expiringDays: '',
    lowStock: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setFullName(decodedToken.fullName);
    } else { 
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('token');
    toast.error("Logout Successfully!");
    navigate('/');
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setProd(products);
  }, [products]);

  useEffect(() => {
    if (formValues.category) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().startsWith(formValues.category.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowSuggestions(false);
    }
  }, [formValues.category, categories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error fetching products</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    let filteredProducts = products.filter((product) => {
      return (
        (formValues.barcode === '' || product.BarCode.toString() === formValues.barcode) &&
        (formValues.description === '' || (product.description && product.description.toLowerCase().includes(formValues.description.toLowerCase()))) &&
        (formValues.category === '' || (product.category && product.category.name && product.category.name.toLowerCase().includes(formValues.category.toLowerCase()))) &&
        (formValues.brand === '' || (product.brand && product.brand.toLowerCase().includes(formValues.brand.toLowerCase()))) &&
        (formValues.size === '' || (product.size && product.size === formValues.size)) &&
        (formValues.expiringDays === '' || (product.expiringDays && product.ageing <= parseInt(formValues.expiringDays)))
       );
    });

    if (formValues.lowStock) {
      filteredProducts = filteredProducts.sort((a, b) => a.quantity - b.quantity);
    }

    setProd(filteredProducts);
  };

  const handleClearFilters = () => {
    setFormValues({
      barcode: '',
      description: '',
      category: '',
      brand: '',
      size: '',
      expiringDays: '',
      lowStock: false,
    });
    setProd(products);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCategorySelect = (category) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category,
    }));
    setShowSuggestions(false);
  };

  const handleImport = (e) => {
    console.log("inside handleimport");
    const file = e.target.files[0];
    if (file) {
      importExcelData(file, async (data) => {
        setProd(data);
  
        try {
          const response = await axiosInstance.post('/product/importProducts', { products: data });
          console.log('Data imported successfully:', response.data);
          
  
          dispatch((response.data.data));
          if (response.data.skipped.length > 0) {
            console.log('Skipped products:', response.data.skipped);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      });
    }
  };

  const handleExport = () => {
    exportExcelData(prod);
  };

  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg">
      <div className="bg-slate-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className='font-bold'>{fullName}</span></span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">LogOut</button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleImport}
            // className="hidden"
            id="import-file"
            placeholder=''
          />
          {/*  <label */}
            {/* // htmlFor="import-file" */}
            {/* // className="bg-white border border-zinc-300 text-black px-4 py-2 rounded cursor-pointer" */}
          {/* // > */}
            {/* Import Report */}
          {/* </label> */}
          <button
            onClick={handleExport}
            className="bg-white border border-zinc-300 text-black px-4 py-2 rounded"
          >
            Export Report
          </button>
          <button 
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded" 
            onClick={handleOpenModal}
          >
            Add Item
          </button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4 flex-col bg-gray-100 p-3 rounded-md relative">
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
                ref={categoryInputRef}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && filteredCategories.length > 0 && (
                <CategorySuggestions
                  categories={filteredCategories}
                  onSelect={handleCategorySelect}
                  position={suggestionPosition}
                  ref={suggestionsRef}
                />
              )}
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
              <button type="button" onClick={handleClearFilters} className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded">Clear</button>
            </div>
          </form>  
        </div>

        <div className="bg-gray-100 rounded-lg text-foreground p-4 space-y-4 mt-5 overflow-scroll h-[100vh] z-0">
         {prod && prod.map((items) => (
          <ProductCard
            key={items._id}
            items={items}
          />
         ))} 
        </div>
      </div>
      <Modal show={isModalOpen} onClose={handleCloseModal}>
      </Modal>
    </div>
  );
};

export default Inventory;
