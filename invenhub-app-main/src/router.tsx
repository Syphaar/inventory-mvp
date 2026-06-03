import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/routes/__root";
import { LoginPage } from "@/routes/login";
import { RegisterPage } from "@/routes/register";
import { Dashboard } from "@/routes/_app/dashboard";
import { Products } from "@/routes/_app/products";
import { Sales } from "@/routes/_app/sales";
import { Purchases } from "@/routes/_app/purchases";
import { Stock } from "@/routes/_app/stock";
import { Index } from "@/routes/index";
import { AppLayout } from "@/routes/_app";
import { NotFoundComponent, ErrorComponent } from "@/routes/__root";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorComponent />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "sales",
            element: <Sales />,
          },
          {
            path: "purchases",
            element: <Purchases />,
          },
          {
            path: "stock",
            element: <Stock />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundComponent />,
  },
]);
