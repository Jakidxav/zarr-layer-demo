import { Box, useThemeUI } from 'theme-ui';
import { useState, useEffect } from 'react';
import { Slider } from '@carbonplan/components';

import MapProvider from './map-provider';
import Basemap from './basemap';
import Fill from './fill';
import Line from './line';
import ArrayRaster from './raster-arrays';
import BandRaster from './raster-bands';
import ArrayAndBandRaster from './raster-arrays-and-bands';
import Router from './router';
import ZoomReset from './zoom-reset';
import LayerOrder from './layer-order';
import { useStore } from '../store/index';

export const Map = () => {
  const { theme } = useThemeUI();

  const zoom = useStore((state) => state.zoom);
  const rasterType = useStore((state) => state.rasterType);
  const variable = useStore((state) => state.variable);
  const month = useStore((state) => state.month);
  const band = useStore((state) => state.band);
  const setRaster = useStore((state) => state.setRaster);

  const showLandLayer = useStore((state) => state.showLandLayer);
  const showLakesLayer = useStore((state) => state.showLakesLayer);
  const showCountriesLayer = useStore((state) => state.showCountriesLayer);
  const showStatesLayer = useStore((state) => state.showStatesLayer);
  const showCharts = useStore((store) => store.showCharts);

  return (
    <MapProvider>
      <Basemap />

      {/* {rasterType === 'arrays' && (
        <ArrayRaster
          // key={`${formatter}-raster`}
          id={'raster'}
          formatter={'ndpyramid'}
          // formatter={'topozarr'}
          setRaster={setRaster}
        />
    )} */}

      {/* {rasterType === 'bands' && (
        <BandRaster
          // key={`${formatter}-raster`}
          id={'raster'}
          formatter={'ndpyramid'}
          // formatter={'topozarr'}
          setRaster={setRaster}
        />
    )} */}

      {/* {rasterType === 'both' && (
        <ArrayAndBandRaster
          // key={`${formatter}-raster`}
          id={'raster'}
          formatter={'ndpyramid'}
          // formatter={'topozarr'}
          setRaster={setRaster}
        />
    )} */}

      {showLakesLayer && (
        <>
          <Fill
            id={'lakes-fill'}
            color={theme.rawColors.primary}
            source={'https://storage.googleapis.com/zarr-layer-demo/vector/largest_lakes'}
            variable={'largest_lakes'}
          />

          <Line
            id={'lakes'}
            color={theme.rawColors.primary}
            source={'https://storage.googleapis.com/zarr-layer-demo/vector/largest_lakes'}
            variable={'largest_lakes'}
            width={1}
          />
        </>
      )}

      <Fill
        id={'ocean'}
        color={theme.rawColors.primary}
        source={'https://storage.googleapis.com/zarr-layer-demo/vector/ocean'}
        variable={'ocean'}
      />

      {showStatesLayer && (
        <Line
          id={'states'}
          color={theme.rawColors.muted}
          source={'https://storage.googleapis.com/zarr-layer-demo/vector/states'}
          variable={'states'}
          width={zoom < 4 ? 0 : 1}
        />
      )}

      {showCountriesLayer && (
        <Line
          id={'countries'}
          color={theme.rawColors.primary}
          source={'https://storage.googleapis.com/zarr-layer-demo/vector/countries'}
          variable={'countries'}
          width={showStatesLayer && zoom > 4 ? 1.5 : 1}
        />
      )}

      {/* {showCharts && <PointQuery />} */}

      {/* <Router /> */}

      <ZoomReset />

      <LayerOrder />
    </MapProvider>
  );
};
