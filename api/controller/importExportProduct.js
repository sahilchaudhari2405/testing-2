
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
export const importProducts = async (req, res) => {
  const {products} = req.body;
  console.log(products) ;
  try {
    const importedProducts = [];
    const skippedProducts = [];

    for (const productData of products) {
      const category = await Category.findOne({name: productData.Category});
       if(productData.Barcode)
       {
        let existingProduct = await Product.findOne({ BarCode: productData.Barcode });
        
        if (existingProduct) {
          
          skippedProducts.push(productData);
          continue;
        }
        const product = new  Product({
          title: productData.Name || null,
          description: productData.Name || null,
          price: parseFloat(productData.MRP) || 0,
          discountedPrice: parseFloat(productData['Net Sale']) || 0,
          discountPercent: parseFloat(productData.discountPercent) || 0,
          weight: parseFloat(productData.weight) || 0,
          quantity: parseInt(productData['Qty.'], 10) || 0,
          brand: productData.brand || null,
          imageUrl: productData.imageUrl || null,
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
        const savedProduct = await product.save();
        importedProducts.push(savedProduct);
       }
       else{
                 let newBarcode;
        let isUnique = false;

        while (!isUnique) {
            newBarcode = generateRandomString();
            const checkBarcode = await Product.findOne({ BarCode: newBarcode });

          if (!checkBarcode) {
            isUnique = true;
          }
        }

        productData.Barcode = newBarcode;
  
        const product = new  Product({
          title: productData.Name || null,
          description: productData.Name || null,
          price: parseFloat(productData.MRP) || 0,
          discountedPrice: parseFloat(productData['Net Sale']) || 0,
          discountPercent: parseFloat(productData.discountPercent) || 0,
          weight: parseFloat(productData.weight) || 0,
          quantity: parseInt(productData['Qty.'], 10) || 0,
          brand: productData.brand || null,
          imageUrl: productData.imageUrl || null,
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
        const savedProduct = await product.save();
        importedProducts.push(savedProduct);
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











// export const importProducts = async (req, res) => {
//   const products = req.body;
//     console.log(req.body);
//   // try {
//   //   const importedProducts = [];
//   //   const skippedProducts = [];

//   //   for (const productData of products) {
//   //     // Remove the _id field if it exists to avoid duplicate key erro
//   //     delete productData._id;

//   //     let existingProduct = await Product.findOne({ slug: productData.slug });

//   //     if (existingProduct) {
//   //       skippedProducts.push(productData);
//   //       continue;
//   //     }

//   //     existingProduct = await Product.findOne({ BarCode: productData.BarCode });

//   //     if (existingProduct) {
//   //       let newBarcode;
//   //       let isUnique = false;

//   //       while (!isUnique) {
            
//   //           const checkBarcode = await Product.findOne({ BarCode: newBarcode });

//   //         if (!checkBarcode) {
//   //           isUnique = true;
//   //         }
//   //       }

//   //       productData.BarCode = newBarcode;
//   //     }

//   //     const product = new Product(productData);
//   //     const savedProduct = await product.save();
//   //     importedProducts.push(savedProduct);
//   //   }

//   //   res.json({
//   //     message: "Products imported successfully",
//   //     status: true,
//   //     data: importedProducts,
//   //     skipped: skippedProducts,
//   //   });
//   // } catch (error) {
//   //   console.error('Error processing products:', error);
//   //   res.status(500).json({ success: false, error: 'Internal Server Error' });
//   // }
// };
