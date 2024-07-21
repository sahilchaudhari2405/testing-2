import { configureStore } from '@reduxjs/toolkit';
import userReducer from './User/userSlices';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;
