import { getTenantModel } from "../database/getTenantModel.js";
import categorySchema from "../model/category.model.js";
import productSchema from "../model/product.model.js";

async function CreateCategory(name, level, slug, parentId, CategoryModel) {
  const category = new CategoryModel({ name, level, slug, parentId });
  await category.save();
  return category;
}

// Helper function to generate a random category name
function generateRandomStringCategory() {
  return `Category-${Math.random().toString(36).substring(7)}`;
}

// Helper function to generate a random barcode
function generateRandomString() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Helper function to generate a unique barcode
async function generateUniqueBarcode(ProductModel) {
  let isUnique = false;
  let newBarcode;
  while (!isUnique) {
    newBarcode = generateRandomString();
    const existing = await ProductModel.findOne({ BarCode: newBarcode });
    if (!existing) {
      isUnique = true;
    }
  }
  return newBarcode;
}

// Utility function to parse product data fields
function parseField(value, type = "string") {
  if (type === "float") return parseFloat(value) || 0;
  if (type === "int") return parseInt(value, 10) || 0;
  return value || null;
}

// Main importProducts function
 const importProducts = async (req, res) => {
  const { products,imageUrl } = req.body;
   console.log(imageUrl)
  try {
    const tenantId = req.user.tenantId;
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const Category = await getTenantModel(tenantId, "Category", categorySchema);

    const newProducts = [];
    const updateOperations = [];
    const newCategories = [];
    const categoryMap = new Map();

    const parentCategory =
      (await Category.findOne({ name: "GENERAL" })) ||
      (await CreateCategory("GENERAL", 1, "general", null, Category));

    for (const productData of products) {
      delete productData._id;

      const categoryName =
        productData.title?.trim().substring(0, 50) ||
        productData.Name?.trim().substring(0, 50) ||
        generateRandomStringCategory();

      if (!categoryMap.has(categoryName)) {
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await CreateCategory(
            categoryName,
            2,
            categoryName,
            parentCategory._id,
            Category
          );
          newCategories.push(category);
        }
        categoryMap.set(categoryName, category);
      }

      const category = categoryMap.get(categoryName);
      const barcode = productData.BarCode || productData.Barcode;

      if (barcode) {
        const existingProduct = await Product.findOne({ BarCode: barcode });
        if (existingProduct) {
          const updateData = buildUpdateData(productData,imageUrl);
          updateOperations.push({
            updateOne: {
              filter: { BarCode: barcode },
              update: { $set: updateData },
            },
          });
        } else {
          const newProduct = buildNewProductData(productData, category,imageUrl);
          newProducts.push(newProduct);
        }
      } else {
        const newBarcode = await generateUniqueBarcode(Product);
        productData.BarCode = newBarcode;
        const newProduct = buildNewProductData(productData, category,imageUrl);
        newProducts.push(newProduct);
      }
      console.log("data", barcode)
    }

    // Before bulk insertion of new categories
    if (newCategories.length) {
      // Check for existing categories to avoid duplication
      const existingCategories = await Category.find({
        name: { $in: newCategories.map((cat) => cat.name) },
      });

      // Filter out categories already in the database
      const existingNames = new Set(existingCategories.map((cat) => cat.name));
      const uniqueCategories = newCategories.filter(
        (cat) => !existingNames.has(cat.name)
      );

      if (uniqueCategories.length) {
        await Category.insertMany(uniqueCategories);
      }
    }
    if (newProducts.length) {
      await Product.insertMany(newProducts);
    }

    if (updateOperations.length) {
      await Product.bulkWrite(updateOperations);
    }
    console.log("insert data success");
    res.json({
      message: "Products imported successfully",
      status: true,
      imported: newProducts.length,
      updated: updateOperations.length,
      categoriesAdded: newCategories.length,
    });
  } catch (error) {
    console.error("Error importing products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
function buildNewProductData(productData, category,imageUrl) {
  const isGSTPad = !productData.BarCode; // Determine data format

  return {
    title: parseField(isGSTPad ? productData.Name : productData.title),
    description: parseField(
      isGSTPad ? productData.Name : productData.description
    ),
    price: parseField(isGSTPad ? productData.MRP : productData.price, "float"),
    discountedPrice: parseField(
      isGSTPad ? productData["Net Sale"] : productData.discountedPrice,
      "float"
    ),
    discountPercent: parseField(productData.discountPercent, "float"),
    weight: parseField(productData.weight, "float"),
    quantity: parseField(
      isGSTPad ? productData["Qty."] : productData.quantity,
      "int"
    ),
    brand: parseField(productData.brand),
    imageUrl:productData.imageUrl || imageUrl,
    slug:
      parseField(isGSTPad ? productData.Name : productData.slug, "string") ||
      "default-slug",
    ratings: productData.ratings || [],
    reviews: productData.reviews || [],
    numRatings: parseField(productData.numRatings, "int"),
    category: category._id,
    createdAt: productData.createdAt || new Date(),
    updatedAt: productData.updatedAt || new Date(),
    BarCode: parseField(isGSTPad ? productData.Barcode : productData.BarCode),
    stockType: parseField(productData.stockType),
    unit: parseField(isGSTPad ? productData.Unit : productData.unit),
    purchaseRate: parseField(
      isGSTPad ? productData["Purchase Rate"] : productData.purchaseRate,
      "float"
    ),
    profitPercentage: parseField(
      isGSTPad ? productData.profit : productData.profitPercentage,
      "float"
    ),
    HSN: parseField(isGSTPad ? productData.CESS : productData.HSN),
    CGST: parseField(isGSTPad ? productData.TAX/2 : productData.CGST, "float"),
    SGST: parseField(isGSTPad ? productData.TAX/2 : productData.SGST, "float"),
    retailPrice: parseField(
      isGSTPad ? productData["Net Sale"] : productData.retailPrice,
      "float"
    ),
    totalAmount: parseField(
      isGSTPad ? productData["Net Sale"] : productData.totalAmount,
      "float"
    ),
    amountPaid: parseField(productData.amountpaid, "float"),
  };
}

// Helper function to build update data
function buildUpdateData(productData,imageUrl) {
  const isGSTPad = !productData.BarCode; // Determine data format

  return {
    retailPrice: parseField(
      isGSTPad ? productData["Net Sale"] : productData.retailPrice,
      "float"
    ),
    totalAmount: parseField(
      isGSTPad ? productData["Net Sale"] : productData.totalAmount,
      "float"
    ),
    imageUrl:productData.imageUrl || imageUrl,
    amountPaid: parseField(productData.amountpaid, "float"),
    quantity: parseField(
      isGSTPad ? productData["Qty."] : productData.quantity,
      "int"
    ),
    price: parseField(isGSTPad ? productData.MRP : productData.price, "float"),
    discountedPrice: parseField(
      isGSTPad ? productData["Net Sale"] : productData.discountedPrice,
      "float"
    ),
    purchaseRate: parseField(
      isGSTPad ? productData["Purchase Rate"] : productData.purchaseRate,
      "float"
    ),
    profitPercentage: parseField(
      isGSTPad ? productData.profit : productData.profitPercentage,
      "float"
    ),
    discountPercent: parseField(productData.discountPercent, "float"),
  };
}
export default importProducts;
// function generateRandomString() {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';

//   let randomString = 'B';

//   // for (let i = 0; i < 3; i++) {
//   //   const randomIndex = Math.floor(Math.random() * characters.length);
//   //   randomString += characters[randomIndex];
//   // }

//   for (let i = 0; i < 5; i++) {
//     const randomIndex = Math.floor(Math.random() * numbers.length);
//     randomString += numbers[randomIndex];
//   }

//   return randomString;
// }
// function generateRandomStringCategory() {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';

//   let randomString = '';

//   for (let i = 0; i < characters.length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     randomString += characters[randomIndex];
//   }

//   // for (let i = 0; i < 5; i++) {
//   //   const randomIndex = Math.floor(Math.random() * numbers.length);
//   //   randomString += numbers[randomIndex];
//   // }

//   return randomString;
// }

// export const importProducts = async (req, res) => {
//   const { products } = req.body;
//   console.log(products);

//   try {
//     const importedProducts = [];
//     const skippedProducts = [];
//     const tenantId = req.user.tenantId;
//     const Product = await getTenantModel(tenantId, "Product", productSchema);
//     const Category = await getTenantModel(tenantId, "Category", categorySchema);
//     for (const productData of products) {
//       delete productData._id;
//       let categoriesName = await generateRandomStringCategory();
//       const parentCategory = await Category.findOne({ name: 'GENERAL' });

//       if (productData.title && typeof productData.title === 'string') {
//         categoriesName = productData.title.trim().substring(0, 50);
//       } else if (productData.Name && typeof productData.Name === 'string') {
//         categoriesName = productData.Name.trim().substring(0, 50);
//       }

//       let category = await Category.findOne({ name: categoriesName });

//       if (!category) {
//         if (!parentCategory) {
//           console.log('no genral', category)
//           const generalCategory = await CreateCategory('GENERAL', 1, 'general', null,Category);
//           category = await CreateCategory(categoriesName, 2, categoriesName, generalCategory._id,Category);
//         } else {
//           category = await CreateCategory(categoriesName, 2, categoriesName, parentCategory._id,Category);
//         }
//       }

//       const barcode = productData.BarCode || productData.Barcode;
//       console.log(productData.BarCode, 'new product');
//       console.log(productData.Barcode, 'GST pad product');

//       if (barcode && barcode !=0) {
//         const existingProduct = await Product.findOne({ BarCode: barcode });

//         if (existingProduct) {
//           productData.BarCode? await updateProductData(productData,existingProduct): await updateProductDataGSTPad(productData,existingProduct);
//           skippedProducts.push(productData);
//           continue;
//         }

//         const result = productData.BarCode ? await NewimportGSTData(productData, category,tenantId) : await importGSTData(productData, category,tenantId);
//         importedProducts.push(result);
//       } else {
//         let newBarcode;
//         let isUnique = false;

//         while (!isUnique) {
//           newBarcode = generateRandomString();
//           const checkBarcode = await Product.findOne({ BarCode: newBarcode });

//           if (!checkBarcode) {
//             isUnique = true;
//           }
//         }

//         if (productData.BarCode) {
//           productData.BarCode = newBarcode;
//           const result = await NewimportGSTData(productData, category,tenantId);
//           importedProducts.push(result);
//         } else {
//           productData.Barcode = newBarcode;
//           const result = await importGSTData(productData, category,tenantId);
//           importedProducts.push(result);
//         }
//       }
//     }

//     res.json({
//       message: "Products imported successfully",
//       status: true,
//       data: importedProducts,
//       skipped: skippedProducts,
//     });
//   } catch (error) {
//     console.error('Error processing products:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// // };
// async function updateProductDataGSTPad(productData, existingProduct) {
//   if (existingProduct) {
//     // Update fields for the existing product
//     existingProduct.retailPrice = parseFloat(productData['Net Sale']) || 0;
//     existingProduct.totalAmount = parseFloat(productData['Net Sale']) || 0;
//     existingProduct.amountPaid = parseFloat(productData.amountpaid) || 0;
//     existingProduct.quantity = parseInt(productData['Qty.'], 10) || 0;
//     existingProduct.price = parseFloat(productData.MRP) || 0;
//     existingProduct.discountedPrice = parseFloat(productData['Net Sale']) || 0;
//     existingProduct.purchaseRate = parseFloat(productData['Purchase Rate']) || 0;
//     existingProduct.profitPercentage = parseFloat(productData.profit) || 0;
//     existingProduct.discountPercent = parseFloat(productData.discountPercent) || 0;

//     // Save the updated product to the database
//     await existingProduct.save();
//   }
// }
// async function updateProductData(productData, existingProduct) {
//   if (existingProduct) {
//     // Update fields for the existing product
//     existingProduct.retailPrice = parseFloat(productData.retailPrice) || 0;
//     existingProduct.totalAmount = parseFloat(productData.totalAmount) || 0;
//     existingProduct.amountPaid = parseFloat(productData.amountpaid) || 0;
//     existingProduct.quantity = parseInt(productData.quantity, 10) || 0;
//     existingProduct.price = parseFloat(productData.price) || 0;
//     existingProduct.discountedPrice = parseFloat(productData.discountedPrice) || 0;
//     existingProduct.purchaseRate = parseFloat(productData.purchaseRate) || 0;
//     existingProduct.profitPercentage = parseFloat(productData.profitPercentage) || 0;
//     existingProduct.discountPercent = parseFloat(productData.discountPercent) || 0;
//     await existingProduct.save();
//   }
// }
// async function importGSTData(productData, category,Product) {

//   const product = new Product({
//     title: productData.Name || null,
//     description: productData.Name || null,
//     price: parseFloat(productData.MRP) || 0,
//     discountedPrice: parseFloat(productData['Net Sale']) || 0,
//     discountPercent: parseFloat(productData.discountPercent) || 0,
//     weight: parseFloat(productData.weight) || 0,
//     quantity: parseInt(productData['Qty.'], 10) || 0,
//     brand: productData.brand || null,
//     imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
//     slug: productData.Name || 'default-slug',
//     ratings: productData.ratings || [],
//     reviews: productData.reviews || [],
//     numRatings: parseInt(productData.numRatings, 10) || 0,
//     category: category._id,
//     createdAt: productData.createdAt || null,
//     updatedAt: productData.updatedAt || null,
//     BarCode: productData.Barcode || null,
//     stockType: productData.stockType || null,
//     unit: productData.Unit || null,
//     purchaseRate: parseFloat(productData['Purchase Rate']) || 0,
//     profitPercentage: parseFloat(productData.profit) || 0,
//     HSN: productData.CESS || null,
//     GST: parseFloat(productData.TAX) || 0,
//     retailPrice: parseFloat(productData['Net Sale']) || 0,
//     totalAmount: parseFloat(productData['Net Sale']) || 0,
//     amountPaid: parseFloat(productData.amountpaid) || 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });
//   return await product.save();
// }

// async function NewimportGSTData(productData, category,Product) {

//   const product = new Product({
//     title: productData.title || null,
//     description: productData.description || null,
//     price: parseFloat(productData.price) || 0,
//     discountedPrice: parseFloat(productData.discountedPrice) || 0,
//     discountPercent: parseFloat(productData.discountPercent) || 0,
//     weight: parseFloat(productData.weight) || 0,
//     quantity: parseInt(productData.quantity, 10) || 0,
//     brand: productData.brand || null,
//     imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
//     slug: productData.slug || 'default-slug',
//     ratings: productData.ratings || [],
//     reviews: productData.reviews || [],
//     numRatings: parseInt(productData.numRatings, 10) || 0,
//     category: category._id,
//     createdAt: productData.createdAt || null,
//     updatedAt: productData.updatedAt || null,
//     BarCode: productData.BarCode || null,
//     stockType: productData.stockType || null,
//     unit: productData.unit || null,
//     purchaseRate: parseFloat(productData.purchaseRate) || 0,
//     profitPercentage: parseFloat(productData.profitPercentage) || 0,
//     HSN: productData.HSN || null,
//     GST: parseFloat(productData.GST) || 0,
//     retailPrice: parseFloat(productData.retailPrice) || 0,
//     totalAmount: parseFloat(productData.totalAmount) || 0,
//     amountPaid: parseFloat(productData.amountpaid) || 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });
//   return await product.save();
// }

// async function CreateCategory(name, level, slug, parentCategory,Category) {

//   const category = new Category({
//     name:name || "no data",
//     level,
//     slug:slug || "no data",
//     parentCategory
//   });
//   return await category.save();
// }
