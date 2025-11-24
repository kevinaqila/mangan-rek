import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarker({ position, onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

const MapInput = ({ initialPosition, onPositionChange }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Klik peta untuk menentukan lokasi:</p>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "8px", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} onPositionChange={handlePositionChange} />
      </MapContainer>
      <p className="text-xs text-gray-500 mt-1">
        Koordinat: Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
      </p>
    </div>
  );
};

export default MapInput;
