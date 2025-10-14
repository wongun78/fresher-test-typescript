import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BookPage from "pages/client/book";
import AboutPage from "pages/client/about";
import LoginPage from "pages/auth/login";
import RegisterPage from "pages/auth/register";
import HomePage from "./pages/client/home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
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
    <RouterProvider router={router} />
  </StrictMode>
);
