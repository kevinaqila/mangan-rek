import { useEffect } from "react";
import { usePlaceStore } from "../store/usePlaceStore";

const MyContributionPage = ({ isNavbarOpen }) => {
  const { myContributions, getMyContributions, isLoadingContributions } = usePlaceStore();

  useEffect(() => {
    getMyContributions();
  }, [getMyContributions]);

  if (isLoadingContributions) {
    return <div>Memuat Kontribusi Anda...</div>;
  }
  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      <h1 className="text-2xl font-bold mb-6">Kontribusi Saya</h1>

      {myContributions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myContributions.map((contributions) => (
            <div key={contributions._id} className="bg-base-100 rounded-lg shadow-md overflow-hidden">
              <img src={contributions.mainImage} alt={contributions.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{contributions.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{contributions.description}</p>
                <p className="text-sm text-gray-500">{contributions.address}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Anda belum memiliki kontribusi. Tambahkan tempat makan sekarang!</p>
      )}
    </div>
  );
};

export default MyContributionPage;
