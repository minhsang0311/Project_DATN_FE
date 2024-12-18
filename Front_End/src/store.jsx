
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./client/reducers/authSlice";
import cartReducer from "./client/pages/cartSlice"
export const store = configureStore({
    reducer: {
        auth: authSlice,
        cart: cartReducer,
    }
})