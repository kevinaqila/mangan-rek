import { useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import { usePlaceStore } from "../store/usePlaceStore";
import { useCategoryStore } from "../store/useCategoryStore";

import SearchBar from "../components/SearchBar";
import CardPlace from "../components/CardPlace";
import FilterButton from "../components/FilterButton";

import useDebounce from "../hooks/useDebounce";

const ExplorePage = ({ isNavbarOpen }) => {
  const { getAllPlaces, places } = usePlaceStore();
  const { categories, getCategories } = useCategoryStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategories = searchParams.getAll("categories"); // getAll untuk array
  const selectedPrice = searchParams.get("price") || "";
  const selectedRating = searchParams.get("rating") || 0;
  const searchQueryUrl = searchParams.get("search") || "";

  const debouncedSearchQuery = useDebounce(searchQueryUrl, 500);

  useEffect(() => {
    getAllPlaces({
      categories: selectedCategories,
      price: selectedPrice,
      rating: selectedRating,
      search: debouncedSearchQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, debouncedSearchQuery, getAllPlaces]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleCategoryChange = (categoryId) => {
    const currentCategories = searchParams.getAll("categories");
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    searchParams.delete("categories");
    newCategories.forEach((catId) => searchParams.append("categories", catId));
    setSearchParams(searchParams);
  };

  const handlePriceChange = (price) => {
    if (price) {
      searchParams.set("price", price);
    } else {
      searchParams.delete("price");
    }
    setSearchParams(searchParams);
  };

  const handleRatingChange = (rating) => {
    if (rating > 0) {
      searchParams.set("rating", rating);
    } else {
      searchParams.delete("rating");
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (newSearch) => {
    searchParams.set("search", newSearch);
    setSearchParams(searchParams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      <SearchBar query={searchQueryUrl} onQueryChange={handleSearchChange} onSubmit={handleSubmit} />

      <FilterButton
        categories={categories}
        selectedCategories={selectedCategories}
        selectedPrice={selectedPrice}
        selectedRating={selectedRating}
        onCategoryChange={handleCategoryChange}
        onPriceChange={handlePriceChange}
        onRatingChange={handleRatingChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => {
          return <CardPlace key={place._id} place={place} />;
        })}
      </div>
    </div>
  );
};

export default ExplorePage;
