import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ProductCard from '../component/Card';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../Redux/User/userSlices';
import { toast } from 'react-toastify';
import Modal from '../component/Modal';
import { fetchProduct, fetchProducts, sortProducts } from "../Redux/Product/productSlice";
import { fetchCategories } from "../Redux/Category/categoriesSlice";
import CategorySuggestions from '../component/CategorySuggestions';
import { importExcelData, exportExcelData } from '../component/Card'; 
import axiosInstance from '../axiosConfig';
import BarcodeReader from "react-barcode-reader";
const Inventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const { products, status } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [prod, setProd] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, Suggestions] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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

  const [page, setPage] = useState(1); // State to track the current page
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handlenewLogout();  
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  };

  const handlenewLogout = () => {
    localStorage.removeItem('token');
    axiosInstance.post('/auth/logout').catch((err) => console.error(err));
    // window.location.href = '/login';
    navigate('/login');
  };

  React.useEffect(() => {
    handleTokenExpiration(); 
  }, []);

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

  // const fetchProducts = async (page) => {
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.get(`/product/view?page=${page}&limit=50`);
  //     setProd((prev) => [...prev, ...response.data.data]); // Append new products
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// Fetch products with pagination and optional filtering (using POST)
const fetchProducts = async () => {
  setLoading(true); // Set loading state before fetching
console.log(formValues);
  const { barcode, description, category, brand, size, expiringDays, lowStock } = formValues
  try {
    // Construct the request body with page, limit, and filter criteria
    const requestBody = {
      page,
      limit: 50,
      barcode,
      description,
      category,
      brand,
      size,
      expiringDays,
      lowStock,
      suggestions // Spread the filter values into the request body
    };

    // Make a POST request to fetch products with pagination and filters
    const response = await axiosInstance.post('/product/view', requestBody);

    if (page === 1) {
      // If it's the first page, replace the product list
      setProd(response.data.data);
    } else {
      // Append fetched products to existing ones for pagination
      setProd((prev) => [...prev, ...response.data.data]);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false); // Reset loading state
  }
};

// Handle filter form submission and trigger product fetching with filters
const handleFilter = async (e) => {
  e.preventDefault();
Suggestions(true);
  if (!isChecked) {
    const { barcode, description, category, brand, size, expiringDays, lowStock } = formValues;

    // Prepare filter object from form values
    const filters = {
      barcode,
      description,
      category,
      brand,
      size,
      expiringDays,
      lowStock,
    };
    await setPage(1);
    setProd([]);
    // Fetch products with the filters, starting from page 1
   await fetchProducts(); // Use page 1 when applying filters
  } else {
    alert("Turn off the X machine before filtering");
  }
};

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(()=>{
    fetchProducts();
  },[])
  useEffect(() => {
    fetchProduct(1)
    console.log("getting filter products",products)
  }, [ prod]);
  
  useEffect(() => {
    if (formValues.category) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().startsWith(formValues.category.toLowerCase())
      );
      setFilteredCategories(filtered);
      console.log(filteredCategories)
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

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
      setPage((prev) => prev + 1); // Load the next page
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

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

//   const handleFilter = (e) => {
    
//     e.preventDefault();

//     if(!isChecked){ 
//     const { barcode, description, category, brand, size, expiringDays, lowStock } = formValues;
//     dispatch(sortProducts({ barcode, description, category, brand, size, expiringDays, lowStock }));
//   }else{

//     alert("Turn off the x machine")
//   };
// }

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

    setPage(1);
    Suggestions(false);
    fetchProducts();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("!");
  };

  const handleCategorySelect = (category) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category,
    }));
    setShowSuggestions(false);
  };

  const handleImport = (e) => {
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

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/product/view');
      const productsTOExport = response.data.data;
      exportExcelData(productsTOExport);

    } catch (error) {
      console.log("error: ",error);
    }

  };



//functions of scanner functionality


const handleError = (err) => {

  // console.log(isChecked)
  // if (isChecked) {

  //   fetchProducts(766576577878')
  // }

  handleScan("B17899");
  //alert("Connnect the Barcode Scanner")
  // dispatch(fetchProduct("5345435334"));
};


const handleScan = (data) => {
  console.log(data)
  setFormValues({
    barcode: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    expiringDays: '',
    lowStock: false,
  });

  if (isChecked&&data) {
    dispatch(sortProducts({ barcode:data})) .then(() => {
      // After the dispatch, update local prod state from Redux products
      setProd(products);
    });;
  }
};

const handleCheckboxChange = (event) => {
  const checked = event.target.checked;
  console.log(event)
  setIsChecked(checked);
};











  return (
    <div className="bg-white mt-[7rem] rounded-lg mx-6 shadow-lg">
           <BarcodeReader onError={handleError} onScan={handleScan} />
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
            className="hidden"
            id="import-file"
          />
          <label
            htmlFor="import-file"
            className="bg-white border border-zinc-300 text-black px-4 py-2 rounded cursor-pointer"
          >
            Import Report
          </label>
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

        <div className="flex items-center space-x-2 mb-4 bg-gray-100 p-3 rounded-md relative">
          
        <div className=" mb-4 text-center"> 
              <label
                htmlFor="scanner"
                className="block text-sm font-medium"
              >
                Scanner
              </label>
              <input
                type="checkbox"
                id="scanner"
                checked={isChecked}
                onChange={handleCheckboxChange} 
                className="border border-gray-300 rounded mt-4 "
              />
            </div>
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
              {/* <input
                type="text"
                name="brand"
                value={formValues.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="border border-zinc-300 px-2 py-1 rounded w-fit"
              /> */}
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

        <div className="bg-gray-100 rounded-lg text-foreground p-4 space-y-4 mt-5 z-0">
         {prod && prod.map((items) => (
          //console.log(items)
          <ProductCard
            key={items._id}
            items={items}
          />
         ))}
         {loading && <div>Loading more products...</div>}
         {prod.length === 0 && !loading ? <div className='bg-white text-black text-2xl w-full h-[80vh] pt-[30vh] text-center'> Sorry No Product Found As Per Your Search Combination</div> : null}
        </div>
      </div>
      <Modal show={isModalOpen} onClose={handleCloseModal}>
      </Modal>
    </div>
  );
};

export default Inventory;