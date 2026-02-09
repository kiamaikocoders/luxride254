import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidW5tYXNraW5nIiwiYSI6ImNtaHo5dmY5cDBpcncybHM1aTI4cjZ3b3IifQ.yNt2bslI1wAyoeoKREtVyw';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface GeofenceMapProps {
  geofences?: Array<{
    id: string;
    name: string;
    coordinates: number[][]; // Array of [lng, lat] pairs
    type: 'polygon' | 'circle';
    color?: string;
  }>;
  height?: string;
  center?: [number, number];
  zoom?: number;
  onMapClick?: (coordinates: [number, number]) => void;
}

export function GeofenceMap({
  geofences = [],
  height = '200px',
  center = [-1.2921, 36.8219], // Nairobi default
  zoom = 11,
  onMapClick,
}: GeofenceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const layersRef = useRef<string[]>([]);
  const sourcesRef = useRef<string[]>([]);

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

      if (onMapClick) {
        map.current.on('click', (e) => {
          onMapClick([e.lngLat.lng, e.lngLat.lat]);
        });
      }
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

    // Remove layers first (must remove layers before sources)
    layersRef.current.forEach((layerId) => {
      try {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
      } catch (e) {
        // Layer might already be removed
      }
    });
    layersRef.current = [];

    // Then remove sources
    sourcesRef.current.forEach((sourceId) => {
      try {
        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }
      } catch (e) {
        // Source might already be removed
      }
    });
    sourcesRef.current = [];

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add geofence polygons
    geofences.forEach((geofence, index) => {
      // Use geofence.id if available, otherwise use index for stable IDs
      const idSuffix = geofence.id || `index-${index}`;
      const sourceId = `geofence-${idSuffix}`;
      const layerId = `geofence-layer-${idSuffix}`;
      const outlineLayerId = `${layerId}-outline`;

      if (geofence.type === 'polygon' && geofence.coordinates.length > 0) {
        // Close the polygon if not already closed
        const coords = [...geofence.coordinates];
        if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
          coords.push(coords[0]);
        }

        try {
          // Check if source already exists, if so update it, otherwise add it
          if (map.current?.getSource(sourceId)) {
            (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
              properties: {
                name: geofence.name,
              },
            });
          } else {
            map.current?.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [coords],
                },
                properties: {
                  name: geofence.name,
                },
              },
            });
          }

          // Add fill layer
          if (!map.current?.getLayer(layerId)) {
            map.current?.addLayer({
              id: layerId,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': geofence.color || '#137fec',
                'fill-opacity': 0.2,
              },
            });
          }

          // Add outline layer
          if (!map.current?.getLayer(outlineLayerId)) {
            map.current?.addLayer({
              id: outlineLayerId,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': geofence.color || '#137fec',
                'line-width': 2,
              },
            });
          }

          sourcesRef.current.push(sourceId);
          layersRef.current.push(layerId, outlineLayerId);
        } catch (e) {
          console.error('Error adding geofence:', e);
        }
      }
    });

    // Fit bounds to show all geofences if any exist
    if (geofences.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      geofences.forEach((geofence) => {
        geofence.coordinates.forEach((coord) => {
          bounds.extend([coord[0], coord[1]]);
        });
      });

      if (geofences.length > 0) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
        });
      }
    }
  }, [mapLoaded, geofences]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#283039] text-[#9dabb9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

