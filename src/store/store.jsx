import {configureStore, createReducer, createSlice} from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import authReducer from '../features/auth/authSlice';
import orderReducer from "../features/order/orderSlice";
import userReducer from "../features/user/userSlice";

export const store=configureStore({
    reducer:{
        cart:cartReducer,
        product:productReducer,
        auth: authReducer,
        order:orderReducer,
        user:userReducer,
    }

})

