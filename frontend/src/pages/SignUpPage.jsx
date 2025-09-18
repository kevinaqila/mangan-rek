import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthImage from "../components/AuthImage";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();

    if (!success) return;
    signup(formData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="bg-base-100 shadow-lg rounded-lg grid lg:grid-cols-2 w-4/5 max-w-4xl">
        {/* Left Column */}
        <AuthImage />

        {/* Right Column */}
        <div className="flex flex-col justify-center items-center py-8 px-10">
          {/* Logo */}
          <div className="flex flex-col justify-center items-center mb-3">
            <img src="/images/logo.png" alt="Mangan Rek Logo" className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-primary mt-3">Buat akun</h1>
            <p className="text-gray-600">Mulailah dengan akun gratis Anda.</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
            {/* Name Input */}
            <div className="form-control mb-4 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full pl-12" // Tambahkan padding kiri untuk ikon
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div className="form-control mb-4 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <input
                type="email"
                placeholder="Email Address"
                className="input input-bordered w-full pl-12" // Tambahkan padding kiri untuk ikon
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password Input */}
            <div className="form-control mb-4 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pl-12" // Tambahkan padding kiri untuk ikon
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="form-control mb-6 relative">
              <label className="input-group">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
                  <Lock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input input-bordered w-full pl-12"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </label>
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${isSigningUp ? "btn-disabled" : ""}`}
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
