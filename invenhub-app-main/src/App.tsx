import { Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "./components/AppShell";
import { auth } from "./lib/store";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";
import { PurchasesPage } from "./pages/PurchasesPage";
import { StockPage } from "./pages/StockPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!auth.isAuthed()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function IndexRedirect() {
  return <Navigate to={auth.isAuthed() ? "/dashboard" : "/login"} replace />;
}

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="stock" element={<StockPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
