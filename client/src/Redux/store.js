import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './Category/categoriesSlice';
import productReducer from './Product/productSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoriesReducer,

  },
});

export default store;
