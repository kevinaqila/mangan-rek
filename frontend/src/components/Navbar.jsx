import { useState } from "react";
import { Menu, X, Home, ChevronUp, Compass, Bookmark, MapPinPlus, ClipboardList } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = ({ isNavbarOpen, setIsNavbarOpen }) => {
  const { authUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile", { replace: true });
    setIsDropdownOpen(false);
  };

  const handleSetting = () => {
    navigate("/setting");
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-base-200 shadow-lg transition-all duration-300 ${
          isNavbarOpen ? "w-60" : "w-19"
        } z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="absolute top-4 right-4 flex items-center gap-4">
            {/* Logo */}
            <img src="/images/logo-navbar-darkmode.png" alt="Logo" className="w-10 h-10 object-contain ml-6" />
            {/* Text Logo */}
            <div
              className={`flex items-center transition-all duration-300 ${
                isNavbarOpen ? "opacity-100 ml-0" : "opacity-0 -ml-10"
              }`}
            >
              <span className="text-gray-300 font-bold tracking-wide">Mangan</span>
              <span className="text-yellow-500 font-bold ml-1">Rek</span>
            </div>
            {/* Close/Open Button */}
            <button className="btn btn-ghost btn-square mr-7.5" onClick={handleNavbar}>
              {isNavbarOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 mt-16">
            <ul className="menu p-4 w-full gap-3">
              {/* Link Umum */}
              <li>
                <Link to="/" className="flex items-center gap-4">
                  <Home />
                  <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Beranda</span>
                </Link>
              </li>
              <li>
                <Link to="/explore" className="flex items-center gap-4">
                  <Compass />
                  <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Eksplor</span>
                </Link>
              </li>
              <li>
                <Link to="/my-bookmarks" className="flex items-center gap-4">
                  <Bookmark />
                  <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Celengan Kuliner</span>
                </Link>
              </li>
            </ul>

            {/* Navigasi Berdasarkan Role */}
            <div className="mt-2">
              <h3
                className={`${
                  isNavbarOpen ? "block ml-7" : "hidden"
                } text-gray-400 text-sm uppercase tracking-wide mb-3`}
              >
                Kontributor Panel{" "}
              </h3>
              <ul className="menu px-4 w-full gap-3">
                <li>
                  <Link to="/add-place" className="flex items-center gap-4">
                    <MapPinPlus />
                    <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Tambah Tempat</span>
                  </Link>
                </li>
                <li>
                  <Link to="/my-contributions" className="flex items-center gap-4">
                    <ClipboardList /> <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Kontribusi Saya</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-2">
              <h3
                className={`${
                  isNavbarOpen ? "block ml-7" : "hidden"
                } text-gray-400 text-sm uppercase tracking-wide mb-3`}
              >
                Admin Panel{" "}
              </h3>
              <ul className="menu px-4 w-full gap-3">
                <li>
                  <Link to="/add-place" className="flex items-center gap-4">
                    <MapPinPlus />
                    <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Tambah Tempat</span>
                  </Link>
                </li>
                <li>
                  <Link to="/my-contributions" className="flex items-center gap-4">
                    <ClipboardList /> <span className={`${isNavbarOpen ? "block" : "hidden"}`}>Kontribusi Saya</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-base-300">
            <div className="flex items-center justify-between">
              {/* Profile Picture */}
              <div className="flex items-center">
                <img src="/images/avatar.png" alt="Profile" className="w-10 h-10 rounded-full" />
                {isNavbarOpen && (
                  <div className="ml-3">
                    <p className="font-bold">{authUser?.fullName}</p>
                  </div>
                )}
              </div>

              {isNavbarOpen && (
                <div className="relative">
                  <button className="btn btn-ghost btn-circle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <ChevronUp
                      className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute bottom-full right-0 mb-2 menu p-2 shadow bg-base-100 rounded-box w-52 z-20">
                      <li>
                        <a onClick={handleProfile}>Profil Akun</a>
                      </li>
                      <li>
                        <a onClick={handleSetting}>Pengaturan</a>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
