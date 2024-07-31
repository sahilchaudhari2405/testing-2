
import Product from "../model/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const test = async (req,res) => {
    await Product.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};

export default test;
 