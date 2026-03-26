import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProjectKitsPage } from "./pages/ProjectKitsPage";
import { VendorDashboard } from "./pages/VendorDashboard";
import { LearningHub } from "./pages/LearningHub";
import { HowItWorks } from "./pages/HowItWorks";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/products", Component: ProductsPage },
  { path: "/products/:id", Component: ProductDetailPage },
  { path: "/project-kits", Component: ProjectKitsPage },
  { path: "/vendor-dashboard", Component: VendorDashboard },
  { path: "/learning-hub", Component: LearningHub },
  { path: "/how-it-works", Component: HowItWorks },
  { path: "/cart", Component: CartPage },
  { path: "/checkout", Component: CheckoutPage },
  { path: "/order-confirmation", Component: OrderConfirmationPage },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  { path: "/admin/login", Component: AdminLoginPage },
  { path: "/admin/dashboard", Component: AdminDashboardPage },
  { path: "*", Component: NotFoundPage },
]);

