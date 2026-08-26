import { useEffect } from 'react';
import { useMap } from './map-provider';
import { useStore } from '../store/index';

export const useMapView = () => {
  const { map } = useMap();

  const zoom = useStore((state) => state.zoom);
  const setZoom = useStore((state) => state.setZoom);
  const center = useStore((state) => state.center);
  const setCenter = useStore((state) => state.setCenter);

  useEffect(() => {
    if (!map) return;

    const updateView = () => {
      let z = map.getZoom();
      z = parseFloat(z.toFixed(2));

      let c = map.getCenter();
      c = [parseFloat(c.lng.toFixed(2)), parseFloat(c.lat.toFixed(2))];

      setZoom(z);
      setCenter(c);
    };

    // initial update
    updateView();

    // subscribe to updates
    map.on('move', updateView);

    // cleanup
    return () => {
      map.off('move', updateView);
    };
  }, [map]);

  return { zoom, center };
};
