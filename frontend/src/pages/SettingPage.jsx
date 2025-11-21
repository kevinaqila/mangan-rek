import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SettingPage = ({ isNavbarOpen }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword, isUpdatingPassword } = useAuthStore();
  const { logout } = useAuthStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      toast.error("Current password is required");
      return false;
    }

    if (!formData.newPassword.trim()) {
      toast.error("Incorrect current password");
      return false;
    }

    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }

    if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      toast.error("New password and confirmation do not match");
      return false;
    }

    return true;
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    console.log("Data Form Sebelum Validasi:", formData);
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await changePassword(formData);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Gagal mengubah password:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>

      {/* Ubah Kata Sandi */}
      <div className="p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Ubah Kata Sandi</h2>
        <form onSubmit={handleSubmitPassword}>
          <div className="form-control mb-4 relative">
            <label className="block text-gray-600 mb-2">Kata Sandi Lama</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="input input-bordered w-full"
              placeholder="Masukkan kata sandi lama"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
            <button
              type="button"
              className="absolute mt-4 right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="form-control mb-4 relative">
            <label className="block text-gray-600 mb-2">Kata Sandi Baru</label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="input input-bordered w-full"
              placeholder="Masukkan kata sandi baru"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
            <button
              type="button"
              className="absolute mt-4 right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="form-control mb-4 relative">
            <label className="block text-gray-600 mb-2">Konfirmasi Kata Sandi Baru</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="input input-bordered w-full"
              placeholder="Konfirmasi kata sandi baru"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <button
              type="button"
              className="absolute mt-4 right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? <Loader2 className="animate-spin mr-2" /> : "Ubah Kata Sandi"}{" "}
          </button>
        </form>
      </div>

      {/* Tombol Logout */}
      <div className="mt-6 text-center">
        <button
          className="btn btn-error"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout Akun
        </button>
      </div>
    </div>
  );
};

export default SettingPage;
