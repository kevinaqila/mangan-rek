import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapDisplay = ({ position, placeName }) => {
  return (
    <MapContainer center={position} zoom={16} style={{ height: "300px", width: "100%", borderRadius: "8px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{placeName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapDisplay;
