import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// 🔧 Fix iconos Leaflet (obligatorio en React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * 📍 Ajusta el mapa automáticamente a los puntos
 */
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const bounds = points
      .filter((p) => p.lat && p.lng)
      .map((p) => [p.lat, p.lng]);

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [points, map]);

  return null;
}

export default function MapView({ center, points = [] }) {
  const validPoints = useMemo(() => {
    return points.filter(
      (p) =>
        typeof p.lat === "number" &&
        typeof p.lng === "number"
    );
  }, [points]);

  const defaultCenter = center
    ? [center.lat, center.lng]
    : [4.711, -74.0721]; // Bogotá fallback

  return (
    <div className="map-wrapper">

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="map"
      >

        {/* 🗺️ Base map */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 Auto zoom a puntos */}
        <FitBounds points={validPoints} />

        {/* 📌 Markers */}
        {validPoints.map((point, index) => (
          <Marker
            key={point.id || index}
            position={[point.lat, point.lng]}
          >
            <Popup>
              <div className="map-popup">
                <h4>{point.name}</h4>
                {point.description && (
                  <p>{point.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🧭 fallback si no hay puntos */}
        {validPoints.length === 0 && (
          <Marker position={defaultCenter}>
            <Popup>📍 Punto principal del plan</Popup>
          </Marker>
        )}

      </MapContainer>

    </div>
  );
}