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
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import NotLogged from "./components/NotLoged";
import NoAddressWallet from "./components/NoAdressWallet";
import { Toaster } from "@/components/ui/toaster";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster />
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
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            {!user ? (
              <Route path="*" element={<NotLogged />} />
            ) : (
              <>
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                {!user.address_wallet ? (
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
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
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
