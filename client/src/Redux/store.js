import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './Category/categoriesSlice';
import productReducer from './Product/productSlice';
import userReducer from './User/userSlices';
const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoriesReducer,
    user: userReducer
  },
});

export default store;
