import { useEffect, useRef, useState } from 'react';
import { ZarrLayer } from '@carbonplan/zarr-layer';
import { useMap } from './map-provider';
import { useMapView } from './use-map-view';
import { useStore } from '../store/index';

const ArrayRaster = ({ id, formatter, setRaster }) => {
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

  // possible values: ['tmin', 'tavg', 'tmax', 'precip]
  const [arrayName, setArrayName] = useState('tavg');

  useEffect(() => {
    if (variable == 'precip') {
      setArrayName(variable);
    } else {
      // variable == 'temp'
      if (band == 'min') setArrayName('tmin');
      else if (band == 'mean') setArrayName('tavg');
      else setArrayName('tmax');
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
      variable: arrayName,
      clim: clim,
      colormap: colormap,
      // selector: { variable: arrayName, month: month },
      selector: { month: month },
    });

    map.addLayer(zarrLayer);
    zarrLayerRef.current = zarrLayer;
    setRaster(zarrLayer);

    return () => {
      let layerId = id;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    };
  }, [map, arrayName]);

  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ variable: arrayName, month: month });
  }, [map, month]);

  // separating this useEffect hook out to see if we can avoid the setSelector() call
  useEffect(() => {
    if (!map || !zarrLayerRef.current) return;
    let layer = zarrLayerRef.current;

    layer.setSelector({ variable: arrayName, month: month });
  }, [map, arrayName]);

  return null;
};

export default ArrayRaster;
