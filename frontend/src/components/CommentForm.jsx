import { useState } from "react";
import { useRatingStore } from "../store/useRatingStore";

const CommentForm = ({ placeId }) => {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(0);
  const [images, setImages] = useState(null);
  const { addRating, isAddingRating } = useRatingStore();

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!text || rate === 0) {
      return;
    }

    try {
      await addRating({
        text: text.trim(),
        images,
        rate,
        place: placeId,
      });

      setText("");
      setRate(0);
      setImages([]);
      e.target.reset();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };
  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <p className="font-semibold text-gray-100 mb-4">Tambahkan Komentar</p>
      <form onSubmit={handleSubmitRating}>
        {/* Input Rating */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 cursor-pointer ${index < rate ? "text-yellow-500" : "text-gray-500"}`}
                viewBox="0 0 24 24"
                fill={index < rate ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                onClick={() => setRate(index + 1)} // Set rating saat bintang diklik
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.168-7.334-3.857-7.334 3.857 1.4-8.168-5.934-5.782 8.2-1.192z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Input Komentar */}
        <textarea
          className="textarea textarea-bordered w-full bg-gray-700 text-gray-100"
          placeholder="Tulis komentar Anda..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* Input Gambar */}
        <div className="mt-4">
          <label className="block text-gray-400 mb-2">Tambahkan Gambar (Opsional)</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full bg-gray-700 text-gray-100"
            onChange={handleImageChange}
          />
        </div>

        {/* Tombol Kirim */}
        <button type="submit" className="btn btn-primary mt-4" disabled={isAddingRating}>
          {isAddingRating ? "Mengirim..." : "Kirim Komentar"}{" "}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
