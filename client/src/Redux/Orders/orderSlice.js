// src/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Async thunks for handling API requests
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  try {
    const response = await axiosInstance.get('/order/getAllOrderByCounter');
    console.log(response.data)
    return response.data.data;  // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async ({ paymentType, BillUser }) => {

  // console.log(" hallo",paymentType, "fello",BillUser )
  try {
    const response = await axiosInstance.post('/order/placeOrder', { paymentType, BillUser });
    console.log(response.data)
    return response.data;  // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order) => {
  try {
    const response = await axiosInstance.put(`/order/${order.id}`, order);
    return response.data;  // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId) => {
  try {
    await axiosInstance.delete(`/order/${orderId}`);
    return orderId;  // Return the ID of the deleted order
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
});

export const createPurchaseOrder = createAsyncThunk('purchaseOrders/createPurchaseOrder', async ({  products, orderDetails }) => {
  console.log(products)
  console.log(orderDetails)
  try {
    const response = await axiosInstance.post('/product/purchaseOrder', {products, orderDetails });
     console.log(response);
    return response.data;  // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create purchase order');
  }
});

// Initial state
const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

// Create slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createPurchaseOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.purchaseOrders.push(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;
