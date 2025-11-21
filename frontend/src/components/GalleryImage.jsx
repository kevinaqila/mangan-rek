import { X } from "lucide-react";
import { useState } from "react";

const GalleryImage = ({ selectedPlace }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <>
      {/* Galeri Gambar */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Galeri</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedPlace.galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative w-full overflow-hidden rounded-lg shadow-md cursor-pointer"
              style={{ aspectRatio: "4 / 3" }} // Mengatur rasio gambar
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Gallery ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal untuk Gambar */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedImage(null)} // Tutup modal
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryImage;
