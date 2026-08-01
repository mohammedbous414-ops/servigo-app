import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint, Driver } from '../types';

interface OpenStreetMapProps {
  pickup?: LocationPoint | null;
  dropoff?: LocationPoint | null;
  driver?: Driver | null;
  driverAnimPos?: { lat: number; lng: number } | null;
  nearbyDrivers?: Driver[];
  onSelectCoordinates?: (lat: number, lng: number, addressSuggestion?: string) => void;
  interactiveSelect?: boolean;
  height?: string;
  zoom?: number;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  pickup,
  dropoff,
  driver,
  driverAnimPos,
  nearbyDrivers = [],
  onSelectCoordinates,
  interactiveSelect = false,
  height = '320px',
  zoom = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center: Casablanca, Morocco
    const defaultLat = pickup?.lat || 33.5889;
    const defaultLng = pickup?.lng || -7.6322;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Click on map to pick location
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (interactiveSelect && onSelectCoordinates) {
        const { lat, lng } = e.latlng;
        onSelectCoordinates(lat, lng, `موقع محدد (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      }
    };

    map.off('click');
    map.on('click', handleMapClick);

    return () => {
      // Do not destroy on every render, just clear handlers
    };
  }, [interactiveSelect, onSelectCoordinates, zoom]);

  // Update Markers and Polylines whenever props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers & polylines
    Object.keys(markersRef.current).forEach((key) => {
      markersRef.current[key]?.remove();
    });
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const boundsGroup: L.LatLngExpression[] = [];

    // Custom Icons using SVG HTML DivIcon
    const createMarkerIcon = (bgClass: string, iconSymbol: string, label?: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-9 h-9 rounded-full ${bgClass} text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform font-bold border-2 border-white">
              ${iconSymbol}
            </div>
            ${
              label
                ? `<div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-slate-700">${label}</div>`
                : ''
            }
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    };

    // 1. Pickup Marker (Cyan)
    if (pickup) {
      const pickupMarker = L.marker([pickup.lat, pickup.lng], {
        icon: createMarkerIcon('bg-cyan-500', '📍', pickup.name || 'انطلاق'),
      }).addTo(map);
      pickupMarker.bindPopup(`<b>الانطلاق:</b> ${pickup.address || pickup.name}`);
      markersRef.current['pickup'] = pickupMarker;
      boundsGroup.push([pickup.lat, pickup.lng]);
    }

    // 2. Dropoff Marker (Rose)
    if (dropoff) {
      const dropoffMarker = L.marker([dropoff.lat, dropoff.lng], {
        icon: createMarkerIcon('bg-rose-500', '🏁', dropoff.name || 'الوجهة'),
      }).addTo(map);
      dropoffMarker.bindPopup(`<b>الوجهة:</b> ${dropoff.address || dropoff.name}`);
      markersRef.current['dropoff'] = dropoffMarker;
      boundsGroup.push([dropoff.lat, dropoff.lng]);
    }

    // 3. Polyline between Pickup & Dropoff (Indigo Vibrant line)
    if (pickup && dropoff) {
      const latlngs: L.LatLngExpression[] = [
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ];
      polylineRef.current = L.polyline(latlngs, {
        color: '#6366f1',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(map);
    }

    // 4. Driver Marker (Indigo Vibrant icon, active or animated)
    const activeDriverPos = driverAnimPos || (driver ? { lat: driver.lat, lng: driver.lng } : null);
    if (activeDriverPos && driver) {
      const carMarker = L.marker([activeDriverPos.lat, activeDriverPos.lng], {
        icon: createMarkerIcon('bg-indigo-600', '🚗', driver.name),
      }).addTo(map);
      carMarker.bindPopup(`<b>السائق:</b> ${driver.name}<br/><b>السيارة:</b> ${driver.carModel}`);
      markersRef.current['driver'] = carMarker;
      boundsGroup.push([activeDriverPos.lat, activeDriverPos.lng]);
    }

    // 5. Nearby Drivers (when searching)
    if (nearbyDrivers.length > 0 && !driver) {
      nearbyDrivers.forEach((d) => {
        const iconSymbol = d.category === 'moto' ? '🏍️' : d.category === 'cargo' ? '🚚' : '🚖';
        const m = L.marker([d.lat, d.lng], {
          icon: createMarkerIcon('bg-slate-800', iconSymbol, d.carModel),
        }).addTo(map);
        markersRef.current[`nearby-${d.id}`] = m;
      });
    }

    // Fit map bounds if multiple points exist
    if (boundsGroup.length >= 2) {
      map.fitBounds(L.latLngBounds(boundsGroup), { padding: [40, 40] });
    } else if (boundsGroup.length === 1) {
      map.setView(boundsGroup[0], zoom);
    }
  }, [pickup, dropoff, driver, driverAnimPos, nearbyDrivers, zoom]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner group">
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full z-0 bg-slate-800 transition-all duration-300"
      />
      
      {/* Map Header Indicator Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/30 shadow-lg flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        OpenStreetMap • ServiGo Live GPS
      </div>

      {interactiveSelect && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-slate-200 border border-slate-700 shadow-xl flex items-center gap-2">
          <span>👆 اضغط على الخريطة لتحديد الموقع</span>
        </div>
      )}
    </div>
  );
};
