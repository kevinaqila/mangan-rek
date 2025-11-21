import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const ProfilePage = ({ isNavbarOpen }) => {
  const { authUser } = useAuthStore();
  const { userProfile, getUserProfile, isFetchingProfile } = useUserStore();

  useEffect(() => {
    if (authUser) {
      console.log("Memanggil getUserProfile untuk ID:", authUser._id);
      getUserProfile(authUser._id);
    }
  }, [authUser, getUserProfile]);

  if (isFetchingProfile || !userProfile || !userProfile.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-18 animate-spin text-gray-400" />
      </div>
    );
  }

  const { user, totalReviews, totalPlacesAdded, activities } = userProfile;

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative min-h-screen`}>
      {/* Informasi Pengguna */}
      <div className=" p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4">
          <img
            src={user.profilePic === "" ? "images/avatar.png" : user.profilePic}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full border border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-500">{user.bio}</p>
          </div>
        </div>
        <Link to={`/editprofile`} className="btn btn-primary mt-4">
          Edit Profil
        </Link>
      </div>

      {/* Statistik Kontribusi */}
      <div className=" p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Statistik Kontribusi</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{totalReviews}</p>
            <p>Total Ulasan</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{totalPlacesAdded}</p>
            <p>Tempat Ditambahkan</p>
          </div>
        </div>
      </div>

      {/* Daftar Aktivitas */}
      <div className=" p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Daftar Aktivitas</h2>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity._id} className="p-4  rounded-lg shadow-sm border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">{activity.place.name}</h3>
              <div className="flex items-center gap-2 text-yellow-500">
                {Array.from({ length: activity.rate }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.168-7.334-3.857-7.334 3.857 1.4-8.168-5.934-5.782 8.2-1.192z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 mt-2">{activity.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
