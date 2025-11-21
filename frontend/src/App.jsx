import { Navigate, Route, Routes } from "react-router-dom";
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

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-18 animate-spin text-gray-400" />
      </div>
    );
  return (
    <div className="bg-base-300">
      {authUser && <Navbar isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />}

      <Routes>
        <Route path="/" element={authUser ? <HomePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpPage />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route
          path="/explore"
          element={authUser ? <ExplorePage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
        <Route
          path="/:slug"
          element={authUser ? <DetailPage isNavbarOpen={isNavbarOpen} /> : <Navigate to="/login" />}
        />
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
      </Routes>

      {authUser && <Footer isNavbarOpen={isNavbarOpen} setIsNavbarOpen={setIsNavbarOpen} />}

      <Toaster />
    </div>
  );
};

export default App;
