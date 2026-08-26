// This component has been modified from source:
// https://github.com/carbonplan/maps/blob/main/src/line.js

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMap } from './map-provider';
import { updatePaintProperty } from './utils';

const Line = ({
  source,
  variable,
  color,
  id,
  maxZoom = 5,
  opacity = 1,
  blur = 0.4,
  width = 0.5,
}) => {
  const { map } = useMap();
  const removed = useRef(false);

  const sourceIdRef = useRef();
  const layerIdRef = useRef();

  useEffect(() => {
    if (!map) return;

    map.on('remove', () => {
      removed.current = true;
    });
  }, []);

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

    const layerId = layerIdRef.current || uuidv4();
    layerIdRef.current = layerId;
    const { current: sourceId } = sourceIdRef;
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        'source-layer': variable,
        layout: { visibility: 'visible' },
        paint: {
          'line-blur': blur,
          'line-color': color,
          'line-opacity': opacity,
          'line-width': width,
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
    updatePaintProperty(map, layerIdRef, 'line-color', color);
  }, [color]);

  useEffect(() => {
    updatePaintProperty(map, layerIdRef, 'line-opacity', opacity);
  }, [opacity]);

  useEffect(() => {
    updatePaintProperty(map, layerIdRef, 'line-width', width);
  }, [width]);

  useEffect(() => {
    updatePaintProperty(map, layerIdRef, 'line-blur', blur);
  }, [blur]);

  return null;
};

export default Line;
