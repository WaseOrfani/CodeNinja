import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CookieBanner from "./components/CookieBanner";

// Pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AboutPage from "./pages/AboutPage";
import LocationPage from "./pages/LocationPage";
import ContactPage from "./pages/ContactPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import AGBPage from "./pages/AGBPage";
import WiderrufPage from "./pages/WiderrufPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminChangePasswordPage from "./pages/admin/AdminChangePasswordPage";
import AdminQRPage from "./pages/admin/AdminQRPage";

// QR Order Pages
import QREntryPage from "./pages/QREntryPage";
import QRShopPage from "./pages/QRShopPage";
import QRProductPage from "./pages/QRProductPage";
import QRCheckoutPage from "./pages/QRCheckoutPage";
import QRSuccessPage from "./pages/QRSuccessPage";

// Layout
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/impressum" element={<ImpressumPage />} />
              <Route path="/datenschutz" element={<DatenschutzPage />} />
              <Route path="/agb" element={<AGBPage />} />
              <Route path="/widerruf" element={<WiderrufPage />} />
            </Route>
            
            {/* QR Order Routes - No Layout, minimal UI */}
            <Route path="/qr" element={<QREntryPage />} />
            <Route path="/qr/shop" element={<QRShopPage />} />
            <Route path="/qr/product/:id" element={<QRProductPage />} />
            <Route path="/qr/checkout" element={<QRCheckoutPage />} />
            <Route path="/qr/success/:orderId" element={<QRSuccessPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/password" element={<AdminChangePasswordPage />} />
              <Route path="/admin/qr" element={<AdminQRPage />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
          <CookieBanner />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
