import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePlaceStore } from "../store/usePlaceStore";

import CardPlace from "../components/CardPlace";


const MyBookmarkPlacePage = ({ isNavbarOpen }) => {

const { bookmarks, getMyBookmarks, isLoadingBookmarks, totalBookmarks } = usePlaceStore();
const [loadedCount, setLoadedCount] = useState(0);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  if (isLoadingBookmarks || !hasMore) return;
  
  const nextSkip = loadedCount;
  await getMyBookmarks(10, nextSkip, true); // append = true
  const newLoadedCount = loadedCount + 10;
  setLoadedCount(newLoadedCount);
  setHasMore(newLoadedCount < totalBookmarks);
};

useEffect(() => {
  const loadInitial = async () => {
    await getMyBookmarks(10, 0, false);
  };
  loadInitial();
}, [getMyBookmarks]);

// Update loadedCount when bookmarks change
useEffect(() => {
  setLoadedCount(bookmarks.length);
}, [bookmarks.length]);

// Update hasMore when totalBookmarks changes
useEffect(() => {
  if (totalBookmarks > 0) {
    setHasMore(loadedCount < totalBookmarks);
  }
}, [totalBookmarks, loadedCount]);

// Infinite scroll effect with debouncing
useEffect(() => {
  let timeoutId;
  const handleScroll = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    }, 200); // 200ms debounce
  };

  window.addEventListener('scroll', handleScroll);
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('scroll', handleScroll);
  };
}, [loadedCount, hasMore, isLoadingBookmarks]);

if(isLoadingBookmarks && bookmarks.length === 0){
  return <div>Memuat Tempat yang Disimpan...</div>
}  

return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      <h1 className="text-2xl font-bold mb-4">Celengan Kuliner</h1>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-gray-700 mb-4">Kamu belum menyimpan tempat makan apapun.</p>
          <p className="text-gray-500 mb-6">Simpan tempat favoritmu untuk menemukannya lebih cepat nanti.</p>
          <Link to="/explore" className="btn btn-primary">
            Jelajahi Sekarang
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">Menampilkan {bookmarks.length} dari {totalBookmarks} tempat yang disimpan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookmarks.map((place) => (
              <CardPlace key={place._id || place.id || place.slug} place={place} />
            ))}
          </div>
          {isLoadingBookmarks && bookmarks.length > 0 && (
            <div className="text-center py-4">
              <span className="loading loading-spinner loading-md"></span>
              <p className="text-sm text-gray-500 mt-2">Memuat lebih banyak...</p>
            </div>
          )}
          {!hasMore && bookmarks.length > 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Semua bookmark sudah dimuat</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookmarkPlacePage;