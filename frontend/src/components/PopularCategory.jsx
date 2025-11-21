import { Link } from "react-router-dom";

const PopularCategory = ({ categories }) => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Kategori Populer</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Contoh Kategori */}
        {categories.map((category) => (
          <Link
            to={`/explore?categories=${category._id}`}
            key={category._id}
            className="card bg-primary text-primary-content items-center text-center p-3"
          >
            <h3 className="card-title">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularCategory;
