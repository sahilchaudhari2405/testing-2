import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './Category/categoriesSlice';
import productReducer from './Product/productSlice';
import userReducer from './User/userSlices';
import ordersReducer from './Orders/orderSlice'
import OnGoingcartReducer from './Cart/OnGoingCartSlice';
import cartReducer from './Cart/cartSlice';

import closingBalanceSlice from './Orders/closingBalanceSlice';
const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoriesReducer,
    user: userReducer,
    orders: ordersReducer,
    cart: cartReducer,
    OnGoingcart:OnGoingcartReducer,
    closingBalance: closingBalanceSlice,
  },
});

export default store;
