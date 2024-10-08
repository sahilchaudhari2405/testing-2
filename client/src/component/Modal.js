import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../Redux/Product/productSlice'; // Add updateProduct action
import { fetchCategories } from '../Redux/Category/categoriesSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 
import axiosInstance from '../axiosConfig';

const Modal = ({ show, onClose, product,onSuccess }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    discountPercent: '',
    quantity: '',
    weight:'',
    category: '',
    brand: '',
    image: null,
    slug: '',
    BarCode: '',
    stockType:'',
    unit:'',
    purchaseRate: '',
    profitPercentage: '',
    HSN:'',
    GST:'',
    retailPrice:'',
    totalAmount:'',
    amountPaid:'',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    if (product) {
      console.log(product)
      setForm({
        title: product.title,
        description: product.description,
        price: product.price,
        discountedPrice:product.discountedPrice,
        discountPercent:product.discountPercent,
        quantity:product. quantity,
        weight:product.weight,
        category:product.category,
        brand:product.brand,
        image: null,
        slug:product.slug,
        BarCode:product.BarCode,
        stockType: product.stockType,
        unit:product.unit,
        purchaseRate: product.purchaseRate,
        profitPercentage:product.profitPercentage,
        HSN:product.HSN,
        GST:product.GST,
        retailPrice:product.retailPrice,
        totalAmount:product.totalAmount,
        amountPaid:product.amountPaid,
      });
      setImagePreview(product.imgSrc);
    }
  }, [dispatch, product]);
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === "discountedPrice" && {
        retailPrice: value,
        totalAmount: value,
      }),
    }));
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prevForm) => ({ ...prevForm, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };
  const generalCategoryId = categories.find(cat => cat.name === "GENERAL")?._id;
  console.log(" Genral category",generalCategoryId)
  const handleDescriptionChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, description: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (product) {
        const productId = product._id || (product.items && product.items._id);
        if (!productId) {
            toast.error("Product ID not found!");
            return;
        }
        try {
          const response = await axiosInstance.put(`/product/update/${productId}`, form);
        console.log(   response.data.data)
           toast.success('Product updated successfully');
           onSuccess()
        } catch (error) {
          toast.error('Failed to update product');
        }

    } else {
        try {
          const response = await axiosInstance.post('/product/create', form);
        console.log(   response.data.data)
           toast.success('Product create successfully');
           onSuccess()
        } catch (error) {
          toast.error('Failed to create product');
        }
    }
};


  return (
    <>
      {
            !show? null :  <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center overflow-scroll z-50">
            <div className="bg-white relative p-6 bg-card text-card-foreground rounded-lg max-w-9xl mx-auto w-full h-full mt-32">
               <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-4xl hover:text-gray-800">
                 &times;
               </button>
         <div className="p-6 bg-card text-card-foreground rounded-lg max-w-9xl mx-auto w-full h-full ">
           <ToastContainer />
           <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
           <form onSubmit={handleSubmit}>
             <div className="bg-white p-6 rounded-lg shadow-md">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               
             <div>
 

</div>
                {/* Category Code here */}    
             </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-3">Product Name <span className="text-destructive">*</span></label>
                    <input type="text" id="title" name="title" value={form.title} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter product name" required/>
                 </div>
                 


                 <div className="mb-4">
  <label htmlFor="BarCode" className="block text-sm font-medium text-zinc-700 mb-3">
    Bar Code <span className="text-destructive">*</span>
  </label>
  <input
    type="text"
    id="BarCode"
    name="BarCode"
    value={form.BarCode}
    onChange={handleChange}
    className="mt-1 block w-full p-2 border border-input rounded-md"
    placeholder="Enter BarCode"
    required
  />
</div>

                 <div className="mb-4">
  <label htmlFor="category" className="block text-sm font-medium text-zinc-700 mb-3">
    Category <span className="text-destructive">*</span>
  </label>
  <select
    id="category"
    name="category"
    value={form.category || generalCategoryId}  
    onChange={handleChange}
    className="mt-1 block w-full p-2 border border-input rounded-md"
    
  >
    <option value="">Select a category</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

               <div className="mb-4">
                 <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-3">Price <span className="text-destructive">*</span></label>
                 <input type="number" id="price" name="price" value={form.price} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter price" />
               </div>
               <div className="mb-4">
                 <label htmlFor="discountedPrice" className="block text-sm font-medium text-zinc-700 mb-3">Discounted Price</label>
                 <input type="number" id="discountedPrice" name="discountedPrice" value={form.discountedPrice} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter discounted price" />
               </div>
               {/* <div className="mb-4">
                 <label htmlFor="discountPercent" className="block text-sm font-medium text-zinc-700 mb-3">Discount Percent</label>
                 <input type="number" id="discountPercent" name="discountPercent" value={form.discountPercent} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter discount percent" />
               </div> */}
               <div className="mb-4">
                 <label htmlFor="quantity" className="block text-sm font-medium text-zinc-700 mb-3">Quantity</label>
                 <input type="number" id="quantity" name="quantity" onChange={handleChange} value={form.quantity} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter quantity" />
               </div>
               {/* <div className="mb-4">
                 <label htmlFor="weight" className="block text-sm font-medium text-zinc-700 mb-3">Weight</label>
                 <input type="number" id="weight" name="weight" value={form.weight} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter quantity" />
               </div> */}
               {/* <div className="mb-4">
                 <label htmlFor="BarCode" className="block text-sm font-medium text-zinc-700 mb-3">Bar Code</label>
                 <input type="number" id="BarCode" name="BarCode" value={form.BarCode} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter BarCode" required/>
               </div> */}
               {/* <div className="mb-4">
                 <label htmlFor="stockType" className="block text-sm font-medium text-zinc-700 mb-3">Stock Type</label>
                 <input type="text" id="stockType" name="stockType" value={form.stockType} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Stock Type" required/>
               </div> */}
               {/* <div className="mb-4">
                 <label htmlFor="unit" className="block text-sm font-medium text-zinc-700 mb-3">Unit</label>
                 <input type="text" id="unit" name="unit" value={form.unit} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Unit" />
               </div> */}
               <div className="mb-4">
                 <label htmlFor="purchaseRate" className="block text-sm font-medium text-zinc-700 mb-3">Purchase Rate</label>
                 <input type="number" id="purchaseRate" name="purchaseRate" value={form.purchaseRate} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Purchase Rate" />
               </div>
               {/* <div className="mb-4">
                 <label htmlFor="profitPercentage" className="block text-sm font-medium text-zinc-700 mb-3">Profit Percentage</label>
                 <input type="number" id="profitPercentage" name="profitPercentage" value={form.profitPercentage} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Profit Percentage" />
               </div> */}
               {/* <div className="mb-4">
                 <label htmlFor="HSN" className="block text-sm font-medium text-zinc-700 mb-3">HSN</label>
                 <input type="number" id="HSN" name="HSN" value={form.HSN} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter HSN" />
               </div> */}
               <div className="mb-4">
                 <label htmlFor="GST" className="block text-sm font-medium text-zinc-700 mb-3">GST</label>
                 <input type="number" id="GST" name="GST" value={form.GST} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter GST" />
               </div>
               <div className="mb-4">
                 <label htmlFor="retailPrice" className="block text-sm font-medium text-zinc-700 mb-3">Retail Price</label>
                 <input type="number" id="retailPrice" name="retailPrice" value={form.retailPrice} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Retail Price" readOnly/>
               </div>
               <div className="mb-4">
                 <label htmlFor="totalAmount" className="block text-sm font-medium text-zinc-700 mb-3">Total Amount</label>
                 <input type="number" id="totalAmount" name="totalAmount" value={form.totalAmount} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Total Amount" readOnly/>
               </div>
               <div className="mb-4">
                 <label htmlFor="amountPaid" className="block text-sm font-medium text-zinc-700 mb-3">Amount Paid</label>
                 <input type="number" id="amountPaid" name="amountPaid" value={form.amountPaid} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter Amount Paid" />
               </div>
               {/* <div className="mb-4">
                 <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 mb-3">Slug <span className="text-destructive">*</span></label>
                 <input type="text" id="slug" name="slug" value={form.slug} onChange={handleChange} className="mt-1 block w-full p-2 border border-input rounded-md" placeholder="Enter unique slug" />
               </div> */}
            </div>
            <div className="mb-4">
                 <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-3" required >Description <span className="text-destructive">*</span></label>
                 <ReactQuill
                   value={form.description}
                   onChange={handleDescriptionChange}
                   className="mt-1 block w-full border border-input rounded-md"
                   theme="snow"
                   placeholder="Description"
                 />
               </div>
               <div className="bg-white p-6 rounded-lg shadow-md">
               <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
               <input type="file" name="image" onChange={handleFileChange} className="block w-full mb-4" />
               {imagePreview && (
                 <div className="mt-4">
                   <h3 className="text-md font-medium mb-2">Image Preview:</h3>
                   <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow-md" />
                 </div>
               )}
                  <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {product ? 'Update Product' : 'Create Product'}
                </button>
              </div>
             </div>

             </div>
        
           </form>
         </div>
     
             </div>
           </div>
        }
    
    </>
  );
};

export default Modal;




