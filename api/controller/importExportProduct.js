import Product from '../model/product.model.js';

export const importProducts = async (req, res) => {
  const products = req.body.products;
  console.log("inside importprodcut controller received product are :",products);

  // try {
  //   const importedProducts = [];
  //   const skippedProducts = [];

  //   for (const productData of products) {
  //     // Remove the _id field if it exists to avoid duplicate key error
  //     delete productData._id;

  //     let existingProduct = await Product.findOne({ slug: productData.slug });

  //     if (existingProduct) {
  //       // Skip the product if it already exists based on the slug
  //       skippedProducts.push(productData);
  //       continue;
  //     }

  //     existingProduct = await Product.findOne({ BarCode: productData.BarCode });

  //     if (existingProduct) {
  //       // Find the maximum integer barcode value in the database
  //       const maxBarcodeProduct = await Product.findOne().sort({ BarCode: -1 }).limit(1);
  //       let newBarcode = maxBarcodeProduct ? maxBarcodeProduct.BarCode + 1 : 1;
        
  //       productData.BarCode = newBarcode;
  //     }

  //     const product = new Product(productData);
  //     const savedProduct = await product.save();
  //     importedProducts.push(savedProduct);
  //   }

  //   res.json({
  //     message: "Products imported successfully",
  //     status: true,
  //     data: importedProducts,
  //     skipped: skippedProducts,
  //   });
  // } catch (error) {
  //   console.error('Error processing products:', error);
  //   res.status(500).json({ success: false, error: 'Internal Server Error' });
  // }
};










//import Product from '../model/product.model.js';
// function generateRandomString() {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const numbers = '0123456789';

//   let randomString = 'B';

//   // for (let i = 0; i < 3; i++) {
//   //   const randomIndex = Math.floor(Math.random() * characters.length);
//   //   randomString += characters[randomIndex];
//   // }

//   for (let i = 0; i < 6; i++) {
//     const randomIndex = Math.floor(Math.random() * numbers.length);
//     randomString += numbers[randomIndex];
//   }

//   return randomString;
// }
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
