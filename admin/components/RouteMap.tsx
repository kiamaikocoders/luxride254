import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidW5tYXNraW5nIiwiYSI6ImNtaHo5dmY5cDBpcncybHM1aTI4cjZ3b3IifQ.yNt2bslI1wAyoeoKREtVyw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface RouteMapProps {
  pickupLat?: number;
  pickupLng?: number;
  pickupAddress?: string;
  destinationLat?: number;
  destinationLng?: number;
  destinationAddress?: string;
  distance?: number;
  duration?: number;
  height?: string;
}

export function RouteMap({
  pickupLat,
  pickupLng,
  pickupAddress,
  destinationLat,
  destinationLng,
  destinationAddress,
  distance,
  duration,
  height = '256px',
}: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Default to Nairobi, Kenya if no coordinates
    const defaultCenter: [number, number] = [-1.2921, 36.8219]; // Nairobi coordinates
    const hasCoordinates = pickupLat && pickupLng && destinationLat && destinationLng;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: hasCoordinates
          ? [(pickupLng! + destinationLng!) / 2, (pickupLat! + destinationLat!) / 2]
          : defaultCenter,
        zoom: hasCoordinates ? 12 : 11,
        attributionControl: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    return () => {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
    }

    // Add pickup marker
    if (pickupLat && pickupLng) {
      const pickupEl = document.createElement('div');
      pickupEl.className = 'pickup-marker';
      pickupEl.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #10b981;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">📍</span>
          </div>
        </div>
      `;

      pickupMarkerRef.current = new mapboxgl.Marker({ element: pickupEl })
        .setLngLat([pickupLng, pickupLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="color: #111; padding: 4px;">
              <strong>Pickup</strong><br/>
              ${pickupAddress || 'Pickup Location'}
            </div>`
          )
        )
        .addTo(map.current);
    }

    // Add destination marker
    if (destinationLat && destinationLng) {
      const destinationEl = document.createElement('div');
      destinationEl.className = 'destination-marker';
      destinationEl.innerHTML = `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #ef4444;
          transform: rotate(135deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(-135deg);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">📍</span>
          </div>
        </div>
      `;

      destinationMarkerRef.current = new mapboxgl.Marker({ element: destinationEl })
        .setLngLat([destinationLng, destinationLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="color: #111; padding: 4px;">
              <strong>Destination</strong><br/>
              ${destinationAddress || 'Destination Location'}
            </div>`
          )
        )
        .addTo(map.current);
    }

    // Fit bounds if both coordinates exist
    if (pickupLat && pickupLng && destinationLat && destinationLng && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([pickupLng, pickupLat]);
      bounds.extend([destinationLng, destinationLat]);

      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
      });

      // Add route line (simplified - in production you'd use Mapbox Directions API)
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [pickupLng, pickupLat],
              [destinationLng, destinationLat],
            ],
          },
        });
      } else {
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [pickupLng, pickupLat],
                  [destinationLng, destinationLat],
                ],
              },
            },
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#137fec',
            'line-width': 4,
            'line-opacity': 0.75,
          },
        });
      }
    }
  }, [mapLoaded, pickupLat, pickupLng, destinationLat, destinationLng, pickupAddress, destinationAddress]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#283039] text-[#9dabb9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

