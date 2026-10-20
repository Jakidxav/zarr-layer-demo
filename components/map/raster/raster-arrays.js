import { useEffect, useRef } from 'react';
import { ZarrLayer } from '@carbonplan/zarr-layer';
import { useMap } from '../map-provider';
import { useStore } from '../../store/index';

// this component expects input data in the format:
// Dimensions: {'month': 12, 'y': ..., 'x': ...}
// Coordinates:
//   * month        (month) int64 1 2 3 4 5 6 7 8 9 10 11 12
//   * y            (y) float64 89.92 89.75 89.58 ... -89.58 -89.75 -89.92
//   * x            (x) float64 -179.9 -179.8 -179.6 ... 179.6 179.7 179.9
//   * spatial_ref  int64 0
// Data variables:
//     tmin     (month, y, x)
//     tavg     (month, y, x)
//     tmax     (month, y, x)
//     precip   (month, y, x)
const ArrayRaster = ({ id, setRaster }) => {
  const zarrLayerRef = useRef(null);
  const removed = useRef(false);
  const { map } = useMap();

  const clim = useStore((state) => state.clim)();
  const colormap = useStore((state) => state.colormap)();

  const packageName = useStore((state) => state.packageName);
  const zarrVersion = useStore((state) => state.versionArray[state.versionIndex]);
  const rasterFormat = useStore((state) => state.rasterFormat);
  const month = useStore((state) => state.month);

  const name = rasterFormat === 'both' ? 'arrays-and-bands' : rasterFormat;
  const source = `https://storage.googleapis.com/zarr-layer-demo/zarr/${packageName}-v${zarrVersion}-${name}.zarr`;

  // possible values: ['tmin', 'tavg', 'tmax', 'precip]
  const arrayName = useStore((state) => state.arrayName)();

  useEffect(() => {
    if (!map) return;

    map.on('remove', () => {
      removed.current = true;
    });
  }, [map]);

  useEffect(() => {
    if (!map || !arrayName) return;

    const zarrLayer = new ZarrLayer({
      id: id,
      source: source,
      zarrVersion: zarrVersion,
      variable: arrayName,
      clim: clim,
      colormap: colormap,
      selector: { month: month },
    });

    map.addLayer(zarrLayer);
    zarrLayerRef.current = zarrLayer;
    setRaster(zarrLayer);

    return () => {
      let layerId = id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    };
  }, [map, arrayName, packageName, zarrVersion]);

  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ month: month });
  }, [map, month]);

  // separating this useEffect hook out to see if we can avoid the setSelector() call
  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ month: month });
  }, [map, arrayName]);

  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    // change clim and colormap without re-rendering raster
    layer.setClim(clim);
    layer.setColormap(colormap);
  }, [map, clim, colormap]);

  return null;
};

export default ArrayRaster;
