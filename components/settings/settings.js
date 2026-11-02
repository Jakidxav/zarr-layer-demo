import { useCallback, useEffect, useMemo } from 'react';
import { Box } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { alpha } from '@theme-ui/color';

import TimeSlider from './time-slider/time-slider';
import { Colorbar } from '../colorbar/index';
import { Info } from '../view/index';
import { useStore } from '../store/index';

export default function Settings() {
  const isWide = useBreakpointIndex() > 0;

  // settings
  const packageNameArray = useStore((state) => state.packageNameArray);
  const packageName = useStore((state) => state.packageName);
  const packageNameIndex = useStore((state) => state.packageNameIndex);
  const setPackage = useStore((state) => state.setPackage);

  const versionArray = useStore((state) => state.versionArray);
  const versionIndex = useStore((state) => state.versionIndex);
  const selectVersionByIndex = useStore((s) => s.selectVersionByIndex);

  const zarrFormatArray = useStore((state) => state.zarrFormatArray);
  const zarrFormatIndex = useStore((state) => state.zarrFormatIndex);
  const setZarrFormatIndex = useStore((state) => state.setZarrFormatIndex);

  const rasterFormatArray = useStore((state) => state.rasterFormatArray);
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
    'package-name-options': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'zarr-version-options': {
      // gridTemplateColumns: packageName === 'ndpyramid' ? '1fr' : 'repeat(2, 1fr)',
      gridTemplateColumns: '1fr',
    },
    'zarr-format-options': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'raster-format-options': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    'variable-options': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'stat-options': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  };

  const handlePackageNameChange = useCallback(
    (event) => {
      let newIndex = event.currentTarget.getAttribute('data-idx');
      setPackage(packageNameArray.at(newIndex));
    },
    [setPackage, packageNameArray]
  );

  const handleZarrVersionChange = useCallback(
    (event) => {
      let newIndex = event.currentTarget.getAttribute('data-idx');
      selectVersionByIndex(newIndex);
    },
    [selectVersionByIndex, versionArray]
  );

  const handleZarrFormatChange = useCallback((event) => {
    let newIndex = event.currentTarget.getAttribute('data-idx');
    setZarrFormatIndex(newIndex);
  });

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

  const generateFilterOptions = (array, callback, index) => {
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
    packageNameIndex
  );

  const zarrVersionOptions = useMemo(
    () => generateFilterOptions(versionArray, handleZarrVersionChange, versionIndex),
    [versionArray, versionIndex, packageName, handleZarrVersionChange]
  );

  let zarrFormatOptions = generateFilterOptions(
    zarrFormatArray,
    handleZarrFormatChange,
    zarrFormatIndex
  );

  let rasterFormatOptions = generateFilterOptions(
    rasterFormatArray,
    handleRasterFormatChange,
    rasterFormatIndex
  );

  let variableOptions = generateFilterOptions(variableLabels, handleVariableChange, variableIndex);
  let statOptions = generateFilterOptions(statArray, handleStatChange, statIndex);

  return (
    <>
      <Box sx={sx['settings-container']}>
        <Box sx={{ mt: -3 }} id="package-name-container">
          <Box as="div" sx={sx.title} id="package-name-title">
            Package <Info>The Python package used to process the raster data.</Info>
          </Box>

          <Box
            as="div"
            id={'package-name-options'}
            sx={{ ...sx['options-container'], ...sx['package-name-options'] }}
          >
            {packageNameOptions}
          </Box>
        </Box>

        <Box id="zarr-version-container">
          <Box as="div" sx={sx.title} id="zarr-version-title">
            Zarr version
            <Info>Use Zarr v2 with consolidated metadata or v3 with unconsolidated metadata.</Info>
          </Box>

          <Box
            as="div"
            id={'zarr-version-options'}
            sx={{ ...sx['options-container'], ...sx['zarr-version-options'] }}
          >
            {zarrVersionOptions}
          </Box>
        </Box>

        {packageName === 'topozarr' && (
          <Box id="zarr-format-container">
            <Box as="div" sx={sx.title} id="zarr-format-title">
              Zarr format
              <Info>Choose between a 'flat' or pyramid Zarr store.</Info>
            </Box>

            <Box
              as="div"
              id={'zarr-format-options'}
              sx={{ ...sx['options-container'], ...sx['zarr-format-options'] }}
            >
              {zarrFormatOptions}
            </Box>
          </Box>
        )}

        <Box id="raster-format-container">
          <Box as="div" sx={sx.title} id="raster-format-title">
            Raster format{' '}
            <Info>Input data comes with variables as arrays, bands, or a combination of both.</Info>
          </Box>

          <Box
            as="div"
            id={'raster-format-options'}
            sx={{ ...sx['options-container'], ...sx['raster-format-options'] }}
          >
            {rasterFormatOptions}
          </Box>
        </Box>

        <Box id="variable-container">
          <Box as="div" sx={sx.title} id="variable-title">
            Variable{' '}
            <Info>
              View monthly average historical climate data for temperature and precipitation.
            </Info>
          </Box>

          <Box
            as="div"
            id={'variable-options'}
            sx={{ ...sx['options-container'], ...sx['variable-options'] }}
          >
            {variableOptions}
          </Box>

          {variable === 'temp' && (
            <Box id="stats-container" sx={{ mb: isWide ? 0 : 2 }}>
              <Box as="div" sx={sx.title} id="stat-title">
                Band <Info>Select a band to view minimum, mean, or maximum temperature.</Info>
              </Box>

              <Box
                as="div"
                id={'stat-options'}
                sx={{ ...sx['options-container'], ...sx['stat-options'] }}
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
