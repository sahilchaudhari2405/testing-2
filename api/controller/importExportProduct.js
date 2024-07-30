import Product from '../model/product.model.js';
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let randomString = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomString += numbers[randomIndex];
  }

  return randomString;
}
export const importProducts = async (req, res) => {
  const products = req.body.products;
    console.log(products);
  try {
    const importedProducts = [];
    const skippedProducts = [];

    for (const productData of products) {
      // Remove the _id field if it exists to avoid duplicate key erro
      delete productData._id;

      let existingProduct = await Product.findOne({ slug: productData.slug });

      if (existingProduct) {
        // Skip the product if it already exists based on the slug
        skippedProducts.push(productData);
        continue;
      }

      existingProduct = await Product.findOne({ BarCode: productData.BarCode });

      if (existingProduct) {
        let newBarcode;
        let isUnique = false;

        while (!isUnique) {
            newBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();  
            const checkBarcode = await Product.findOne({ BarCode: newBarcode });

          if (!checkBarcode) {
            isUnique = true;
          }
        }

        productData.BarCode = newBarcode;
      }

      const product = new Product(productData);
      const savedProduct = await product.save();
      importedProducts.push(savedProduct);
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

