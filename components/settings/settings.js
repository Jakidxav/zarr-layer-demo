import { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Button, IconButton, Input, Select, Slider, Text } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { alpha } from '@theme-ui/color';
// import { Colorbar } from '@carbonplan/components';
import { X } from '@carbonplan/icons';

import TimeSlider from './time-slider/time-slider';
import { Colorbar } from '../colorbar/index';
import { Info } from '../view/index';
import { arrayRange, useStore } from '../store/index';

export default function Settings() {
  const isWide = useBreakpointIndex() > 0;

  // settings
  const packageNameArray = useStore((state) => state.packageNameArray);
  const packageName = useStore((state) => state.packageName);
  const setPackageName = useStore((state) => state.setPackageName);
  const packageNameIndex = useStore((state) => state.packageNameIndex);
  const setPackageNameIndex = useStore((state) => state.setPackageNameIndex);

  const versionArray = useStore((state) => state.versionArray);
  const setVersionArray = useStore((state) => state.setVersionArray);
  const versionIndex = useStore((state) => state.versionIndex);
  const setVersionIndex = useStore((state) => state.setVersionIndex);
  const selectVersionByIndex = useStore((s) => s.selectVersionByIndex);

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
    'version-container': {
      gridTemplateColumns: packageName === 'ndpyramid' ? '1fr' : 'repeat(2, 1fr)',
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
  };

  const handlePackageNameChange = useCallback((event) => {
    let newIndex = event.currentTarget.getAttribute('data-idx');
    setPackageNameIndex(newIndex);
    setPackageName(packageNameArray.at(newIndex));
  });

  const handleVersionChange = useCallback(
    (event) => {
      let newIndex = event.currentTarget.getAttribute('data-idx');
      selectVersionByIndex(newIndex);
    },
    [selectVersionByIndex]
  );

  const handleRasterFormatChange = useCallback((event) => {
    let newIndex = event.currentTarget.getAttribute('data-idx');
    setRasterFormatIndex(newIndex);
    setRasterFormat(rasterFormatArray.at(newIndex));
  });

  const handleVariableChange = useCallback((event) => {
    let newIndex = event.currentTarget.getAttribute('data-idx');
    setVariableIndex(newIndex);
    setVariable(variableArray.at(newIndex));
    setStatIndex(1);
    setStat('mean');
  });

  const handleStatChange = useCallback((event) => {
    let newIndex = event.currentTarget.getAttribute('data-idx');
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

  const versionOptions = useMemo(
    () =>
      generateFilterOptions(
        versionArray,
        handleVersionChange,
        versionIndex,
        `${packageName}-version-options`
      ),
    [versionArray, versionIndex, packageName, handleVersionChange]
  );

  useEffect(() => {
    const array = packageName === 'ndpyramid' ? ['v2'] : ['v2', 'v3'];
    setVersionArray(array);
    selectVersionByIndex(array.length - 1);
  }, [packageName]);

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

        <Box id="version-container">
          <Box as="div" sx={sx.title} id="version-title">
            Version <Info>Use Zarr version 2 or 3.</Info>
          </Box>

          <Box
            as="div"
            id={'version-container'}
            sx={{ ...sx['options-container'], ...sx['version-container'] }}
          >
            {versionOptions}
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
            <Box id="stats" sx={{ mb: isWide ? 0 : 2 }}>
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

          {isWide && <TimeSlider />}
        </Box>

        {isWide && <Colorbar />}
      </Box>
    </>
  );
}
