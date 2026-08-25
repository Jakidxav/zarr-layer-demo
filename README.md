# zarr-layer-demo

This repository is being used to explore how different strategies for formatting and saving raster data as `Zarr` stores affect rendering and query performance on web maps.

## Coding environment
This repository contains both `Python` and `JavaScript` code. That means I assume you have some sort of `Python` package manager installed, either `conda` or `pip`, as well as `npm` for the `JavaScript` dependencies.

To install the `Python` dependencies using `conda`, please run:
```
conda env create -f environment.yml
conda activate zarr-demo
```

Or, if you are using `pip`:
```
pip install -r requirements.txt
```

To install the `JavaScript` packages needed to run the web map, you can run:
```
npm install
```

## Data processing
The input data for this site comes from [WorldClim](https://worldclim.org/data/worldclim21.html). I've created `Zarr` pyramids using [`ndpyramid`](https://github.com/carbonplan/ndpyramid/tree/main) and 'flat' `Zarr` stores using [`topozarr`](https://github.com/carbonplan/topozarr/tree/main). All processing steps are included as `Jupyter Notebooks` in `data_processing/`.

## Rendering data
The data is displayed on a `React`, `Next JS` app deployed on `GitHub` using the [`zarr-layer`](https://github.com/carbonplan/zarr-layer/tree/main) package. You can run the web app from the main directory with:
```
npm run dev
```
