import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddFee from "./pages/AddFee";
import AddExpense from "./pages/AddExpense";
import Report from "./pages/Report";
import Footer from "./pages/Footer";
import "./index.css";
function Layout({ children }) {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* App Name */}
          <div className="text-lg font-semibold text-gray-800 border-b-2 border-red-600 pb-1">
            KAIZEN ACADEMY
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link
              to="/"
              className="hover:text-red-600 border-b-2 border-transparent hover:border-red-600 pb-1 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/fees"
              className="hover:text-red-600 border-b-2 border-transparent hover:border-red-600 pb-1 transition"
            >
              Add Fees
            </Link>

            <Link
              to="/expense"
              className="hover:text-red-600 border-b-2 border-transparent hover:border-red-600 pb-1 transition"
            >
              Add Expense
            </Link>

            <Link
              to="/report"
              className="hover:text-red-600 border-b-2 border-transparent hover:border-red-600 pb-1 transition"
            >
              Report
            </Link>
          </nav>

          {/* Logout */}
          {token && (
            <button
              onClick={logout}
              className="ml-auto text-sm text-red-600 hover:underline font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fees"
          element={
            <ProtectedRoute>
              <Layout>
                <AddFee />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <Layout>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Layout>
                <Report />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
