import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import { useMap } from './map-provider';
import { useStore } from '../store/index';

const Basemap = () => {
  const initialCenter = useStore((state) => state.initialCenter);
  const initialZoom = useStore((state) => state.initialZoom);
  const minZoom = useStore((state) => state.minZoom);
  const maxZoom = useStore((state) => state.maxZoom);
  const bounds = useStore((state) => state.bounds);

  const mapContainerRef = useRef(null);
  const { map, setMap } = useMap();

  useEffect(() => {
    if (map) return; // already created

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: { version: 8, sources: {}, layers: [] }, // projection: {type: 'globe'} },
      center: initialCenter,
      zoom: initialZoom,
      minZoom: minZoom,
      maxZoom: maxZoom,
      maxBounds: bounds,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, [setMap]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default Basemap;
