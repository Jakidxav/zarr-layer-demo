# zarr-layer-demo

This repository is being used to explore how different strategies for formatting and saving raster data as `Zarr` stores affect rendering and query performance on web maps.

## Data processing

The input data for this site comes from [WorldClim](https://worldclim.org/data/worldclim21.html). I've created `Zarr` pyramids using [`ndpyramid`](https://github.com/carbonplan/ndpyramid/tree/main) and 'flat' `Zarr` stores using [`topozarr`](https://github.com/carbonplan/topozarr/tree/main). All processing steps are included as `Jupyter Notebooks` in `data_processing/`.

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

## Viewing the data

The data is displayed on a `React`, `Next JS` app deployed on `GitHub` using the [`zarr-layer`](https://github.com/carbonplan/zarr-layer/tree/main) package. You can run the web app from the main directory with:

```
npm run dev
```

## Contributing

If you are considering making suggested changes to the codebase, please initialize the code formatting hooks included in this repository with `prettier` like so:

```
pre-commit install
```

`pre-commit` hooks generally only run on files that have been staged for `git` commits. To make sure you lint and format all files before suggesting changes, you should run:

```
pre-commit run --all-files
```

## Acknowledgements

This site's interface and functionality rely heavily on code developed by <a href='https://carbonplan.org/' target='_blank'>CarbonPlan</a>. Specifically, we used the <a href='https://github.com/carbonplan/zarr-layer' target='_blank'>`zarr-layer`</a>, and <a href='https://github.com/carbonplan/components' target='_blank'>`components`</a> libraries. You can read more about CarbonPlan's research and software development work <a href="https://carbonplan.org/research" target="_blank">here</a>.

This repository contains code from the CarbonPlan `components` package. Copyright (c) 2020 CarbonPlan, distributed under a MIT License.

This repository contains code from the CarbonPlan `zarr-layer` package. Copyright (c) 2025 CarbonPlan, distributed under a MIT License.
