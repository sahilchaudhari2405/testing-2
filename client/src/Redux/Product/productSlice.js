import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig.js';

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/products/product/create', productData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const importProducts = createAsyncThunk('products/importProducts', async (products, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/products/product/importProducts', { products });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/products/product/view');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const sortProducts = createAsyncThunk('products/sortProducts', async ({ barcode, description, category ,brand,weight,expiringDays,lowStock}) => {
 const name=description
  try {
    const response = await axiosInstance.post('/products/product/sortProducts',{ barcode, name, category ,brand,weight,expiringDays,lowStock});

    console.log(response)
    return response.data.data;  // Return the sorted orders data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to sort orders');
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/products/product/delete/${productId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/products/product/update/${id}`, productData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (prodCode, { rejectWithValue }) => {
 
 
  try {
    const response = await axiosInstance.get(`/products/product/view/${prodCode}`);
   console.log(response.data)
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetails: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(sortProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sortProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload)
        state.products = action.payload;
      })
      .addCase(sortProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter((product) => product._id !== action.meta.arg);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.products.findIndex((product) => product._id === action.payload._id);
        state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
