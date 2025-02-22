// import React, { useState } from 'react';

// const ImageGenerator = () => {
//     const [prompt, setPrompt] = useState('');
//     const [generatedImage, setGeneratedImage] = useState(null);
//     const [error, setError] = useState('');

//     const fetchImage = async (userPrompt) => {
//         const hardcodedPrompt = "on a plain white background, centered, and resembling a product image found on an e-commerce website, like a grocery item (packaged food, snacks, or canned goods).";
    
//         const finalPrompt = `${userPrompt}, ${hardcodedPrompt}`;
    
//         try {
//             const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer HUGGING_FACE_API_KEY`, 
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ inputs: finalPrompt }) 
//             });
    
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }
    
//             const imageBlob = await response.blob();
//             const imageObjectURL = URL.createObjectURL(imageBlob);
//             return imageObjectURL;
//         } catch (error) {
//             throw error;
//         }
//     };
    

//     const handleGenerateImage = async (e) => {
//         e.preventDefault();
//         setError('');
//         setGeneratedImage(null);

//         try {
//             const imageUrl = await fetchImage(prompt);
//             setGeneratedImage(imageUrl);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div className="min-h-screen mt-20 bg-gray-100 p-6">
//             <div className="container mx-auto">
//                 <div className="grid grid-cols-1 gap-6">
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <h2 className="text-xl font-semibold mb-4">Generate your product Image </h2>
//                         <form onSubmit={handleGenerateImage}>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Enter your product name and description</label>
//                                     <input
//                                         type="text"
//                                         value={prompt}
//                                         onChange={(e) => setPrompt(e.target.value)}
//                                         className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <button
//                                         type="submit"
//                                         className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
//                                     >
//                                         Generate Image
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                         {error && <div className="text-red-500 mt-4">{error}</div>}
//                     </div>

//                     {generatedImage && (
//                         <div className="bg-white p-4 rounded-lg shadow">
//                             <h2 className="text-xl font-semibold mb-4">Generated Image:</h2>
//                             <img src={generatedImage} alt="Generated from Prompt" className="max-w-full h-auto rounded-lg shadow-md" />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ImageGenerator;
// import React, { useState } from 'react';

// const ImageGenerator = () => {
//     const [prompt, setPrompt] = useState('');
//     const [generatedImage, setGeneratedImage] = useState(null);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false); // Loader state

//     const fetchImage = async (userPrompt) => {
//         const hardcodedPrompt = "on a plain background, centered, and resembling a product image found on an e-commerce website, wrapped, branded, packet labelled like a grocery item (packaged food, snacks, or canned goods).";
//         const finalPrompt = `${userPrompt}, ${hardcodedPrompt}`;

//         try {
//             const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer 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`, 
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ inputs: finalPrompt })
//             });

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }

//             const imageBlob = await response.blob();
//             const imageObjectURL = URL.createObjectURL(imageBlob);
//             return imageObjectURL;
//         } catch (error) {
//             throw error;
//         }
//     };

//     const handleGenerateImage = async (e) => {
//         e.preventDefault();
//         setError('');
//         setGeneratedImage(null);
//         setLoading(true); // Start loader

//         try {
//             const imageUrl = await fetchImage(prompt);
//             setGeneratedImage(imageUrl);
//         } catch (err) {
//             setError(err.message);
//         }

//         setLoading(false); // Stop loader
//     };

//     const handleDownloadImage = () => {
//         const link = document.createElement('a');
//         link.href = generatedImage;
//         link.download = 'generated-image.png'; // File name for the downloaded image
//         link.click();
//     };

//     const handleReset = () => {
//         setPrompt('');
//         setGeneratedImage(null);
//         setError('');
//         setLoading(false);
//     };

//     return (
//         <div className="min-h-screen mt-20 bg-gray-100 p-6">
//             <div className="container mx-auto">
//                 <div className="grid grid-cols-1 gap-6">
//                     <div className="bg-white p-4 rounded-lg shadow">
//                         <h2 className="text-xl font-semibold mb-4">Generate your product Image</h2>
//                         <form onSubmit={handleGenerateImage}>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">
//                                         Enter your product name and description
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={prompt}
//                                         onChange={(e) => setPrompt(e.target.value)}
//                                         className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <button
//                                         type="submit"
//                                         className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
//                                         disabled={loading} // Disable button while loading
//                                     >
//                                         {loading ? (
//                                             <div className="flex justify-center items-center">
//                                                 <span>Generating</span>
//                                                 <span className="ml-1 dot1">.</span>
//                                                 <span className="dot2">.</span>
//                                                 <span className="dot3">.</span>
//                                             </div>
//                                         ) : (
//                                             'Generate Image'
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                         {error && <div className="text-red-500 mt-4">{error}</div>}
//                     </div>

//                     {/* Loader Spinner */}
//                     {loading && (
//                         <div className="flex justify-center items-center mt-6">
//                             <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                     )}

//                     {/* Display the generated image */}
//                     {generatedImage && !loading && (
//                         <div className="bg-white p-4 flex flex-col justify-center items-center  rounded-lg shadow mt-6">
//                             <h2 className="text-xl font-semibold mb-4">Generated Image:</h2>
//                             <div className="mt-4 flex flex-col w-fit justify-between">

//                             <img 
//                                 src={generatedImage} 
//                                 alt="Generated from Prompt" 
//                                 className="max-w-xs mx-auto h-auto rounded-lg shadow-md" // Smaller size using Tailwind classes
//                             />

//                             <div className="mt-4 flex justify-between">
//                             {/* Download and Reset buttons */}
//                                 <button
//                                     onClick={handleDownloadImage}
//                                     className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600"
//                                 >
//                                     Download Image
//                                 </button>

//                                 <button
//                                     onClick={handleReset}
//                                     className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600"
//                                 >
//                                     Reset
//                                 </button>
//                             </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ImageGenerator;


import React, { useState } from 'react';
import { updateProduct } from '../Redux/Product/productSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../axiosConfig';
import ExpireDate from '../component/ExpireDate';


const ImageGenerator = ({ item, onImageUpdate, setImageGenModal }) => {
    const dispatch = useDispatch();
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState('');
    const [imageBlob, setImageBlob] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: item?.title,
        description: item?.description,
        price: item?.price,
        discountedPrice:item?.discountedPrice,
        discountPercent:item?.discountPercent,
        quantity:item?.quantity,
        weight:item?.weight,
        category:item?.category,
        brand:item?.brand,
        image: null,
        slug:item?.slug,
        BarCode:item?.BarCode,
        stockType: item?.stockType,
        unit:item?.unit,
        purchaseRate: item?.purchaseRate,
        profitPercentage:item?.profitPercentage,
        HSN:item?.HSN,
        GST:item?.GST,
        retailPrice:item?.retailPrice,
        totalAmount:item?.totalAmount,
        amountPaid:item?.amountPaid,
      });

    const fetchImage = async (userPrompt) => {
        const hardcodedPrompt = "on a plain background, centered, and resembling a product image found on an e-commerce website, wrapped, branded, packet labelled like a grocery item (packaged food, snacks, or canned goods).";
        const finalPrompt = `${userPrompt}, ${hardcodedPrompt}`;

        try {
            const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer HuggingFace_API_KEY`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: finalPrompt })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const image_Blob = await response.blob();
            setImageBlob(image_Blob);
            const imageObjectURL = URL.createObjectURL(imageBlob);
            return imageObjectURL;
        } catch (error) {
            throw error;
        }
    };

    const handleGenerateImage = async (e) => {
        e.preventDefault();
        setError('');
        setGeneratedImage(null);
        setLoading(true);

        try {
            const imageObjectURL = await fetchImage(prompt);
            setGeneratedImage(imageObjectURL);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    const handleSetImage = async () => {
        const file = imageBlob;
        console.log("imageblob is: ",imageBlob);
        setForm((prevForm) => ({ ...prevForm, image: imageBlob }));
        if (!imageBlob || !(imageBlob instanceof Blob)) {
            console.error("Invalid image blob");
            return; 
        }
    
        // const imagefile = new File([imageBlob], "generated-image.png", { type: imageBlob.type });
        const imageFile = new File([imageBlob], "generated-image.png", { type: imageBlob.type });

        const formData = new FormData();
        
        formData.append("image", imageFile);

        formData.append("id", item._id); 
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("discountedPrice", form.discountedPrice);
        formData.append("discountPercent", form.discountPercent);
        formData.append("quantity", form.quantity);
        formData.append("brand", form.brand);
        formData.append("category", form.category);
        formData.append("ratings", form.ratings);
        formData.append("reviews", form.reviews);
        formData.append("BarCode", form.BarCode);
        formData.append("stockType", form.stockType);
        formData.append("unit", form.unit);
        formData.append("purchaseRate", form.purchaseRate);
        formData.append("profitPercentage", form.profitPercentage);
        formData.append("HSN", form.HSN);
        formData.append("GST", form.GST);
        formData.append("retailPrice", form.retailPrice);
        formData.append("totalAmount", form.totalAmount);
        formData.append("amountPaid", form.amountPaid);
        try {
            const response = await axiosInstance.put(`/product/update/${item._id}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            // return response.data.data;
            toast.success('Product updated successfully');
                setImageGenModal(false);

          } catch (error) {
            console.log(error);
            toast.error('Failed to update product');
          }
        // dispatch(updateProduct(productData)).then((response) => {
        //     if (response.error) {
        //         toast.error('Failed to update product');
        //     } else {
        //         toast.success('Product updated successfully');
        //         // onClose();
        //         setImageGenModal(false);

        //     }
        // );

        // try {
        //     const response = await fetch(`/api/products/${productId}/update-image`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ imageUrl: generatedImage })
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to update image');
        //     }

        //     const updatedProduct = await response.json();
        //     onImageUpdate(updatedProduct); 
            setImageGenModal(false); 
        // } catch (error) {
        //     setError(error.message);
        // }
    };

    const handleDownloadImage = () => {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'generated-image.png';
        link.click();
    };

    const handleReset = () => {
        setPrompt('');
        setGeneratedImage(null);
        setError('');
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 w-full ml-0 bg-opacity-50 backdrop-blur-sm">
              <ExpireDate/>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <button 
                    onClick={() => setImageGenModal(false)} 
                    className="top-2 flex pr-2 justify-end w-full right-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Generate your product Image</h2>
                <form onSubmit={handleGenerateImage}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Enter your product name and description
                            </label>
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                    </div>
                </form>
                {error && <div className="text-red-500 mt-4">{error}</div>}

                {loading && (
                    <div className="flex justify-center items-center mt-6">
                        <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {generatedImage && !loading && (
                    <div className="bg-white p-4 flex flex-col justify-center items-center rounded-lg shadow mt-6">
                        <h2 className="text-xl font-semibold mb-4">Generated Image:</h2>
                        <img 
                            src={generatedImage} 
                            alt="Generated from Prompt" 
                            className="max-w-xs mx-auto h-auto rounded-lg shadow-md"
                        />
                        <div className="mt-4 flex justify-between gap-4">
                            <button
                                onClick={handleDownloadImage}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600"
                            >
                                Download
                            </button>

                            <button
                                onClick={handleSetImage}
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
                            >
                                Save
                            </button>

                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
