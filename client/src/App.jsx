import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import SuccessOrder from "./pages/shopping-view/successful-order";
import FailOrder from "./pages/shopping-view/fail-order";
import ShoppingTerms from "./pages/shopping-view/terms";
import ShoppingPolicy from "./pages/shopping-view/privacy";
import ShoppingContact from "./pages/shopping-view/contact";
import AdminInquiries from "./pages/admin-view/inquiries";
import AdminDispatchOrders from "./pages/admin-view/dispatch-orders";
import AdminConfirmOrders from "./pages/admin-view/confirm-orders";
import AdminCancelOrders from "./pages/admin-view/cancel-orders";

function ProtectedRoute({ element }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? element : <Navigate to="/auth/login" replace />;
}

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <Skeleton className="w-[600px] h-[600px]" />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/shop/home" replace />} />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="dispatch-orders" element={<AdminDispatchOrders />} />
            <Route path="confirm-orders" element={<AdminConfirmOrders />} />
            <Route path="cancel-orders" element={<AdminCancelOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="terms" element={<ShoppingTerms />} />
            <Route path="policy" element={<ShoppingPolicy />} />
            <Route path="contact" element={<ShoppingContact />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="successful" element={<SuccessOrder />} />
            <Route path="fail" element={<FailOrder />} />
          </Route>

          <Route
            path="/shop/checkout"
            element={<ProtectedRoute element={<ShoppingCheckout />} />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth-page" element={<UnAuthPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
