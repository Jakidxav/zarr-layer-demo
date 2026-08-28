import { useEffect, useRef, useState } from 'react';
import { ZarrLayer } from '@carbonplan/zarr-layer';
import { useMap } from './map-provider';
import { useMapView } from './use-map-view';
import { useStore } from '../store/index';

const BandRaster = ({ id, formatter, setRaster }) => {
  const zarrLayerRef = useRef(null);
  const removed = useRef(false);
  const { map } = useMap();
  const { zoom, center } = useMapView();

  const clim = useStore((state) => state.clim)();
  const colormap = useStore((state) => state.colormap)();
  const rasterType = useStore((state) => state.rasterType);
  const variable = useStore((state) => state.variable);
  const band = useStore((state) => state.band);
  const month = useStore((state) => state.month);

  const version = formatter === 'topozarr' ? 3 : 2;
  const name = rasterType === 'both' ? 'arrays-and-bands' : rasterType;
  const source = `https://storage.googleapis.com/zarr-layer-demo/zarr/${formatter}-v${version}-${name}.zarr`;

  useEffect(() => {
    if (variable == 'precip') {
      setArrayName(variable);
    } else {
      // variable == 'temp'
      if (band == 'min') setBand('tmin');
      else if (band == 'mean') setBand('tavg');
      else setBand('tmax');
    }
  }, [variable, band]);

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
      zarrVersion: version,
      variable: 'variable',
      band: band,
      clim: clim,
      colormap: colormap,
      selector: { variable: 'variable', band: band, month: month },
      selector: { month: month },
    });

    map.addLayer(zarrLayer);
    zarrLayerRef.current = zarrLayer;
    setRaster(zarrLayer);

    return () => {
      let layerId = id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    };
  }, [map, band]);

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

  return null;
};

export default BandRaster;
