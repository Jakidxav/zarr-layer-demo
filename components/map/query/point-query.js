import { useEffect, useRef, useState } from 'react';
import { Box, useColorMode, useThemeUI } from 'theme-ui';
import { useMap } from '../map-provider';
import { v4 as uuidv4 } from 'uuid';

import { useStore } from '../../store/index';

const updatePaintProperty = (map, id, key, value) => {
  if (map.getLayer(id)) {
    map.setPaintProperty(id, key, value);
  }
};

export default function PointQuery({ id }) {
  const { theme } = useThemeUI();
  const [colorMode, setColorMode] = useColorMode();
  const { map } = useMap();

  const removed = useRef(false);
  const sourceIdRef = useRef();
  const layerIdRef = useRef();

  const packageName = useStore((state) => state.packageName);
  const rasterFormat = useStore((state) => state.rasterFormat);
  const variable = useStore((state) => state.variable);
  const stat = useStore((state) => state.stat);
  const statArray = useStore((state) => state.statArray);
  const band = useStore((state) => state.band)();
  const arrayName = useStore((state) => state.arrayName)();
  const monthArray = useStore((state) => state.monthArray);
  const raster = useStore((state) => state.raster);

  // const coords = useStore((state) => state.coords);
  // const setCoords = useStore((state) => state.setCoords);
  const setQueryStatus = useStore((state) => state.setQueryStatus);
  const setPlotData = useStore((state) => state.setPlotData);

  function toTwoDecimalPlaces(num) {
    return parseFloat(num).toFixed(2);
  }

  const initialMapCenter = map.getCenter();
  const initialCoords = [initialMapCenter.lng, initialMapCenter.lat];
  const [coords, setCoords] = useState(initialCoords);
  const [coordinates, setCoordinates] = useState([
    `Longitude: ${initialCoords[0]}`,
    `Latitude: ${initialCoords[1]}`,
  ]);

  // https://docs.mapbox.com/mapbox-gl-js/example/drag-a-point/
  const draggablePoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: initialCoords,
        },
      },
    ],
  };

  useEffect(() => {
    map.on('remove', () => {
      removed.current = true;
    });
  }, []);

  useEffect(() => {
    sourceIdRef.current = id || uuidv4();
    const { current: sourceId } = sourceIdRef;

    if (!map.getSource(sourceId)) {
      draggablePoint.features[0].geometry.coordinates = coords;

      map.addSource(sourceId, {
        type: 'geojson',
        data: draggablePoint,
      });
    }
  }, [id]);

  useEffect(() => {
    const { current: sourceId } = sourceIdRef;
    layerIdRef.current = uuidv4();
    const { current: layerId } = layerIdRef;

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 10, 7, 20],
          'circle-color': theme.rawColors.primary,
          'circle-stroke-width': 2,
          'circle-stroke-color': theme.rawColors.primary,
          'circle-opacity': 0.5,
        },
      });
    }

    function onMove(e) {
      const coords = e.lngLat;

      map.getCanvas().style.cursor = 'grabbing';

      draggablePoint.features[0].geometry.coordinates = [coords.lng, coords.lat];
      map.getSource(sourceIdRef.current).setData(draggablePoint);
    }

    function onUp(e) {
      const coords = e.lngLat;
      setCoords([
        parseFloat(toTwoDecimalPlaces(coords.lng)),
        parseFloat(toTwoDecimalPlaces(coords.lat)),
      ]);

      setCoordinates([
        `Longitude: ${toTwoDecimalPlaces(coords.lng)}`,
        `Latitude:   ${toTwoDecimalPlaces(coords.lat)}`,
      ]);

      map.getCanvas().style.cursor = '';
      map.off('mousemove', onMove);
      map.off('touchmove', onMove);
    }

    map.on('mouseenter', layerId, () => {
      map.getCanvas().style.cursor = 'move';
    });

    // map.on('mouseleave', layerId, () => {
    //   map.setPaintProperty(layerId, 'circle-color', theme.rawColors.primary);
    //   map.getCanvas().style.cursor = '';
    // });

    map.on('mouseup', layerId, (e) => {
      e.preventDefault();
      map.getCanvas().style.cursor = 'grab';
      map.on('mousemove', onMove);
      map.once('mouseup', onUp);
      map.setPaintProperty(layerId, 'circle-opacity', 0.5);
    });

    map.on('mousedown', layerId, (e) => {
      map.setPaintProperty(layerId, 'circle-opacity', 1.0);

      e.preventDefault();

      map.getCanvas().style.cursor = 'grab';
      map.on('mousemove', onMove);
      map.once('mouseup', onUp);
    });

    map.on('touchstart', layerId, (e) => {
      if (e.points.length !== 1) return;
      e.preventDefault();
      map.on('touchmove', onMove);
      map.once('touchend', onUp);
    });

    return () => {
      if (!removed.current) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
    };
  }, []);

  useEffect(() => {
    const { current: layerId } = layerIdRef;
    if (!map || !layerId) return;

    let color =
      colorMode === 'light' && variable === 'temp'
        ? theme.rawColors.primary
        : colorMode === 'light' && variable === 'precip'
          ? theme.rawColors.primary
          : colorMode === 'dark' && variable === 'temp'
            ? 'teal'
            : colorMode === 'dark' && variable === 'precip'
              ? '#B71C1C'
              : theme.colors.primary;

    updatePaintProperty(map, layerId, 'circle-color', color);
    updatePaintProperty(map, layerId, 'circle-stroke-color', color);
  }, [map, colorMode, variable]);

  useEffect(() => {
    if (!raster) {
      setPlotData(null);
      setQueryStatus('idle');
      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    let selector;
    if (rasterFormat === 'arrays') {
      // no bands, can only query specific arrays for all months
      // returns:
      // coordinates: Object { lat: (1) […], lon: (1) […], month: (12) […] }
      // dimensions: Array(3) [ "month", "lat", "lon" ]
      // tavg: Object { 1: (1) […], 2: (1) […], 3: (1) […], … }
      selector = {
        month: monthArray,
      };
    } else if (rasterFormat === 'bands') {
      selector = {
        // queries across all months and bands for a single variable
        // returns:
        // coordinates: Object { lat: (1) […], lon: (1) […], band: (4) […], … }
        // dimensions: Array(4) [ "band", "month", "lat", … ]
        // variable: Object { tmin: {…}, tavg: {…}, tmax: {…}, … }
        month: monthArray,
        band: variable === 'temp' ? ['tmin', 'tavg', 'tmax'] : 'precip',
      };
    } else {
      // 'both'
      // can't query across arrays, only bands and months
      // returns:
      // coordinates: Object { lat: (1) […], lon: (1) […], band: (3) […], … }
      // dimensions: Array(4) [ "band", "month", "lat", … ]
      // temp: Object { min: {…}, mean: {…}, max: {…} }
      selector = {
        month: monthArray,
        band: statArray, // ['min', 'mean', 'max']
      };
    }

    const rasterQuery = raster.ready.then(() => {
      if (signal.aborted) return;
      setQueryStatus('loading');

      return raster
        .queryData({ type: 'Point', coordinates: coords }, selector, { signal })
        .then((result) => {
          setPlotData(result ?? null);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setQueryStatus('error');
            console.error('Error querying raster:', error);
          }
        });
    });

    return () => {
      abortController.abort();
    };
  }, [raster, coords, variable, arrayName, band, stat, rasterFormat, packageName]);

  return (
    <Box
      as="div"
      id={'coordinates-container'}
      sx={{
        position: 'absolute',
        right: [2],
        bottom: [50],
        zIndex: 10,
        display: coordinates ? 'block' : 'none',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '0.3rem 0.7rem',
        margin: 0,
        borderWidth: '1px',
        borderColor: 'primary',
        borderStyle: 'solid',
        borderRadius: '0.2rem',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        lineHeight: '1.2rem',
      }}
    >
      {coordinates &&
        coordinates.map((coord, idx) => (
          <p key={idx} style={{ margin: 0 }}>
            {coord}
          </p>
        ))}
    </Box>
  );
}
