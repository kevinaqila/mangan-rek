import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { usePlaceStore } from "../store/usePlaceStore";

import { useEffect } from "react";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingCarousel = () => {
  const { trendingPlaces, getTrendingPlaces, isLoadingTrendingPlaces } = usePlaceStore();

  useEffect(() => {
    getTrendingPlaces();
  }, [getTrendingPlaces]);
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Flame className="text-orange-500 fill-amber-600 mr-2 mt-1" />
        Sedang Trending
        <Flame className="text-orange-500 fill-amber-600 ml-2 mt-1" />
      </h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {isLoadingTrendingPlaces ? (
          <p>Memuat Tempat Trending...</p>
        ) : (
          <>
            {trendingPlaces.map((place) => (
              <SwiperSlide key={place.id}>
                <Link to={`/${place.slug}`} key={place.id} className="card bg-base-100 shadow-md  min-h-[260px]">
                  <figure>
                    <img src={place.mainImage} alt={place.name} className="w-full h-40 object-cover" />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title line-clamp-2">{place.name}</h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
    </section>
  );
};

export default TrendingCarousel;
