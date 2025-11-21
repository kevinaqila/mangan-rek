import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet library untuk ikon

// Fix ikon default Leaflet yang kadang bermasalah dengan build tools
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Komponen kecil untuk menangani event klik pada peta
function LocationMarker({ position, onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      // Saat peta diklik, panggil fungsi onPositionChange dari parent
      // dengan koordinat baru (e.latlng berisi {lat, lng})
      onPositionChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom()); // Pindahkan view peta ke lokasi klik
    },
  });

  // Tampilkan Marker di posisi yang dipilih
  return position === null ? null : <Marker position={position}></Marker>;
}

const MapInput = ({ initialPosition, onPositionChange }) => {
  // State lokal untuk posisi penanda di dalam komponen peta ini
  const [position, setPosition] = useState(initialPosition);

  // Update state lokal jika initialPosition berubah (jarang terjadi, tapi bagus untuk ada)
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition); // Update state lokal
    onPositionChange(newPosition); // Beritahu parent (AddPlaceForm) tentang perubahan
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Klik peta untuk menentukan lokasi:</p>
      <MapContainer
        center={position} // Pusat peta mengikuti posisi marker
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "8px", zIndex: 0 }} // zIndex agar tidak tertimpa dropdown
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Gunakan komponen LocationMarker */}
        <LocationMarker position={position} onPositionChange={handlePositionChange} />
      </MapContainer>
      {/* Tampilkan koordinat terpilih */}
      <p className="text-xs text-gray-500 mt-1">
        Koordinat: Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
      </p>
    </div>
  );
};

export default MapInput;
