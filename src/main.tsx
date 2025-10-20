import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App as AntdApp, ConfigProvider } from "antd";
import App from "@/App";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";
import LoginPage from "pages/auth/login";
import RegisterPage from "pages/auth/register";
import HomePage from "./pages/client/home";
import { AppProvider } from "./components/context/app.context";
import CheckoutPage from "./pages/client/checkout";
import ProtectedRoute from "./components/auth/auth";
import LayoutAdmin from "./components/layout/layout.admin";
import DashBoardPage from "./pages/admin/dashboard";
import ManageOrderPage from "./pages/admin/manage.order";
import ManageUserPage from "./pages/admin/manage.user";
import ManageBookPage from "./pages/admin/manage.book";
import enUS from "antd/locale/en_US";
import OrderPage from "./pages/client/order";
import PaymentPage from "./pages/client/payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/book/:id",
        element: <BookPage />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <DashBoardPage /> },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdApp>
      <AppProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </AntdApp>
  </StrictMode>
);
