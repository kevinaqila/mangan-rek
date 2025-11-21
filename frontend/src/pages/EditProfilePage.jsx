import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useEffect, useState } from "react";
import { Camera, Image, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const EditProfilePage = ({ isNavbarOpen }) => {
  const { userProfile, getUserProfile, isUpdatingProfile, updateProfile } = useUserStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("");

  useEffect(() => {
    if (!userProfile && authUser) {
      getUserProfile(authUser._id);
    }

    if (userProfile?.user) {
      setFullName(userProfile.user.fullName || "");
      setBio(userProfile.user.bio || "");
      setPreviewPic(userProfile.user.profilePic || "/images/avatar.png");
    } else if (authUser) {
      setFullName(authUser.fullName || "");
      setBio(authUser.bio || "");
      setPreviewPic(authUser.profilePic || "/images/avatar.png");
    }
  }, [authUser, getUserProfile, userProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      await updateProfile(formData);
      navigate("/profile");
    } catch (error) {
      toast.error("Gagal memperbarui profil.", error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative min-h-screen`}>
      <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        {/* Foto Profil */}
        <div className="mb-6 text-center">
          <label htmlFor="profilePicture" className="block mb-4">
            <img
              src={previewPic || "/images/avatar.png"}
              alt="Foto Profil"
              className="w-32 h-32 rounded-full mx-auto border border-gray-300 object-cover cursor-pointer"
            />
          </label>
          <span className="text-sm text-gray-500 mt-2 block">Klik gambar untuk mengganti foto profil</span>
          <input type="file" id="profilePicture" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Nama Lengkap */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Nama Lengkap</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Masukkan nama lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Bio</label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Masukkan bio singkat"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        {/* Tombol Simpan */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary w-full" disabled={isUpdatingProfile}>
            {isUpdatingProfile ? <Loader2 className="animate-spin mr-2" /> : "Simpan Perubahan"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
