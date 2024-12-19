// src/pages/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cart')) || [], // Khôi phục giỏ hàng từ localStorage
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items?.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += 1; // Nếu sản phẩm đã có trong giỏ, tăng số lượng
      } else {
        state.items.push({ ...newItem, quantity: 1 }); // Nếu chưa có, thêm mới
      }

      // Lưu giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items?.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items)); // Cập nhật localStorage
    },
    clearCart: (state) => {
      state.items = []; // Xóa tất cả sản phẩm trong giỏ hàng
      localStorage.removeItem('cart'); // Xóa dữ liệu trong localStorage
    },
    incrementQuantity: (state, action) => {
      const item = state.items?.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1; // Tăng số lượng
        localStorage.setItem('cart', JSON.stringify(state.items)); // Cập nhật localStorage
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items?.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1; // Giảm số lượng nếu lớn hơn 1
        localStorage.setItem('cart', JSON.stringify(state.items)); // Cập nhật localStorage
      }
    },
    setCartItems: (state, action) => {
      // Cập nhật giỏ hàng từ một nguồn dữ liệu khác (ví dụ: sau khi load lại trang)
      state.items = action.payload;
      localStorage.setItem('cart', JSON.stringify(state.items)); // Cập nhật localStorage
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
