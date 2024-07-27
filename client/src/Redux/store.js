import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './Category/categoriesSlice';
import productReducer from './Product/productSlice';
import userReducer from './User/userSlices';
import ordersReducer from './Orders/orderSlice'
import cartReducer from './Cart/cartSlice';
const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoriesReducer,
    user: userReducer,
    orders: ordersReducer,
    cart: cartReducer,
  },
});

export default store;
