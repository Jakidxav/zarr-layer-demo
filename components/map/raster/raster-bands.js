import { useEffect, useRef, useState } from 'react';
import { ZarrLayer } from '@carbonplan/zarr-layer';
import { useMap } from '../map-provider';
import { useMapView } from '../use-map-view';
import { useStore } from '../../store/index';

// This component expects input data in the format:
// Dimensions: {'month': 12, 'band': 4, 'y': ..., 'x': ...}
// Coordinates:
//   * month        (month) int64 1 2 3 4 5 6 7 8 9 10 11 12
//   * band         (band) object 'tmin' 'tavg' 'tmax' 'precip'
//   * y            (y) float64 89.92 89.75 89.58 ... -89.58 -89.75 -89.92
//   * x            (x) float64 -179.9 -179.8 -179.6 ... 179.6 179.7 179.9
//   * spatial_ref  int64 0
// Data variables:
//     variable  (band, month, y, x)
const BandRaster = ({ id, setRaster }) => {
  const zarrLayerRef = useRef(null);
  const removed = useRef(false);
  const { map } = useMap();
  const { zoom, center } = useMapView();

  const clim = useStore((state) => state.clim)();
  const colormap = useStore((state) => state.colormap)();

  const packageName = useStore((state) => state.packageName);
  const version = useStore((state) => state.versionArray[state.versionIndex]);
  const rasterFormat = useStore((state) => state.rasterFormat);
  const variable = useStore((state) => state.variable);
  const stat = useStore((state) => state.stat);
  const band = useStore((state) => state.band)();
  const month = useStore((state) => state.month);
  const name = rasterFormat === 'both' ? 'arrays-and-bands' : rasterFormat;
  const source = `https://storage.googleapis.com/zarr-layer-demo/zarr/${packageName}-${version}-${name}.zarr`;

  useEffect(() => {
    if (!map) return;

    map.on('remove', () => {
      removed.current = true;
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const zarrLayer = new ZarrLayer({
      id: id,
      source: source,
      zarrVersion: version,
      variable: 'variable',
      clim: clim,
      colormap: colormap,
      selector: { variable: 'variable', band: band, month: month },
    });

    map.addLayer(zarrLayer);
    zarrLayerRef.current = zarrLayer;
    setRaster(zarrLayer);

    return () => {
      let layerId = id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    };
  }, [map, packageName, version]);

  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ variable: 'variable', band: band, month: month });
  }, [map, month]);

  // separating this useEffect hook out to see if we can avoid the setSelector() call
  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ variable: 'variable', band: band, month: month });
  }, [map, band]);

  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    // change clim and colormap without re-rendering raster
    layer.setClim(clim);
    layer.setColormap(colormap);
  }, [map, clim, colormap]);

  return null;
};

export default BandRaster;
