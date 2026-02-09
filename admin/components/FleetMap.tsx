import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Car } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidW5tYXNraW5nIiwiYSI6ImNtaHo5dmY5cDBpcncybHM1aTI4cjZ3b3IifQ.yNt2bslI1wAyoeoKREtVyw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface VehicleMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  driverName?: string;
}

interface FleetMapProps {
  vehicles?: VehicleMarker[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export function FleetMap({
  vehicles = [],
  height = '400px',
  center = [-1.2921, 36.8219], // Nairobi default
  zoom = 12,
}: FleetMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center,
        zoom,
        attributionControl: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add vehicle markers
    vehicles.forEach((vehicle) => {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor =
        vehicle.status === 'available'
          ? '#10b981' // green
          : vehicle.status === 'busy'
          ? '#3b82f6' // blue
          : '#6b7280'; // gray
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.3)';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([vehicle.lng, vehicle.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <p class="font-semibold text-sm">${vehicle.name}</p>
              <p class="text-xs text-gray-600">${vehicle.driverName || 'Unassigned'}</p>
              <p class="text-xs text-gray-500 capitalize">${vehicle.status}</p>
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all vehicles if any exist
    if (vehicles.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      vehicles.forEach((vehicle) => {
        bounds.extend([vehicle.lng, vehicle.lat]);
      });

      if (vehicles.length > 0) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
        });
      }
    }
  }, [mapLoaded, vehicles]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-[#9dabb9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

