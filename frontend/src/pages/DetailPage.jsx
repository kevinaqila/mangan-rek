import { useEffect } from "react";
import { MapPin, Clock, DollarSign, Star, Bookmark } from "lucide-react";
import { usePlaceStore } from "../store/usePlaceStore";
import { Link, useParams } from "react-router-dom";
import MapDisplay from "../components/MapDisplay";
import GalleryImage from "../components/GalleryImage";
import { useRatingStore } from "../store/useRatingStore";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";

const DetailPage = ({ isNavbarOpen }) => {
  const { slug } = useParams();
  const { getPlaceBySlug, selectedPlace, isLoadingSelectedPlace } = usePlaceStore();
  const { getRatingPlace, ratings, isLoadingRatings } = useRatingStore();

  useEffect(() => {
    getPlaceBySlug(slug);
  }, [slug, getPlaceBySlug]);

  useEffect(() => {
    if (selectedPlace) {
      getRatingPlace(selectedPlace._id);
    }
  }, [selectedPlace, getRatingPlace]);

  if (isLoadingSelectedPlace) {
    return <div>Loading...</div>;
  }

  if (!selectedPlace) {
    return <div>Place not found</div>;
  }

  const position = [selectedPlace.location.coordinates[1], selectedPlace.location.coordinates[0]];

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      {/* Gambar Utama */}
      <div className="mb-6">
        <div className="relative">
          <img
            src={selectedPlace.mainImage}
            alt={selectedPlace.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          {/* Bookmark action button */}
          <BookmarkAction selectedPlace={selectedPlace} />
        </div>
      </div>

      {/* Nama dan Rating */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{selectedPlace.name}</h1>
        <div className="flex items-center gap-2 text-yellow-500 mt-2">
          <Star className="w-5 h-5" />
          <span className="text-lg">{selectedPlace.averageRating}</span>
          <span className="text-gray-500">({selectedPlace.totalRating} ulasan)</span>
        </div>
      </div>

      {/* Deskripsi */}
      <div className="mb-6">
        <p className="text-gray-500">{selectedPlace.description}</p>
      </div>

      {/* Informasi Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Alamat */}
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Alamat</p>
            <p className="text-gray-500">{selectedPlace.address}</p>
          </div>
        </div>

        {/* Range Harga */}
        <div className="flex items-start gap-2">
          <DollarSign className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-semibold">Range Harga</p>
            <p className="text-gray-500">{selectedPlace.priceRange}</p>
          </div>
        </div>

        {/* Jam Buka */}
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold">Jam Buka</p>
            <p className="text-gray-500">
              Monday : {selectedPlace.openHours.monday.open} WIB - {selectedPlace.openHours.monday.close} WIB <br />
              Tuesday : {selectedPlace.openHours.tuesday.open} WIB - {selectedPlace.openHours.tuesday.close} WIB <br />
              Wednesday : {selectedPlace.openHours.wednesday.open} WIB - {selectedPlace.openHours.wednesday.close} WIB{" "}
              <br />
              Thursday : {selectedPlace.openHours.thursday.open} WIB - {selectedPlace.openHours.thursday.close} WIB{" "}
              <br />
              Friday : {selectedPlace.openHours.friday.open} WIB - {selectedPlace.openHours.friday.close} WIB <br />{" "}
              Saturday : {selectedPlace.openHours.saturday.open} WIB - {selectedPlace.openHours.saturday.close} WIB{" "}
              <br />
              Sunday : {selectedPlace.openHours.sunday.open} WIB - {selectedPlace.openHours.sunday.close} WIB
            </p>
          </div>
        </div>

        {/* Lokasi */}
        <div className="flex items-start gap-2 w-full">
          <MapPin className="w-5 h-5 text-blue-500" />
          <div className="w-full">
            <p className="font-semibold">Lokasi</p>
            <div className="mt-4 w-full">
              <MapDisplay
                position={position}
                placeName={selectedPlace.name}
                style={{ width: "100%", height: "400px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <GalleryImage selectedPlace={selectedPlace} />

      {isLoadingRatings ? (
        <p>Loading Reviews...</p>
      ) : (
        <>
          <p className="font-semibold mb-2 text-lg">Komentar</p>

          {ratings.map((rating) => (
            <Comment key={rating._id} rating={rating} selectedPlace={selectedPlace} />
          ))}
        </>
      )}

      <CommentForm placeId={selectedPlace._id} />
    </div>
  );
};

const BookmarkAction = ({ selectedPlace }) => {
  const { bookmarks, addBookmark, removeBookmark, loadingBookmarkIds } = usePlaceStore();

  const isBookmarked = bookmarks && bookmarks.find((b) => (b._id || b.id) === (selectedPlace._id || selectedPlace.id));

  const handleToggle = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(selectedPlace._id || selectedPlace.id);
      } else {
        await addBookmark(selectedPlace._id || selectedPlace.id, selectedPlace);
      }
    } catch (err) {
      // error handled by store
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loadingBookmarkIds.has(selectedPlace._id || selectedPlace.id)}
      className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow hover:scale-105 transition-transform"
      aria-label={isBookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`} />
    </button>
  );
};

export default DetailPage;
