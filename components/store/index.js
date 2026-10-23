import { useThemedColormap } from '@carbonplan/colormaps';
import { create } from 'zustand';

export const useStore = create((set, get) => {
  const PACKAGE_NAME_ARRAY = ['ndpyramid', 'topozarr'];

  const VERSIONS_BY_PACKAGE = {
    ndpyramid: [2],
    // topozarr: [2, 3],
    topozarr: [3],
  };

  return {
    // map container state
    initialZoom: 0,
    zoom: 0,
    setZoom: (zoom) => set({ zoom }),

    minZoom: 1,
    maxZoom: 7,

    // this is for the initial map load
    initialCenter: [-60, 20],
    center: [-60, 20],
    setCenter: (center) => set({ center }),

    packageNameArray: PACKAGE_NAME_ARRAY,
    packageName: 'ndpyramid',
    packageNameIndex: 0,
    setPackage: (packageName) => {
      const packageNameIndex = PACKAGE_NAME_ARRAY.indexOf(packageName);
      const versionArray = VERSIONS_BY_PACKAGE[packageName];
      set(() => ({
        packageName,
        packageNameIndex,
        versionArray,
        versionIndex: versionArray.length - 1,
      }));
    },

    versionArray: [2],
    versionIndex: 0,
    selectVersionByIndex: (index) => set({ versionIndex: Number(index) }),

    rasterFormatArray: ['arrays', 'bands', 'both'],
    rasterFormat: 'both',
    setRasterFormat: (rasterFormat) => set({ rasterFormat }),
    rasterFormatIndex: 0,
    setRasterFormatIndex: (rasterFormatIndex) => set({ rasterFormatIndex }),

    variableArray: ['temp', 'precip'],
    variableLabels: ['temperature', 'precipitation'],
    variable: 'temp',
    setVariable: (variable) => set({ variable }),
    variableIndex: 0,
    setVariableIndex: (variableIndex) => set({ variableIndex }),

    statArray: ['min', 'mean', 'max'],
    statLabels: ['Min', 'Mean', 'Max'],
    stat: 'mean',
    setStat: (stat) => set({ stat }),
    statIndex: 1,
    setStatIndex: (statIndex) => set({ statIndex }),

    // this is used for the Zarr store saved as arrays
    arrayName: () => {
      const { variable, stat } = get();

      if (variable == 'precip') {
        return variable;
      } else {
        // variable == 'temp'
        if (stat === 'min') return 'tmin';
        else if (stat === 'mean') return 'tavg';
        else return 'tmax';
      }
    },

    // this is used for the Zarr store saved as bands
    // note: this is exactly the same method as above for `arrayName`
    // this is separate because sometimes the array and band names are
    // the same depending on the input data format, other times the array
    // names are equal to the variable names and the bands equal to the stat names
    band: () => {
      const { variable, stat } = get();

      if (variable == 'precip') {
        return variable;
      } else {
        // variable == 'temp'
        if (stat === 'min') return 'tmin';
        else if (stat === 'mean') return 'tavg';
        else return 'tmax';
      }
    },

    monthArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    month: 1,
    setMonth: (month) => set({ month }),

    colormapName: '',
    setColormapName: (colormapName) => set({ colormapName }),
    colormap: () => {
      const { variable } = get();
      return {
        temp: useThemedColormap('warm'),
        precip: useThemedColormap('cool'),
      }[variable];
    },

    climRanges: {
      temp: { min: -40, max: 40 },
      precip: { min: 0.0, max: 400.0 },
    },
    clim: () => {
      const { climRanges, variable } = get();
      return [climRanges[variable].min, climRanges[variable].max];
    },

    raster: { current: null },
    setRaster: (ref) => set((state) => ({ raster: ref })),

    showCharts: false,
    setShowCharts: (showCharts) => set({ showCharts }),

    filterCoordinates: [],
    setFilterCoordinates: (filterCoordinates) => set({ filterCoordinates }),

    // coords: [0, 10],
    // setCoords: (coords) => set({ coords }),

    plotData: {},
    setPlotData: (plotData) => set({ plotData, queryStatus: 'success' }),
    setQueryStatus: (status) => set({ queryStatus: status }),

    showLandLayer: true,
    setShowLandLayer: (showLandLayer) => set({ showLandLayer }),

    showCountriesLayer: true,
    setShowCountriesLayer: (showCountriesLayer) => set({ showCountriesLayer }),

    showStatesLayer: true,
    setShowStatesLayer: (showStatesLayer) => set({ showStatesLayer }),

    showLakesLayer: true,
    setShowLakesLayer: (showLakesLayer) => set({ showLakesLayer }),

    sliderIndex: 1,
    setSliderIndex: (sliderIndex) => set({ sliderIndex }),

    sliding: false,
    setSliding: (sliding) => set({ sliding }),

    showDesktopSettings: true,
    setShowDesktopSettings: (showDesktopSettings) => set({ showDesktopSettings }),

    showMobileSettings: false,
    setShowMobileSettings: (showMobileSettings) => set({ showMobileSettings }),

    showAbout: false,
    setShowAbout: (showAbout) => set({ showAbout }),

    showOverlays: false,
    setShowOverlays: (showOverlays) => set({ showOverlays }),

    defaultLabels: { temp: 'Monthly mean', precip: 'Monthly total' },
    defaultUnits: { temp: '(°C)', precip: '(mm)' },
  };
});
