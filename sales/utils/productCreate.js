import categorySchema from "../../products/model/category.model.js";
import { getTenantModel } from "../database/getTenantModel.js";
import productSchema from "../model/product.model.js";

// Create a category
async function CreateCategory(name, level, slug, parentId, CategoryModel) {
  const category = new CategoryModel({ name, level, slug, parentId });
  await category.save();
  return category;
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

// Create a product
const createProduct = async (formData, tenantId) => {
  try {
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const Category = await getTenantModel(tenantId, "Category", categorySchema);

    const parentCategory =
      (await Category.findOne({ name: "GENERAL" })) ||
      (await CreateCategory("GENERAL", 1, "general", null, Category));

    const categoryName =
      formData.title?.trim().substring(0, 50) ||
      formData.Name?.trim().substring(0, 50) ||
      `Category-${Math.random().toString(36).substring(7)}`;

    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await CreateCategory(
        categoryName,
        2,
        categoryName,
        parentCategory._id,
        Category
      );
    }

    const BarCode = await generateUniqueBarcode(Product);

    const product = new Product({
      title: formData.title || formData.description,
      description: formData.description || null,
      price: parseFloat(formData.total) || 0,
      discountedPrice: parseFloat(formData.saleRate) || 0,
      discountPercent: parseFloat(formData.discountPercent) || 0,
      weight: parseFloat(formData.weight) || 0,
      quantity: parseInt(formData.qty, 10) || 1,
      brand: formData.brand || null,
      imageUrl: formData.imageUrl ||
        "https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png",
      slug: formData.slug || "default-slug",
      ratings: formData.ratings || [],
      reviews: formData.reviews || [],
      numRatings: parseInt(formData.numRatings, 10) || 0,
      category: category._id,
      createdAt: formData.createdAt || new Date(),
      updatedAt: formData.updatedAt || new Date(),
      BarCode:BarCode,
      stockType: formData.stockType || null,
      unit: formData.unit || null,
      purchaseRate: parseFloat(formData.profit) || 0,
      profitPercentage: parseFloat(formData.profitPercentage) || 0,
      HSN: formData.hsn || null,
      GST: parseFloat(formData.gst) || 0,
      retailPrice: parseFloat(formData.saleRate) || 0,
      totalAmount: parseFloat(formData.saleRate) || 0,
      amountPaid: parseFloat(formData.amountPaid) || 0,
    });

    return await product.save();
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Product creation failed.");
  }
};

export default createProduct;
// barcode: "",
// brand: "",
// description: "",
// category: "",
// stockType: "",
// unit: "",
// qty: "",
// saleRate: "",
// profit: "",
// hsn: "",
// gst: "",
// total: "",