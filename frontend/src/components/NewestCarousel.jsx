import { useEffect } from "react";
import { usePlaceStore } from "../store/usePlaceStore";
import { Link } from "react-router-dom";

const NewestCarousel = () => {
  const { newestPlaces, getNewestPlaces, isLoadingNewestPlaces } = usePlaceStore();

  useEffect(() => {
    getNewestPlaces();
  }, [getNewestPlaces]);
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Baru Ditambahkan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingNewestPlaces ? (
          <p>Memuat Tempat Terbaru...</p>
        ) : (
          <>
            {newestPlaces.map((place) => (
              <div key={place._id} className="card bg-base-100 shadow-md">
                <figure>
                  <img src={place.mainImage} alt={place.name} className="w-full h-40 object-cover" />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{place.name}</h3>
                  <p className="line-clamp-2">{place.description}</p>
                  <div className="card-actions justify-end">
                    <Link to={`/${place.slug}`} className="btn btn-primary btn-sm">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default NewestCarousel;
