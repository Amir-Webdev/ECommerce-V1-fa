import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/assets/styles/toastify.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PrivateRoute from "./components/PrivateRoute";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import PaymentSuccess from "./pages/PaymentSuccess";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./pages/admin/OrderList";
import ProductList from "./pages/admin/ProductList";
import ProductEdit from "./pages/admin/ProductEdit";
import UserList from "./pages/admin/UserList";
import UserEdit from "./pages/admin/UserEdit";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page/:pageNumber" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} />
            <Route
              path="/search/:keyword/page/:pageNumber"
              element={<Home />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:orderId" element={<Order />} />
              <Route
                path="/payment-success/:orderId"
                element={<PaymentSuccess />}
              />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/orderlist" element={<OrderList />} />
              <Route path="/admin/productlist" element={<ProductList />} />
              <Route
                path="/admin/productlist/:pageNumber"
                element={<ProductList />}
              />
              <Route path="/admin/userlist" element={<UserList />} />
              <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
              <Route path="/admin/user/:id/edit" element={<UserEdit />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
      <ToastContainer
        rtl
        style={{
          fontFamily: "Vazirmatn",
        }}
      />
    </>
  );
}

export default App;
