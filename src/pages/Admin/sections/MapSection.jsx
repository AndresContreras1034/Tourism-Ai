import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getMap } from "../../../services/admin.service.js";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icono default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMap(30).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="admin-loading">Cargando mapa...</p>;

  const destinations = data.top_destinations || [];

  return (
    <div className="admin-section">
      <h2>🌍 Mapa de Planes Generados</h2>

      <div className="admin-map-wrap">
        <MapContainer center={[4.7110, -74.0721]} zoom={12}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {destinations.map((d) => (
            <Marker key={d.destination} position={[d.lat, d.lng]}>
              <Popup>
                <strong>{d.destination}</strong>
                <br />
                🗺️ {d.times_used}{" "}
                {d.times_used === 1
                  ? "plan generado"
                  : "planes generados"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {destinations.length === 0 && (
        <p className="admin-empty">Sin planes generados aún</p>
      )}
    </div>
  );
}