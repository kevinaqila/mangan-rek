import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePlaceStore } from "../store/usePlaceStore";
import { useCategoryStore } from "../store/useCategoryStore";
import toast from "react-hot-toast";
import MapInput from "../components/MapInput";
import { Loader2, X } from "lucide-react";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const dayNames = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

const AddPlacePage = ({ isNavbarOpen }) => {
  const navigate = useNavigate();

  const { addPlace, isAddingPlace } = usePlaceStore();
  const { categories, getCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    priceRange: "Rp 0 - Rp 25.000",
    category: "",
  });

  const [openHoursData, setOpenHoursData] = useState({
    monday: { open: "", close: "" },
    tuesday: { open: "", close: "" },
    wednesday: { open: "", close: "" },
    thursday: { open: "", close: "" },
    friday: { open: "", close: "" },
    saturday: { open: "", close: "" },
    sunday: { open: "", close: "" },
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({ lat: -7.2575, lng: 112.7521 });

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenHoursChange = (day, type, value) => {
    setOpenHoursData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };

  const handleRemoveMainImage = () => {
    setMainImageFile(null);
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.address || !formData.category || !mainImageFile) {
      toast.error("Mohon lengkapi semua field yang diperlukan.");
      return;
    }

    const locationString = JSON.stringify({
      type: "Point",
      coordinates: [markerPosition.lng, markerPosition.lat],
    });

    const dataToSend = new FormData();

    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("address", formData.address);
    dataToSend.append("location", locationString);
    dataToSend.append("priceRange", formData.priceRange);
    dataToSend.append("category", JSON.stringify([formData.category]));
    dataToSend.append("openHours", JSON.stringify(openHoursData));
    dataToSend.append("mainImage", mainImageFile);

    galleryImageFiles.forEach((file) => {
      dataToSend.append("galleryImages", file);
    });

    try {
      await addPlace(dataToSend);
      toast.success("Tempat makan berhasil ditambahkan!");
      navigate("/explore");
    } catch (error) {
      toast.error("Gagal menambahkan tempat makan. Silakan coba lagi.");
      console.log("Error adding place:", error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} p-4 md:p-6 relative`}>
      <h1 className="text-2xl font-bold mb-6">Tambah Tempat Makan</h1>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        {/* Nama */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Nama Tempat</label>
          <input
            name="name"
            type="text"
            className="input input-bordered w-full"
            placeholder="Masukkan nama tempat makan"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Deskripsi</label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full"
            placeholder="Masukkan deskripsi tempat makan"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Alamat */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Alamat</label>
          <textarea
            name="address"
            className="textarea textarea-bordered w-full"
            placeholder="Masukkan alamat tempat makan"
            rows="2"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Lokasi */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="label">Lokasi Tempat Makan</label>
            <MapInput
              initialPosition={markerPosition}
              onPositionChange={setMarkerPosition} // Langsung update state di AddPlaceForm
            />
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Jam Operasional</label>
          <div className="grid grid-cols-2 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day}>
                <label className="block text-gray-600 capitalize">{dayNames[day]}</label>
                <input
                  type="time"
                  value={openHoursData[day].open}
                  onChange={(e) => handleOpenHoursChange(day, "open", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Buka"
                />
                <input
                  type="time"
                  value={openHoursData[day].close}
                  onChange={(e) => handleOpenHoursChange(day, "close", e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Tutup"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Main Image</label>
          <div className="flex items-center gap-4">
            <label htmlFor="mainImage" className="btn btn-outline btn-sm cursor-pointer">
              Pilih File
            </label>
            <input
              id="mainImage"
              name="mainImage"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
            {mainImageFile && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{mainImageFile.name}</span>
                <button type="button" onClick={handleRemoveMainImage} className="btn btn-error btn-sm">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Gallery Images</label>
          <div className="flex items-center gap-4">
            <label htmlFor="galleryImages" className="btn btn-outline btn-sm cursor-pointer">
              Pilih File
            </label>
            <input
              id="galleryImages"
              name="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              className="hidden"
            />
          </div>
          {galleryImageFiles.length > 0 && (
            <div className="mt-2 space-y-2">
              {galleryImageFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="btn btn-error btn-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kategori */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="" disabled>
              Pilih Kategori
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Price Range</label>
          <select
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="Rp 0 - Rp 25.000">Rp 0 - Rp 25.000</option>
            <option value="Rp 25.000 - Rp 50.000">Rp 25.000 - Rp 50.000</option>
            <option value="Rp 50.000 - Rp 100.000">Rp 50.000 - Rp 100.000</option>
          </select>
        </div>

        {/* Tombol Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary w-full">
            {isAddingPlace ? <Loader2 className="animate-spin" /> : "Tambahkan Tempat"}{" "}
          </button>{" "}
        </div>
      </form>
    </div>
  );
};

export default AddPlacePage;
