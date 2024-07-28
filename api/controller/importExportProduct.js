import Product from '../model/product.model.js';
import { v4 as uuidv4 } from 'uuid';

export const importProducts = async (req, res) => {
  const products = req.body.products;

  try {
    const importedProducts = [];
    const skippedProducts = [];

    for (const productData of products) {
      // Remove the _id field if it exists to avoid duplicate key error
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
          newBarcode = uuidv4();
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
