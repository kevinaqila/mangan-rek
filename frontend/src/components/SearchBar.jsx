const SearchBar = ({ query, onQueryChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex justify-center items-center gap-4 ">
      <input
        type="text"
        placeholder="Cari tempat makan favoritmu..."
        className="input input-bordered w-xl"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Cari
      </button>
    </form>
  );
};

export default SearchBar;
