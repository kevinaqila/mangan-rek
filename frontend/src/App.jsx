import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import ExplorePage from "./pages/ExplorePage";
import DetailPage from "./pages/DetailPage";
import SettingPage from "./pages/SettingPage";
import EditProfilePage from "./pages/EditProfilePage";

import Footer from "./components/Footer";

import { useAuthStore } from "./store/useAuthStore";

import "leaflet/dist/leaflet.css";
import AddPlacePage from "./pages/AddPlacePage";
import MyContributionPage from "./pages/MyContributionPage";
import MyBookmarkPlacePage from "./pages/MyBookmarkPlacePage";
import AdminRoleRequestsPage from "./pages/AdminRoleRequestsPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const hideNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-18 animate-spin text-gray-400" />
      </div>
    );
  return (
    <div className="bg-base-300">
      {showNavbar && <Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />}

      <Routes>
        <Route path="/" element={<HomePage isNavbarOpen={isNavbarOpen} />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/explore" element={<ExplorePage isNavbarOpen={isNavbarOpen} />} />
        <Route path="/:slug" element={<DetailPage isNavbarOpen={isNavbarOpen} />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/editprofile"
          element={authUser ? <EditProfilePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/setting"
          element={authUser ? <SettingPage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-place"
          element={authUser ? <AddPlacePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-contributions"
          element={authUser ? <MyContributionPage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-bookmarks"
          element={authUser ? <MyBookmarkPlacePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/role-requests"
          element={authUser ? <AdminRoleRequestsPage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
      </Routes>

      {authUser && <Footer isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />}

      <Toaster />
    </div>
  );
};

export default App;
