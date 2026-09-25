import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WorkerProfile } from '../types';
import { ShieldCheck, MapPin } from 'lucide-react';

interface MapViewProps {
  workers: WorkerProfile[];
  userLocation?: { lat: number; lng: number; label: string };
  onSelectWorker: (worker: WorkerProfile) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  workers,
  userLocation = { lat: 19.1176, lng: 72.9060, label: 'Powai, Mumbai (Your Location)' },
  onSelectWorker,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default Leaflet icon paths in Vite
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: true,
      });

      // Warm/Clean OpenStreetMap CartoDB Positron tiles for our paper-toned design
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Add User / Customer Approximate Location Marker
    const userMarkerHtml = `
      <div style="
        background: #1C4B44;
        color: #FFFDF8;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #FFF;
        font-size: 16px;
      ">📍</div>
    `;

    const userIcon = L.divIcon({
      html: userMarkerHtml,
      className: 'user-pin-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<strong>Your Location</strong><br/>${userLocation.label}`);

    // Radius circle showing service neighborhood
    L.circle([userLocation.lat, userLocation.lng], {
      color: '#1C4B44',
      fillColor: '#1C4B44',
      fillOpacity: 0.08,
      radius: 1200,
      dashArray: '4, 6',
    }).addTo(map);

    // 2. Add Worker Markers with privacy-safe approximate coordinates
    workers.forEach((w) => {
      const initials = w.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

      const workerMarkerHtml = `
        <div style="
          background: #D89B3C;
          color: #123832;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Rokkitt', serif;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(216, 155, 60, 0.4);
          border: 2px solid #FFFDF8;
          cursor: pointer;
        ">${initials}</div>
      `;

      const workerIcon = L.divIcon({
        html: workerMarkerHtml,
        className: 'worker-pin-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([w.lat, w.lng], { icon: workerIcon }).addTo(map);

      // Safe privacy notice: approximate locality only
      const popupHtml = `
        <div style="font-family: 'Work Sans', sans-serif; min-width: 170px;">
          <div style="font-weight: 700; font-size: 14px; color: #123832;">${w.user.name}</div>
          <div style="font-size: 11px; color: #736b60;">⭐ ${w.averageRating}★ · ${w.locality}</div>
          <div style="font-size: 10px; color: #1C4B44; margin: 4px 0;">🛡️ Co-Owner · Approximate Area</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #1C4B44; margin-top: 4px;">
            ₹${w.basePrice} base
          </div>
          <button id="book-btn-${w.id}" style="
            background: #1C4B44;
            color: #F3ECDC;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 600;
            width: 100%;
            margin-top: 8px;
            cursor: pointer;
          ">Book This Co-Owner</button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`book-btn-${w.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectWorker(w);
          };
        }
      });
    });

    // Invalidate map size after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance or cleanup if needed
    };
  }, [workers, userLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--thread)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '360px', zIndex: 1 }} />

      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(255, 253, 248, 0.95)',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '10.5px',
          fontFamily: 'IBM Plex Mono',
          color: '#736b60',
          border: '1px solid var(--thread)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        🔒 Safe Demo Map · Exact home addresses masked for worker privacy
      </div>
    </div>
  );
};
