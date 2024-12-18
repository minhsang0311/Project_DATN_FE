
import Toaster from  'react-hot-toast'
// import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Component Admin
import HomeAdmin from './admin/components/HomeAdmin.js';
import ProductList from './admin/pages/productPage/ProductList.jsx';
import ProductAdd from './admin/pages/productPage/ProductAdd.jsx';
import CategoryList from './admin/pages/categoryPage/CategoryList.jsx';
import CategoryAdd from './admin/pages/categoryPage/CategoryAdd.jsx';
import CategoryUpdate from './admin/pages/categoryPage/CategoryUpdate.jsx';
import ProductUpdate from './admin/pages/productPage/ProductUpdate.jsx';
import Comments from './admin/pages/commentPage/commentList.jsx';
import Statistics from './admin/pages/Statistics/Statistics.jsx';
import AdminOrder from './admin/pages/orderPage/AdminOrder.jsx';
import Customer from './admin/pages/customerPage/customerList.jsx';
import VouchersList from './admin/pages/voucherPage/VoucherList.jsx';
import VoucherAdd from './admin/pages/voucherPage/voucherAdd.jsx';
import VoucherUpdate from './admin/pages/voucherPage/voucherUpdate.jsx';
import CustomerList from './admin/pages/customerPage/customerList.jsx';
import CustomerAdd from './admin/pages/customerPage/customerAdd.jsx';
import CustomerUpdate from './admin/pages/customerPage/customerUpdate.jsx';
import ManufacturerList from './admin/pages/manufacturer/manufacturerList.jsx';
import ManufacturerAdd from './admin/pages/manufacturer/manufacturerAdd.jsx';
import ManufacturerUpdate from './admin/pages/manufacturer/manufacturerUpdate.jsx';

// Component Client
import ProductDetail from './client/pages/ProductDetail';
import Home from './client/pages/HomePage.js';
import About from './client/pages/About.js';
import Cuahang from './client/pages/Cuahang.js';
import CategoryProducts from './client/pages/CategoryProducts.js';
import BrandProducts from './client/pages/BrandProducts.js';
import Search from './client/pages/Search.js';
import RegisterLogin from './client/pages/register_login/register_login.jsx';
import CartPage from './client/pages/CartPage.js';
import ForgotPassword from './client/pages/forgotPassword.js';
import ResetPassword from './client/pages/resetPassword.js';
import ChangePassword from './client/pages/changePassword.js';
import PaymentPage from './client/pages/PaymentPage.js'
import OrderStatusList from './client/pages/OrderStatusList.js'
import Contact from './client/pages/Contact.js'
import Wishlist from './client/pages/wishlist.js';
import OrderDetails from './client/pages/OrderDetails.js';


function App() {
  return (
    <BrowserRouter basename="/">
        {/* <Toaster  position="top-center" reverseOrder={false}/> */}
        <Routes>
          <Route path="/admin" element={<HomeAdmin />}>
            <Route index element={<Statistics />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product-add" element={<ProductAdd />} />
            <Route path="productUpdate/:id" element={<ProductUpdate />} />
            <Route path="category" element={<CategoryList />} />
            <Route path="categoryAdd" element={<CategoryAdd />} />
            <Route path="categoryUpdate/:id" element={<CategoryUpdate />} />
            <Route path="comments" element={<Comments />} />
            <Route path="order" element={<AdminOrder />} />
            <Route path="customers" element={<Customer />} />
            <Route path="vouchers" element={<VouchersList />} />
            <Route path="voucherAdd" element={<VoucherAdd />} />
            <Route path="voucherUpdate/:id" element={<VoucherUpdate />} />
            <Route path="customerList" element={<CustomerList />} />
            <Route path="customerAdd" element={<CustomerAdd />} />
            <Route path="customerUpdate/:id" element={<CustomerUpdate />} />
            <Route path="manufacturerList" element={<ManufacturerList />} />
            <Route path="manufacturerAdd" element={<ManufacturerAdd />} />
            <Route path="manufacturerUpdate/:id" element={<ManufacturerUpdate />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/cuahang" element={<Cuahang />} />
          <Route path="/register_login" element={<RegisterLogin />} />
          <Route path="/search" element={<Search />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:Category_ID" element={<CategoryProducts />} />
          <Route path="/brand/:Brand_ID" element={<BrandProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order" element={<OrderStatusList />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist/:userId" element={<Wishlist />} />
          <Route path="/orderDetail/:orderId" element={<OrderDetails />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
