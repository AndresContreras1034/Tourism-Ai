import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// 🔧 Fix iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

export default function MapView({ center, points = [], route = [] }) {
  const validPoints = useMemo(() => {
    return points.filter(
      (p) => typeof p.lat === "number" && typeof p.lng === "number"
    );
  }, [points]);

  // Polilínea: si hay ruta ORS la usa, sino conecta los map_points directo
  const polylinePositions = useMemo(() => {
    if (route.length > 0) {
      return route.map((p) => [p.lat, p.lng]);
    }
    if (validPoints.length >= 2) {
      return validPoints.map((p) => [p.lat, p.lng]);
    }
    return [];
  }, [route, validPoints]);

  const defaultCenter = center
    ? [center.lat, center.lng]
    : [4.711, -74.0721];

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

        {/* 📍 Auto zoom */}
        <FitBounds points={validPoints} />

        {/* 🛣️ Ruta ORS */}
        {polylinePositions.length >= 2 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: "#6366f1", weight: 4, opacity: 0.8 }}
          />
        )}

        {/* 📌 Markers */}
        {validPoints.map((point, index) => (
          <Marker
            key={point.id || index}
            position={[point.lat, point.lng]}
          >
            <Popup>
              <div className="map-popup">
                <h4>{point.name}</h4>
                {point.description && <p>{point.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 🧭 Fallback sin puntos */}
        {validPoints.length === 0 && (
          <Marker position={defaultCenter}>
            <Popup>📍 Punto principal del plan</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}