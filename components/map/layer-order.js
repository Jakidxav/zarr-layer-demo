import { useEffect } from 'react';

import { useMap } from './map-provider';
import { useStore } from '../store/index';

const LayerOrder = () => {
  const { map } = useMap();

  const variable = useStore((state) => state.variable);
  const band = useStore((state) => state.band);
  const month = useStore((state) => state.month);
  const showStatesLayer = useStore((state) => state.showStatesLayer);
  const showCountriesLayer = useStore((state) => state.showCountriesLayer);
  const showRegionPicker = useStore((state) => state.showRegionPicker);

  useEffect(() => {
    if (!map) return;

    let layers = map.getStyle().layers;

    // find base layers - always shown
    let ocean = layers.find((layer) => layer.source == 'ocean');
    let lakesFill = layers.find((layer) => layer.source == 'lakes-fill');
    let lakes = layers.find((layer) => layer.source == 'lakes');

    // find conditional layers
    let states = showStatesLayer ? layers.find((layer) => layer.source == 'states') : undefined;
    let countries = showCountriesLayer
      ? layers.find((layer) => layer.source == 'countries')
      : undefined;
    let pointQuery = showRegionPicker
      ? layers.find((layer) => layer.source == `point-query`)
      : undefined;

    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#movelayer
    // build the complete target order list from bottom to top
    // map.moveLayer(a, b) will put a below b
    // map.moveLayer('raster', lakesFill.id);
    map.moveLayer(lakesFill.id, lakes.id);
    map.moveLayer(lakes.id, ocean.id);
    if (states) map.moveLayer(states.id, ocean.id);
    if (states) map.moveLayer(states.id, lakesFill.id);
    if (countries) map.moveLayer(countries.id, states.id);
    if (states && countries) map.moveLayer(states.id, countries.id);
    if (pointQuery) map.moveLayer(states.id, pointQuery.id);
  }, [map, showCountriesLayer, showStatesLayer, month, variable, band]);

  return null;
};

export default LayerOrder;
