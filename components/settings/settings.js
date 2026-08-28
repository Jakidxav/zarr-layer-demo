import { useState, useCallback, useEffect } from 'react';
import { Box, Button, IconButton, Input, Select, Slider, Text } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { alpha } from '@theme-ui/color';
import { Colorbar } from '@carbonplan/components';
import { X } from '@carbonplan/icons';

// import { Colorbar } from '../colorbar/index'
import { Info } from '../view/index';
import { arrayRange, useStore } from '../store/index';

export default function Settings() {
  const isWide = useBreakpointIndex() > 0;

  // shared variables and / or bands
  const rasterTypeArray = useStore((state) => state.rasterTypeArray);
  const rasterType = useStore((state) => state.rasterType);
  const setRasterType = useStore((state) => state.setRasterType);
  const rasterTypeIndex = useStore((state) => state.rasterTypeIndex);
  const setRasterTypeIndex = useStore((state) => state.setRasterTypeIndex);

  const variableArray = useStore((state) => state.variableArray);
  const variable = useStore((state) => state.variable);
  const setVariable = useStore((state) => state.setVariable);
  const variableLabels = useStore((state) => state.variableLabels);
  const variableIndex = useStore((state) => state.variableIndex);
  const setVariableIndex = useStore((state) => state.setVariableIndex);

  const bandArray = useStore((state) => state.bandArray);
  const setBand = useStore((state) => state.setBand);
  const bandLabels = useStore((state) => state.bandLabels);
  const bandIndex = useStore((state) => state.bandIndex);
  const setBandIndex = useStore((state) => state.setBandIndex);

  // time slider
  const monthArray = useStore((state) => state.monthArray);
  const minMonth = monthArray.at(0);
  const maxMonth = monthArray.at(-1);
  const month = useStore((state) => state.month);
  const setMonth = useStore((state) => state.setMonth);
  const [sliderIndex, setSliderIndex] = useState(month);
  const sliding = useStore((state) => state.sliding);
  const setSliding = useStore((state) => state.setSliding);

  // colorbar
  const colormap = useStore((state) => state.colormap)();
  const clim = useStore((state) => state.clim)();
  const defaultLabels = useStore((state) => state.defaultLabels);
  const defaultUnits = useStore((state) => state.defaultUnits);

  const sx = {
    'settings-container': {
      width: '100%',
      py: isWide ? 2 : 1,
      px: [3],
      mb: [2],
    },
    title: {
      mt: [4],
      mb: [1],
      fontSize: isWide ? 2 : 1,
      letterSpacing: 'smallcaps',
      textTransform: 'uppercase',
    },
    subtitle: {
      color: 'gray',
      fontSize: isWide ? '0.9rem' : '0.75rem',
      mt: 1,
      mb: 1,
    },
    'data-description': {
      fontSize: '0.875rem',
      color: 'primary',
    },
    'data-source': {
      mt: 2,
    },
    button: {
      alignContent: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: 'primary',
      '&:last-child': {
        borderRightWidth: '0px',
      },
    },
    'options-container': {
      width: '100%',
      height: isWide ? '2.5rem' : '2rem',
      display: 'grid',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'primary',
    },
    'raster-type-container': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      '&:hover > .confidence-level': {
        cursor: 'pointer',
      },
    },
    'variable-container': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      '&:hover > .var-selection': {
        cursor: 'pointer',
      },
    },
    'band-container': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      '&:hover > .confidence-level': {
        cursor: 'pointer',
      },
    },
    'time-slider': {
      width: '100%',
      mt: 3,
      mb: 3,
    },
    'slider-labels-container': {
      textAlign: 'center',
      pb: 0,
      mb: 3,
    },
    colorbar: {
      width: '100%',
      display: 'inline-block',
      my: 'auto',
    },
  };

  const handleRasterTypeChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setRasterTypeIndex(newIndex);
    setRasterType(rasterTypeArray.at(newIndex));
  });

  const handleVariableChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setVariableIndex(newIndex);
    setVariable(variableArray.at(newIndex));
    setBandIndex(1);
    setBand('mean');
  });

  const handleBandChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setBandIndex(newIndex);

    let band = bandArray.at(newIndex);
    setBand(band);
  });

  const generateFilterOptions = (array, callback, index, name) => {
    let options = array.map((element, idx) => {
      return (
        <Box
          as="div"
          key={idx}
          data-idx={idx}
          role="button"
          className={`${name}-selection`}
          onClick={callback}
          sx={{ ...sx['button'], bg: idx == index ? alpha('secondary', 0.5) : 'background' }}
        >
          {element}
        </Box>
      );
    });

    return options;
  };

  let rasterTypeOptions = generateFilterOptions(
    rasterTypeArray,
    handleRasterTypeChange,
    rasterTypeIndex,
    'raster-type'
  );
  let variableOptions = generateFilterOptions(
    variableLabels,
    handleVariableChange,
    variableIndex,
    'variable'
  );
  let bandOptions = generateFilterOptions(bandArray, handleBandChange, bandIndex, 'band');

  useEffect(() => {
    setMonth(sliderIndex);
  }, [sliderIndex]);

  const handleMouseDown = useCallback(() => {
    setSliding(true);
  }, [month]);

  const handleMouseUp = useCallback(() => {
    setSliding(false);
  }, [month]);

  return (
    <>
      <Box sx={sx['settings-container']}>
        {/* <Box sx={{ mt: -3 }} id="raster-type-container">
          <Box as="div" sx={sx.title} id="raster-type-title">
            Raster format{' '}
            <Info>
              Input data comes with variables as arrays, bands, or a combination of both.
            </Info>
          </Box>

          <Box
            as="div"
            id={'raster-type-container'}
            sx={{ ...sx['options-container'], ...sx['raster-type-container'] }}
          >
            {rasterTypeOptions}
          </Box>
        </Box> */}

        <Box id="var-container" sx={{ mt: -3 }}>
          <Box as="div" sx={sx.title} id="var-title">
            Variable{' '}
            <Info>
              View monthly average historical climate data for temperature and precipitation.
            </Info>
          </Box>

          <Box
            as="div"
            id={'variable-container'}
            sx={{ ...sx['options-container'], ...sx['variable-container'] }}
          >
            {variableOptions}
          </Box>

          {variable == 'temp' && rasterType.toLowerCase() == 'arrays' && (
            <Box id="bands">
              <Box as="div" sx={sx.title} id="band-title">
                Band <Info>Select a band to view minimum, mean, or maximum temperature.</Info>
              </Box>

              <Box
                as="div"
                id={'band-container'}
                sx={{ ...sx['options-container'], ...sx['band-container'] }}
              >
                {bandOptions}
              </Box>
            </Box>
          )}

          <Box id="time-slider-container">
            <Box sx={{ ...sx.title, mb: [2] }}>Month</Box>

            <Slider
              key={'time-slider'}
              id={'time-slider'}
              sx={sx['time-slider']}
              value={month}
              onChange={(e) => setSliderIndex(e.target.value)}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              min={1}
              max={12}
              step={1}
            />

            <Box sx={sx['slider-labels-container']}>
              <Box
                sx={{
                  display: 'inline-block',
                  float: 'left',
                }}
              >
                {minMonth}
              </Box>

              <Box
                sx={{
                  display: 'inline-block',
                  float: 'center',
                  color: sliding ? 'primary' : 'muted',
                }}
              >
                {month}
              </Box>

              <Box
                sx={{
                  float: 'right',
                  display: 'inline-block',
                }}
              >
                {maxMonth}
              </Box>
            </Box>
          </Box>
        </Box>

        {isWide && (
          <Colorbar
            sx={sx['colorbar']}
            sxClim={{ fontSize: [1, 1, 1, 2], pt: [1] }}
            width="100%"
            colormap={colormap}
            label={defaultLabels[variable]}
            units={defaultUnits[variable]}
            clim={[clim[0].toFixed(2), clim[1].toFixed(2)]}
            horizontal
            bottom
            discrete
          />
        )}
      </Box>
    </>
  );
}
