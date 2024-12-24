import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/sales/cart/getCart');
    const items = [response.data.data.cartItems, response.data.data];
    // console.log(response)
    return items;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue({ isUnauthorized: true });
    }
    return rejectWithValue(error.response.data);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (productCode, { rejectWithValue }) => {
// console.log(productId)
  try {
    const response = await axiosInstance.post('/sales/cart/addCart', { productCode });
    if (response.data.success) {
      toast.success('Product added to cart');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue({ isUnauthorized: true });
    }
    // toast.error('Failed to add product to cart');
    return rejectWithValue(error.response.data);
  }
});

export const addQuantity = createAsyncThunk('cart/addQuantity', async (productId) => {
  const response = await axiosInstance.post('/sales/cart/addCart', { productId });
  return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId) => {
  const response = await axiosInstance.delete(`/sales/cart/removeOneCart?itemId=${productId}`);
  // console.log(response)
  return response.data;
});

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await axiosInstance.delete('/cart/removeAllCart');
});

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ productId }) => {
  const response = await axiosInstance.delete(`/sales/cart/removeItemQuantity?itemId=${productId}`);
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    addToCartStatus: 'idle',
    addToCartError: null,
    fetchCartError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.fetchCartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.fetchCartError = action.payload;
        state.items[0] = [];
     
      })
      .addCase(addToCart.pending, (state) => {
        state.addToCartStatus = 'loading';
        state.addToCartError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addToCartStatus = 'succeeded';
        if (state.items[1]) {
          state.items[1]=action.payload;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartStatus = 'failed';
        state.addToCartError = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          state.items[0] = state.items[0].filter(item => item._id !== data._id);
          toast.success('Product removed from cart');
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items[0] = [];
        toast.success('Cart cleared');
      })
      .addCase(addQuantity.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          const existingItem = state.items[0].find(item => item._id === data._id);
          if (existingItem) {
            existingItem.quantity = data.quantity;
          }
        }
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          const existingItem = state.items[0].find(item => item._id === data._id);
          if (existingItem) {
            existingItem.quantity = data.quantity;
          }
        }
      });
  },
});

export default cartSlice.reducer;
