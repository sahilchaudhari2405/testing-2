import Category from '../model/category.model.js';
import Product from '../model/product.model.js';

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomString = 'B';

  // for (let i = 0; i < 3; i++) { 
  //   const randomIndex = Math.floor(Math.random() * characters.length);
  //   randomString += characters[randomIndex];
  // }

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomString += numbers[randomIndex];
  }

  return randomString;
}
function generateRandomStringCategory() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomString = '';

  for (let i = 0; i < characters.length; i++) { 
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  // for (let i = 0; i < 5; i++) { 
  //   const randomIndex = Math.floor(Math.random() * numbers.length);
  //   randomString += numbers[randomIndex];
  // }

  return randomString;
}

export const importProducts = async (req, res) => {
  const { products } = req.body;
  console.log(products);

  try {
    const importedProducts = [];
    const skippedProducts = [];

    for (const productData of products) {
      delete productData._id;
      let categoriesName = await generateRandomStringCategory();
      const parentCategory = await Category.findOne({ name: 'GENERAL' });

      if (productData.title && typeof productData.title === 'string') {
        categoriesName = productData.title.trim().substring(0, 50);
      } else if (productData.Name && typeof productData.Name === 'string') {
        categoriesName = productData.Name.trim().substring(0, 50);
      }

      let category = await Category.findOne({ name: categoriesName });

      if (!category) {
        if (!parentCategory) {
          console.log('no genral', category)
          const generalCategory = await CreateCategory('GENERAL', 1, 'general', null);
          category = await CreateCategory(categoriesName, 2, categoriesName, generalCategory._id);
        } else {
          category = await CreateCategory(categoriesName, 2, categoriesName, parentCategory._id);
        }
      }
 
      const barcode = productData.BarCode || productData.Barcode;
      console.log(productData.BarCode, 'new product');
      console.log(productData.Barcode, 'GST pad product');

      if (barcode && barcode !=0) {
        const existingProduct = await Product.findOne({ BarCode: barcode });

        if (existingProduct) {
          skippedProducts.push(productData);
          continue;
        }

        const result = productData.BarCode ? await NewimportGSTData(productData, category) : await importGSTData(productData, category);
        importedProducts.push(result);
      } else {
        let newBarcode;
        let isUnique = false;

        while (!isUnique) {
          newBarcode = generateRandomString();
          const checkBarcode = await Product.findOne({ BarCode: newBarcode });

          if (!checkBarcode) {
            isUnique = true;
          }
        }

        if (productData.BarCode) {
          productData.BarCode = newBarcode;
          const result = await NewimportGSTData(productData, category);
          importedProducts.push(result);
        } else {
          productData.Barcode = newBarcode;
          const result = await importGSTData(productData, category);
          importedProducts.push(result);
        }
      }
    }

    res.json({
      message: "Products imported successfully",
      status: true,
      data: importedProducts,
      skipped: skippedProducts,
    });
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

async function importGSTData(productData, category) {
  const product = new Product({
    title: productData.Name || null,
    description: productData.Name || null,
    price: parseFloat(productData.MRP) || 0,
    discountedPrice: parseFloat(productData['Net Sale']) || 0,
    discountPercent: parseFloat(productData.discountPercent) || 0,
    weight: parseFloat(productData.weight) || 0,
    quantity: parseInt(productData['Qty.'], 10) || 0,
    brand: productData.brand || null,
    imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
    slug: productData.Name || 'default-slug',
    ratings: productData.ratings || [],
    reviews: productData.reviews || [],
    numRatings: parseInt(productData.numRatings, 10) || 0,
    category: category._id,
    createdAt: productData.createdAt || null,
    updatedAt: productData.updatedAt || null,
    BarCode: productData.Barcode || null,
    stockType: productData.stockType || null,
    unit: productData.Unit || null,
    purchaseRate: parseFloat(productData['Purchase Rate']) || 0,
    profitPercentage: parseFloat(productData.profit) || 0,
    HSN: productData.CESS || null,
    GST: parseFloat(productData.TAX) || 0,
    retailPrice: parseFloat(productData['Net Sale']) || 0,
    totalAmount: parseFloat(productData['Net Sale']) || 0,
    amountPaid: parseFloat(productData.amountpaid) || 0
  });
  return await product.save();
}

async function NewimportGSTData(productData, category) {
  const product = new Product({
    title: productData.title || null,
    description: productData.description || null,
    price: parseFloat(productData.price) || 0,
    discountedPrice: parseFloat(productData.discountedPrice) || 0,
    discountPercent: parseFloat(productData.discountPercent) || 0,
    weight: parseFloat(productData.weight) || 0,
    quantity: parseInt(productData.quantity, 10) || 0,
    brand: productData.brand || null,
    imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
    slug: productData.slug || 'default-slug',
    ratings: productData.ratings || [],
    reviews: productData.reviews || [],
    numRatings: parseInt(productData.numRatings, 10) || 0,
    category: category._id,
    createdAt: productData.createdAt || null,
    updatedAt: productData.updatedAt || null,
    BarCode: productData.BarCode || null,
    stockType: productData.stockType || null,
    unit: productData.unit || null,
    purchaseRate: parseFloat(productData.purchaseRate) || 0,
    profitPercentage: parseFloat(productData.profitPercentage) || 0,
    HSN: productData.HSN || null,
    GST: parseFloat(productData.GST) || 0,
    retailPrice: parseFloat(productData.retailPrice) || 0,
    totalAmount: parseFloat(productData.totalAmount) || 0,
    amountPaid: parseFloat(productData.amountpaid) || 0
  });
  return await product.save();
}

async function CreateCategory(name, level, slug, parentCategory) {
  const category = new Category({
    name:name || "no data",
    level,
    slug:slug || "no data",
    parentCategory
  });
  return await category.save();
}
