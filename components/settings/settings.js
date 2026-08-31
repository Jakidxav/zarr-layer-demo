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
  const packageNameArray = useStore((state) => state.packageNameArray);
  const packageName = useStore((state) => state.packageName);
  const setPackageName = useStore((state) => state.setPackageName);
  const packageNameIndex = useStore((state) => state.packageNameIndex);
  const setPackageNameIndex = useStore((state) => state.setPackageNameIndex);

  const rasterFormatArray = useStore((state) => state.rasterFormatArray);
  const rasterFormat = useStore((state) => state.rasterFormat);
  const setRasterFormat = useStore((state) => state.setRasterFormat);
  const rasterFormatIndex = useStore((state) => state.rasterFormatIndex);
  const setRasterFormatIndex = useStore((state) => state.setRasterFormatIndex);

  const variableArray = useStore((state) => state.variableArray);
  const variable = useStore((state) => state.variable);
  const setVariable = useStore((state) => state.setVariable);
  const variableLabels = useStore((state) => state.variableLabels);
  const variableIndex = useStore((state) => state.variableIndex);
  const setVariableIndex = useStore((state) => state.setVariableIndex);

  const statArray = useStore((state) => state.statArray);
  const setStat = useStore((state) => state.setStat);
  const statLabels = useStore((state) => state.statLabels);
  const statIndex = useStore((state) => state.statIndex);
  const setStatIndex = useStore((state) => state.setStatIndex);

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
    'package-name-container': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'raster-type-container': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    'variable-container': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'stat-container': {
      gridTemplateColumns: 'repeat(3, 1fr)',
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

  const handlePackageNameChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setPackageNameIndex(newIndex);
    setPackageName(packageNameArray.at(newIndex));
  });

  const handleRasterFormatChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setRasterFormatIndex(newIndex);
    setRasterFormat(rasterFormatArray.at(newIndex));
  });

  const handleVariableChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setVariableIndex(newIndex);
    setVariable(variableArray.at(newIndex));
    setStatIndex(1);
    setStat('mean');
  });

  const handleStatChange = useCallback((event) => {
    let newIndex = event.target.getAttribute('data-idx');
    setStatIndex(newIndex);

    let stat = statArray.at(newIndex);
    setStat(stat);
  });

  const generateFilterOptions = (array, callback, index, name) => {
    let options = array.map((element, idx) => {
      return (
        <Box
          as="div"
          key={idx}
          data-idx={idx}
          role="button"
          className={'settings-button'}
          onClick={callback}
          sx={{ ...sx['button'], bg: idx == index ? alpha('secondary', 0.5) : 'background' }}
        >
          {element}
        </Box>
      );
    });

    return options;
  };

  let packageNameOptions = generateFilterOptions(
    packageNameArray,
    handlePackageNameChange,
    packageNameIndex,
    'package-name'
  );

  let rasterFormatOptions = generateFilterOptions(
    rasterFormatArray,
    handleRasterFormatChange,
    rasterFormatIndex,
    'raster-type'
  );

  let variableOptions = generateFilterOptions(
    variableLabels,
    handleVariableChange,
    variableIndex,
    'variable'
  );

  let statOptions = generateFilterOptions(statArray, handleStatChange, statIndex, 'stat');

  useEffect(() => {
    setMonth(Number(sliderIndex));
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
        <Box sx={{ mt: -3 }} id="package-name-container">
          <Box as="div" sx={sx.title} id="package-name-title">
            Package <Info>The Python package used to process the raster data.</Info>
          </Box>

          <Box
            as="div"
            id={'raster-type-container'}
            sx={{ ...sx['options-container'], ...sx['package-name-container'] }}
          >
            {packageNameOptions}
          </Box>
        </Box>

        <Box id="raster-type-container">
          <Box as="div" sx={sx.title} id="raster-type-title">
            Raster format{' '}
            <Info>Input data comes with variables as arrays, bands, or a combination of both.</Info>
          </Box>

          <Box
            as="div"
            id={'raster-type-container'}
            sx={{ ...sx['options-container'], ...sx['raster-type-container'] }}
          >
            {rasterFormatOptions}
          </Box>
        </Box>

        <Box id="var-container">
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

          {variable === 'temp' && (
            <Box id="stats">
              <Box as="div" sx={sx.title} id="stat-title">
                Band <Info>Select a band to view minimum, mean, or maximum temperature.</Info>
              </Box>

              <Box
                as="div"
                id={'stat-container'}
                sx={{ ...sx['options-container'], ...sx['stat-container'] }}
              >
                {statOptions}
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
