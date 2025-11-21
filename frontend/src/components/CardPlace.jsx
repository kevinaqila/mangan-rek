import { DollarSign, MapPin, Star, Tag, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlaceStore } from "../store/usePlaceStore";

const CardPlace = ({ place }) => {
  const { bookmarks, addBookmark, removeBookmark, loadingBookmarkIds } = usePlaceStore();

  const isBookmarked = bookmarks && bookmarks.find((b) => (b._id || b.id) === (place._id || place.id));

  const handleToggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(place._id || place.id);
      } else {
        await addBookmark(place._id || place.id, place);
      }
    } catch (err) {
      // error handled in store with toast
    }
  };

  return (
    <div className="card bg-base-100 shadow-md">
      {/* Gambar Utama */}
      <figure className="relative">
        <img src={place.mainImage} alt={place.name} className="w-full h-40 object-cover" />
        <button
          onClick={handleToggleBookmark}
          className="absolute top-2 right-2 bg-white/90 rounded-full p-2 shadow hover:scale-105 transition-transform"
          aria-label={isBookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
          disabled={loadingBookmarkIds.has(place._id || place.id)}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`} />
        </button>
      </figure>

      {/* Informasi Tempat Makan */}
      <div className="card-body">
        {/* Nama Tempat Makan */}
        <h3 className="card-title text-lg font-bold">{place.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 text-yellow-500">
          <Star className="w-4 h-4" />
          <span>{place.averageRating}</span>
          <span className="text-gray-500">({place.totalRating} ulasan)</span>
        </div>

        {/* Kategori */}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <span>{place.category?.[0]?.name}</span>
        </p>

        {/* Range Harga */}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span>{place.priceRange}</span>
        </p>

        {/* Lokasi */}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>Surabaya Timur</span>
        </p>

        {/* Tombol Lihat Detail */}
        <div className="card-actions justify-end">
          <Link to={`/${place.slug}`} className="btn btn-primary btn-sm">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardPlace;
