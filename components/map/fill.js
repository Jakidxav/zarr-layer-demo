// This component has been modified from source:
// https://github.com/carbonplan/maps/blob/main/src/fill.js

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMap } from './map-provider';
import { updatePaintProperty } from './utils';

const Fill = ({ source, variable, color, id, maxZoom = 5, opacity = 1 }) => {
  const { map } = useMap();
  const removed = useRef(false);

  const sourceIdRef = useRef();
  const layerIdRef = useRef();

  useEffect(() => {
    if (!map) return;

    map.on('remove', () => {
      removed.current = true;
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;

    sourceIdRef.current = id || uuidv4();
    const { current: sourceId } = sourceIdRef;
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'vector',
        tiles: [`${source}/{z}/{x}/{y}.pbf`],
      });
      if (maxZoom) {
        map.getSource(sourceId).maxzoom = maxZoom;
      }
    }
  }, [map, id]);

  useEffect(() => {
    if (!map) return;

    layerIdRef.current = uuidv4();
    const { current: layerId } = layerIdRef;
    const { current: sourceId } = sourceIdRef;
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        'source-layer': variable,
        layout: { visibility: 'visible' },
        paint: {
          'fill-color': color,
          'fill-opacity': opacity,
        },
      });
    }

    return () => {
      if (!removed.current) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !layerIdRef.current) return;
    updatePaintProperty(map, layerIdRef, 'fill-color', color);
  }, [map, color]);

  useEffect(() => {
    if (!map || !layerIdRef.current) return;
    updatePaintProperty(map, layerIdRef, 'fill-opacity', opacity);
  }, [map, opacity]);

  return null;
};

export default Fill;
