import React from "react"
import './App.css'
import Protected from "./features/auth/Protected.jsx"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import Home from "./pages/Home"
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout"
import ProductDetailPage from "./pages/ProductDetailPage"
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser } from "./features/auth/authSlice.jsx"
import { fetchItemsByUserIdAsync } from "./features/cart/cartSlice.jsx"
import { fetchLoggedInUserAsync } from "./features/user/userSlice.jsx";
import { useEffect } from "react";
import UserOrdersPage from "./pages/UserOrdersPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import PageNotFound from "./pages/404.jsx";
import Logout from "./features/auth/Logout.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import Adminhome from "./pages/AdminHome.jsx";
import AdminProductDetailPage from "./pages/AdminProductDetailPage.jsx";
import AdminProtected from "./features/auth/AdminProtected.jsx";
import ProductForm from "./features/Admin/ProductForm.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_LEFT,
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Protected>
        <Home></Home>
      </Protected>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtected>
        <Adminhome></Adminhome>
      </AdminProtected>
    ),
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
  {
    path: '/logout',
    element: <Logout></Logout>,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage></ForgotPasswordPage>,
  },
  {
    path: '/signup',
    element: <SignupPage></SignupPage>,
  },
  {
    path: '/cart',
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ),
  },
  {
    path: '/checkout',
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ),
  },
  {
    path: '/product-detail/:id',
    element: (
      <Protected>
        <ProductDetailPage></ProductDetailPage>
      </Protected>
    ),
  },
  {
    path: '/admin/product-detail/:id',
    element: (
      <AdminProtected>
        <AdminProductDetailPage></AdminProductDetailPage>
      </AdminProtected>
    ),
  },
  {
    path: '/admin/product-form',
    element: (
      <AdminProtected>
        <ProductForm></ProductForm>
      </AdminProtected>
    ),
  },
  {
    path: '/admin/product-form/edit/:id',
    element: (
      <AdminProtected>
        <ProductForm></ProductForm>
      </AdminProtected>
    ),
  },
  {
    path: '/order-success/:id',
    element: (
      <Protected>
      <OrderSuccessPage></OrderSuccessPage>
      </Protected>
    ),
  },
  {
    path: '/orders',
    element: (
      <Protected>
      <UserOrdersPage></UserOrdersPage>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '/admin/orders',
    element: (
      <AdminProtected>
      <AdminOrdersPage></AdminOrdersPage>
      </AdminProtected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '/profile',
    element: (
      <Protected>
      <UserProfilePage></UserProfilePage>
      </Protected>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '*',
    element: (
      <PageNotFound></PageNotFound>
    ),
  },
]);


function App() {

  const dispatch = useDispatch()
  const user = useSelector(selectLoggedInUser)
  console.log(user)

  useEffect(() => {
    if(user){
     dispatch(fetchItemsByUserIdAsync(user.id))
     dispatch(fetchLoggedInUserAsync(user.id))
    }
   }, [dispatch,user])
   
  
  return (

    <div className="bg min-h-screen">
        <Provider template={AlertTemplate} {...options}>
          <RouterProvider router={router} />
        </Provider>
    </div>
  )
}

export default App
