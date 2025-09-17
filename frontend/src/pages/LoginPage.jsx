import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="bg-base-100 shadow-lg rounded-lg grid lg:grid-cols-2 w-4/5 max-w-4xl">
        {/* Left Column */}
        <div className="hidden lg:flex flex-col justify-center items-center relative">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.tokopedia.net/blog-tokopedia-com/uploads/2018/04/Wisata-Malam-Surabaya-4-Travel-Malang.jpg')",
              filter: "brightness(0.5)", 
            }}
          ></div>

          {/* Text Content */}
          <div className="relative z-10 text-center text-white px-15">
            <h2 className="text-2xl font-bold">Ayo Mangan Rek!</h2>
            <p className="text-md mt-2">Memberikan pengalaman kuliner terbaik di Surabaya.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center items-center py-8 px-10">
          {/* Logo */}
          <div className="flex flex-col justify-center items-center mb-3">
            <img src="/images/logo.png" alt="Mangan Rek Logo" className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-primary mt-3">Masuk Akun</h1>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
            {/* Email Input */}
            <div className="form-control mb-4 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <input
                type="email"
                placeholder="Email Address"
                className="input input-bordered w-full pl-12"
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
                className="input input-bordered w-full pl-12" 
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

            {/* Sign Up Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full mt-3 ${isLoggingIn ? "btn-disabled" : ""}`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-gray-600 text-sm mt-4">
            Belum memiliki akun?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Buat akun{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
