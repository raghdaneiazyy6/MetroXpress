// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { DashboardLayout } from "./layouts/dashboard/DashboardLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Cards } from "./pages/dashboard/Cards";
import { Users } from "./pages/dashboard/Users";
import { Analytics } from "./pages/dashboard/Analytics";
import { Settings } from "./pages/dashboard/Settings";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {" "}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cards" element={<Cards />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
