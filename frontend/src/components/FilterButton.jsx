import { Filter, DollarSign, Star, MapPin, ArrowDownNarrowWide } from "lucide-react";

const priceOptions = ["Rp 0 - Rp 25.000", "Rp 25.000 - Rp 50.000", "Rp 50.000 - Rp 100.000"];
const ratingOptions = [
  { label: "★★★★ & atas", value: 4 },
  { label: "★★★ & atas", value: 3 },
  { label: "★★ & atas", value: 2 },
  { label: "★ & atas", value: 1 },
];

const FilterButton = ({
  categories,
  selectedCategories,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedRating,
  onRatingChange,
}) => {
  return (
    <div className="mt-5">
      {/* Filter dan Sorting */}
      <div className="flex flex-wrap justify-start gap-4 mb-6">
        {/* Filter Kategori */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" /> Kategori
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {categories.map((category) => (
              <li key={category._id} className="cursor-pointer">
                <label
                  className={`label flex items-center gap-2 ${
                    selectedCategories.includes(category._id) ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => onCategoryChange(category._id)}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text">{category.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Filter Harga */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-outline flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Harga
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li onClick={() => onPriceChange("")}>
              <a>Semua Harga</a>
            </li>
            {priceOptions.map((price) => (
              <li key={price} onClick={() => onPriceChange(price)}>
                <a className={selectedPrice === price ? "bg-blue-500 text-white" : ""}>{price}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Filter Rating */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-outline flex items-center gap-2">
            <Star className="w-4 h-4" /> Rating
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li onClick={() => onRatingChange(0)}>
              <a>Semua Rating</a>
            </li>
            {ratingOptions.map((rating) => (
              <li key={rating.value} onClick={() => onRatingChange(rating.value)}>
                <a className={selectedRating === rating.value ? "bg-blue-500 text-white" : ""}>{rating.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterButton;
