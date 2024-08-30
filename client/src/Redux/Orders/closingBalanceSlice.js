import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Async thunks for handling API requests related to ClosingBalance
export const fetchClosingBalance = createAsyncThunk('closingBalance/fetchClosingBalance', async () => {
  try {
    const response = await axiosInstance.get('/admin/Client');
    console.log('Closing Order fetch!!' ,response)

    return response.data;  // Return the data directly from axios response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch closing balances');
  }
});

export const createClosingBalance = createAsyncThunk('closingBalance/createClosingBalance', async ({ monthYear, balance }) => {
  try {
    const response = await axiosInstance.post('/admin/ClosingBalance', { monthYear, balance });
    return response.data;  // Return the newly created closing balance data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create closing balance');
  }
});

const closingBalanceSlice = createSlice({
  name: 'closingBalance',
  initialState: {
    closingBalances: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClosingBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClosingBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.closingBalances = action.payload;
      })
      .addCase(fetchClosingBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createClosingBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createClosingBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.closingBalances.push(action.payload);
      })
      .addCase(createClosingBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default closingBalanceSlice.reducer;
