import Product from '../model/product.model.js';
// import Rating from '../models/rating.model.js';
// import Review from '../models/review.model.js';
import slugify from 'slugify';
// import { uploadImageOnCloudinary } from '../cloud/cloudinary.js';
import fs from 'fs';
import mongoose from 'mongoose';
import categoryModel from '../model/category.model.js';
// mongoose.set('debug', true);
// Create product
// export const createProduct = async (req, res) => {
//   const { title, description, price, discountedPrice, discountPercent, quantity, brand, category, ratings, reviews } = req.body;

//   if (!title || !description || !price) {
//     return res.status(400).send({ message: "Title, description, and price are required", status: false });
//   }

//   try {
//     let imageUrl = '';
//     if (req.file) {
//       try {
//         const result = await uploadImageOnCloudinary(req.file.path);
//         imageUrl = result.secure_url;
//         fs.unlinkSync(req.file.path); // Remove the local file after uploading to Cloudinary
//       } catch (uploadError) {
//         console.error('Error uploading image to Cloudinary:', uploadError);
//         return res.status(500).send({ message: "Internal server error", status: false, error: "Error uploading image to Cloudinary" });
//       }
//     }

//     const slug = slugify(title, { lower: true });
//     const product = new Product({
//       title, description, price, discountedPrice, discountPercent, quantity, brand, imageUrl, category, slug
//     });

//     if (ratings) {
//       product.ratings = ratings;
//     }

//     if (reviews) {
//       product.reviews = reviews;
//     }

//     const savedProduct = await product.save();

//     return res.status(201).send({ message: "Product created successfully", status: true, data: savedProduct });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
//   }
// };

// View single product
export const viewProduct = async (req, res) => {

  const {id}  = req.params;
  console.log(id,"hallo")
  try {
    // Fetch product details using the barcode
    const product = await Product.findOne({ BarCode:id}).populate('category');
   
   console.log(product)


    if (!product) {
      return res.status(404).send({ message: "Product not found", status: false });
    }

    return res.status(200).send({ message: "Product retrieved successfully", status: true, data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};
export const SuggestProduct = async (req, res) => {
  const { CategoriesId } = req.query;
  try {
     const parentCategory = await categoryModel.findById(CategoriesId);
    const categories = await  categoryModel.find({ parentCategory: parentCategory.parentCategory});

    const categoryIds = categories.map(category => category._id);

    const products = await Product.find({ category: { $in: categoryIds } });

    return products;
  } catch (error) {
    console.error('Error finding products by parent category:', error);
    throw error;
  }
};
// Update product
// export const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, price, discountedPrice, discountPercent, quantity, brand, category, ratings, reviews } = req.body;

//   if (!title || !description || !price) {
//     return res.status(400).send({ message: "Title, description, and price are required", status: false });
//   }

//   try {
//     let imageUrl = '';
//     if (req.file) {
//       const result = await uploadImageOnCloudinary(req.file.path);
//       imageUrl = result.secure_url;
//       fs.unlinkSync(req.file.path); // Remove the local file after uploading to Cloudinary
//     } else {
//       // Fetch existing product to retain the current image URL
//       const existingProduct = await Product.findById(id);
//       if (!existingProduct) {
//         return res.status(404).send({ message: "Product not found", status: false });
//       }
//       imageUrl = existingProduct.imageUrl; // Retain the existing image URL
//     }

//     const slug = slugify(title, { lower: true });
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { title, description, price, discountedPrice, discountPercent, quantity, brand, imageUrl, category, slug },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).send({ message: "Product not found", status: false });
//     }

//     if (ratings) {
//       updatedProduct.ratings = ratings;
//     }

//     if (reviews) {
//       updatedProduct.reviews = reviews;
//     }

//     await updatedProduct.save();

//     return res.status(200).send({ message: "Product updated successfully", status: true, data: updatedProduct });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
//   }
// };

// Delete product
export const deleteProduct = async (req, res) => {
  const {id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found", status: false });
    }

    // await Rating.deleteMany({ product: id });
    // await Review.deleteMany({ product: id });

    return res.status(200).send({ message: "Product deleted successfully", status: true, data: deletedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};

// View all products
// Assuming you have a model named Product
export const viewProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query, default to 1
  const limit =50; // Get the limit from query, default to 20
  const skip = (page - 1) * limit; // Calculate how many products to skip
  try {
    // Query to get products sorted by updatedAt, with pagination
    const products = await Product.find()
      .sort({ updatedAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .populate('category');

    return res.status(200).send({ message: "Products retrieved successfully", status: true, data: products });
  } catch (error) {
    console.error(error);  
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};


// ========================filter products in inventory=====================================
export const sortProducts = async (req, res) => {
  try {
    const {barcode, name, category ,brand,weight,expiringDays,lowStock} = req.body;
    let query = {};
    const noOtherFilters = !barcode && !name && !category && !brand && !weight && !expiringDays;

    //  console.log(noOtherFilters);
     
    // if(lowStock && noOtherFilters)
    // {      let sortedProducts=[];
    //   sortedProducts = await Product.find()
    //   .sort({ quantity: 1 }) 
    //   .limit(100) 
    //   .populate('category');
    //   return res.status(200).send({ 
    //     message: "Only Low stock products retrieved successfully", 
    //     status: true, 
    //     data: sortedProducts,  
    //   });
    // }
    console.log("yes");
    // Add date range filter if fromDate and toDate are provided
    if (barcode) {
      query.BarCode =barcode
    }
  if(brand){
    query.brand ={ $regex: brand, $options: 'i' }
  }
  if(weight){
    query.weight =weight
  }
    // Add name filter if provided

    if (name) {
        query.title = { $regex: name, $options: 'i' }; // 'i' for case-insensitive
      }
   
      // if (category) {
      //   query. = { $regex: name, $options: 'i' }; // 'i' for case-insensitive
      // }


    // Query to get products sorted by discount and createdAt
    const products = await Product.find(query)
      .limit(100)
      .populate('category');
    //  console.log(products)
    // console.log("hallo")
    let filteredProducts=[]
    if(category){
      console.log("getting categories",category);
       filteredProducts = products.filter(product =>
        product.category?.name.toLowerCase().startsWith(category.toLowerCase())
      );
    }else{
      filteredProducts=products
    }
    

    // console.log(filteredProducts)
      let sortedProducts=[];

      if(lowStock){
        sortedProducts = filteredProducts.sort((a, b) => a.quantity - b.quantity);
      }else{
        sortedProducts = filteredProducts
      }
    return res.status(200).send({ message: "Products retrieved successfully", status: true, data: sortedProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};

export const sortProductsfordescription = async (req, res) => {
  try {
    const {description} = req.body;
    let query = {};
    const noOtherFilters = !description;

     console.log(noOtherFilters);
     
    if(noOtherFilters){
      let sortedProducts=[];
      sortedProducts = await Product.find()
      .sort({ quantity: 1 }) 
      .limit(100) 
      .populate('category');
      return res.status(200).send({ 
        message: "Only Low stock products retrieved successfully", 
        status: true, 
        data: sortedProducts, 
      });
    }
    console.log("yes");

    if (description) {
      query.description = { $regex: `^${description}`, $options: 'i' }; // 'i' for case-insensitive
    }
   

    console.log(query);
    // Query to get products sorted by discount and createdAt
    const products = await Product.find(query)
      .limit(100)
      .populate('category');
    
    return res.status(200).send({ message: "Products retrieved successfully", status: true, data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};




export const createProduct = async (req, res) => {
  const { 
    title,
    description,
    price,
    discountedPrice,
    discountPercent,
    quantity,
    weight,
    brand,
    category,
    ratings,
    reviews,
    // FIELDS FOR OFFLINE COUNTER PURCHASES
    BarCode,
    stockType,
    unit,
    purchaseRate,
    profitPercentage,
    HSN,
    GST,
    retailPrice,
    totalAmount,
    amountPaid
    } = req.body;
console.log(req.body)
  try {
    let imageUrl = '';
    if (req.file) {
      try {
        const result = await uploadImageOnCloudinary(req.file.path);
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path); 
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return res.status(500).send({ message: "Internal server error", status: false, error: "Error uploading image to Cloudinary" });
      }
    }

    const slug = slugify(title, { lower: true });
    const productData = {};
    if (title) productData.title = title;
    if (description) productData.description = description;
    if (price) productData.price = price;
    if (discountedPrice) productData.discountedPrice = discountedPrice;
    if (discountPercent) productData.discountPercent = discountPercent;
    if (quantity) productData.quantity = quantity;
    if (weight) productData.weight = weight;
    if (brand) productData.brand = brand;
    if (imageUrl) productData.imageUrl = imageUrl;
    if (category) productData.category = category;
    if (slug) productData.slug = slug;
    if (ratings) productData.ratings = ratings;
    if (reviews) productData.reviews = reviews;
    if (BarCode) productData.BarCode = BarCode;
    if (stockType) productData.stockType = stockType;
    if (unit) productData.unit = unit;
    if (purchaseRate) productData.purchaseRate = purchaseRate;
    if (profitPercentage) productData.profitPercentage = profitPercentage;
    if (HSN) productData.HSN = HSN;
    if (GST) productData.GST = GST;
    if (retailPrice) productData.retailPrice = retailPrice;
    if (totalAmount) productData.totalAmount = totalAmount;
    if (amountPaid) productData.amountPaid = amountPaid;

    const product = new Product(productData);
    
    const savedProduct = await product.save();

    return res.status(201).send({ message: "Product created successfully", status: true, data: savedProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};




export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    discountedPrice,
    discountPercent,
    quantity,
    brand,
    category,
    ratings,
    reviews,
    // FIELDS FOR OFFLINE COUNTER PURCHASES
    BarCode,
    stockType,
    unit,
    purchaseRate,
    profitPercentage,
    HSN,
    GST,
    retailPrice,
    totalAmount,
    amountPaid
  } = req.body;

  try {
    let imageUrl = '';
    if (req.file) {
      try {
        const result = await uploadImageOnCloudinary(req.file.path);
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path); 
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return res.status(500).send({ message: "Internal server error", status: false, error: "Error uploading image to Cloudinary" });
      }
    } else {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).send({ message: "Product not found", status: false });
      }
      imageUrl = existingProduct.imageUrl;
    }
    let slug;
    if (title){
       slug = slugify(title, { lower: true });
    }

    const updatedProductData = {};
    if (title) updatedProductData.title = title;
    if (description) updatedProductData.description = description;
    if (price) updatedProductData.price = price;
    if (discountedPrice) updatedProductData.discountedPrice = discountedPrice;
    if (discountPercent) updatedProductData.discountPercent = discountPercent;
    if (quantity) updatedProductData.quantity = quantity;
    if (brand) updatedProductData.brand = brand;
    if (imageUrl) updatedProductData.imageUrl = imageUrl;
    if (category) updatedProductData.category = category;
    if (slug) updatedProductData.slug = slug;
    if (ratings) updatedProductData.ratings = ratings;
    if (reviews) updatedProductData.reviews = reviews;
    if (BarCode) updatedProductData.BarCode = BarCode;
    if (stockType) updatedProductData.stockType = stockType;
    if (unit) updatedProductData.unit = unit;
    if (purchaseRate) updatedProductData.purchaseRate = purchaseRate;
    if (profitPercentage) updatedProductData.profitPercentage = profitPercentage;
    if (HSN) updatedProductData.HSN = HSN;
    if (GST) updatedProductData.GST = GST;
    if (retailPrice) updatedProductData.retailPrice = retailPrice;
    if (totalAmount) updatedProductData.totalAmount = totalAmount;
    if (amountPaid) updatedProductData.amountPaid = amountPaid;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedProductData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found", status: false });
    }

    return res.status(200).send({ message: "Product updated successfully", status: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).send({ message: "Internal server error", status: false, error: error.message });
  }
};