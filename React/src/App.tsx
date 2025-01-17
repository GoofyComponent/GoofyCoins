import React, { use } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import NotLogged from "./components/NotLoged";
import NoAddressWallet from "./components/NoAdressWallet";
import VerifyEmail from "./components/VerifyEmail";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const hideMarginTopPaths = new Set(["/login", "/register"]);
  const marginTopStyle = hideMarginTopPaths.has(location.pathname)
    ? "0px"
    : "60px";
  const mainHeight = hideMarginTopPaths.has(location.pathname)
    ? "100vh"
    : "calc(100vh - 60px)";

  return (
    <SidebarProvider>
      <SidebarWrapper />
      <SidebarInset>
        <NavbarWrapper />
        <main style={{ marginTop: marginTopStyle, height: mainHeight }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {!user ? (
              <Route path="*" element={<NotLogged />} />
            ) : (
              <>
                {user.email_verified_at ? (
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                ) : null}
                {!user.email_verified_at ? (
                  <Route path="*" element={<VerifyEmail />} />
                ) : !user.address_wallet ? (
                  <Route path="*" element={<NoAddressWallet />} />
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </>
                )}
              </>
            )}
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const SidebarWrapper: React.FC = () => {
  const location = useLocation();
  const hideNavbarPaths = new Set(["/login", "/register"]);

  return !hideNavbarPaths.has(location.pathname) ? <AppSidebar /> : null;
};

const NavbarWrapper: React.FC = () => {
  const location = useLocation();
  const hideNavbarPaths = new Set(["/login", "/register"]);

  return !hideNavbarPaths.has(location.pathname) ? <Navbar /> : null;
};

export default App;
