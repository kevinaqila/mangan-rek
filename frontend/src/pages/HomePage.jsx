import { Link, useNavigate } from "react-router-dom";

import { usePlaceStore } from "../store/usePlaceStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useAuthStore } from "../store/useAuthStore";

import { useEffect, useMemo, useState } from "react";

import TrendingCarousel from "../components/TrendingCarousel";
import NewestCarousel from "../components/NewestCarousel";
import PopularCategory from "../components/PopularCategory";

const HomePage = ({ isNavbarOpen }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const { places, getAllPlaces } = usePlaceStore();
  const { categories, getCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllPlaces();
  }, [getAllPlaces]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const filteredPlaces = useMemo(() => {
    if (!searchQuery) return [];
    return places.filter((place) => place.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, places]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/explore?search=${trimmedQuery}`);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      {/* Hero Section */}
      <section
        className="hero min-h-[50vh] bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage: "url('/images/home-hero-background.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}></div>

        {/* Konten Hero */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mangan <span className="text-yellow-500">Rek</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-300 mb-6">Temukan rekomendasi kuliner terbaik di Surabaya!</p>

          <div className="form-control w-full max-w-md md:max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="flex justify-center items-center gap-4 ">
              <input
                type="text"
                placeholder="Cari tempat makan favoritmu..."
                className="input input-bordered w-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Cari
              </button>
            </form>{" "}
          </div>

          {/* Hasil Pencarian */}
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-gray-800 shadow-md rounded-lg z-10">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <Link
                    to={`/${place.slug}`}
                    key={place.id}
                    className="flex items-center gap-4 p-1 hover:bg-gray-900 cursor-pointer"
                  >
                    {/* Gambar Utama */}
                    <img src={place.mainImage} alt={place.name} className="w-12 h-12 object-cover rounded-lg" />
                    {/* Nama Tempat */}
                    <p className="font-semibold text-sm text-left">{place.name}</p>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 p-2 my-2">Tidak ada hasil yang ditemukan.</p>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Banner Login untuk Non-Logged In Users */}
      {!authUser && (
        <div className="my-6 bg-base-100 text-base-content rounded-lg p-4 shadow-md border border-transparent">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Ingin menyimpan tempat favorit?</h3>
              <p className="text-sm text-base-content/70">
                Login untuk menyimpan tempat ke celengan kuliner dan memberikan review.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-primary">
                Masuk
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Kategori Populer */}
      <PopularCategory categories={categories} />
      {/* Sedang Trending */}
      <TrendingCarousel />
      {/* Daftar Rekomendasi */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Rekomendasi Pilihan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contoh Kartu */}
          <div className="card bg-base-100 shadow-md">
            <figure>
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrIEQvKSVqgnRdHR2Ymh3jZURR-QNYffM6hJto6yX_7trnOEiOTNEc2B8g4785nKnTsNWe2Dx-m0J3mFvY_j4aSb6k4X_7vEzSIaDJ04cWN0g7YJzS4PBSVXjrR1JKFh-ZdrBkigw08b4/s1600/Ayam+Penyet+01.JPG"
                alt="Tempat Makan"
                className="w-full h-40 object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">Warung Penyetan Pak Kumis</h3>
              <p>Penyetan legendaris dengan sambal khas Surabaya.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Lihat Detail</button>
              </div>
            </div>
          </div>
          {/* Tambahkan lebih banyak kartu sesuai kebutuhan */}
        </div>
      </section>
      {/* Tempat Baru Ditambahkan */}
      <NewestCarousel />
      {authUser && (
        <section className="bg-blue-700 text-white py-10 mt-10 rounded-lg shadow-md">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Tahu tempat makan enak yang belum ada di sini?</h2>
            <p className="mb-6 text-lg">Jadilah kontributor dan bantu teman-temanmu menemukan tempat makan terbaik!</p>
            {authUser.role === "user" ? (
              <Link to="/profile" className="btn btn-primary px-6 py-3 text-lg font-semibold">
                Ajukan Menjadi Kontributor
              </Link>
            ) : authUser.role === "contributor" ? (
              <Link to="/add-place" className="btn btn-primary px-6 py-3 text-lg font-semibold">
                Tambah Tempat Sekarang
              </Link>
            ) : (
              <div className="flex gap-4 justify-center ">
                <Link to="/signup" className="btn btn-primary px-6 py-3 text-lg font-semibold">
                  Daftar Sekarang
                </Link>
                <Link to="/login" className="btn btn-secondary px-6 py-3 text-lg font-semibold">
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
