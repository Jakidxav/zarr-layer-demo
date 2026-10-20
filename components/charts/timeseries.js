'use client';

import { useRef, useMemo } from 'react';
import { Box } from 'theme-ui';
import { useThemeUI } from 'theme-ui';

import * as d3 from 'd3';

import { useStore } from '../store/index';

// Returns the object that maps month --> [value],
// or undefined depending on the incoming raster format.
function getFormattedTimeseries(plotData, variable, band, stat, rasterFormat) {
  switch (rasterFormat) {
    case 'arrays':
      return plotData?.[band];
    case 'bands':
      if (variable === 'precip') {
        return plotData?.['variable'];
      } else {
        return plotData?.['variable']?.[band];
      }
    case 'both':
      return plotData?.[variable]?.[stat];
    default:
      return undefined;
  }
}

export default function TimeseriesChart() {
  const containerRef = useRef(null);
  const { theme } = useThemeUI();

  const rasterFormat = useStore((state) => state.rasterFormat);
  const variable = useStore((state) => state.variable);
  const band = useStore((state) => state.band)();
  const stat = useStore((state) => state.stat);
  const monthArray = useStore((state) => state.monthArray);
  const sliderIndex = useStore((state) => state.sliderIndex);
  const clim = useStore((state) => state.clim)();
  const [varMin, varMax] = clim;

  const plotData = useStore((state) => state.plotData);
  const sliding = useStore((state) => state.sliding);

  // chart layout
  const width = 310;
  const height = 270;
  const inset = 10;
  const tickSize = 5;

  const marginLeft = 55;
  const marginRight = 20;
  const marginTop = 15;
  const marginBottom = 55;

  const x0 = marginLeft + inset;
  const x1 = width - marginRight - inset;
  const y0 = marginTop + inset;
  const y1 = height - marginBottom - inset;

  // x axis
  const xTicks = monthArray;
  const xDomain = [xTicks.at(0), xTicks.at(-1)];
  const xScale = d3.scaleLinear().domain(xDomain).range([x0, x1]);

  // y axis
  const yScale = d3.scaleLinear().domain([varMin, varMax]).range([y1, y0]);

  const yTicks = yScale.ticks(7);
  const yAxisLabel = variable === 'temp' ? 'Temperature (°C)' : 'Precipitation (mm)';

  const timeseries = useMemo(
    () => getFormattedTimeseries(plotData, variable, band, stat, rasterFormat),
    [plotData, variable, band, stat, rasterFormat]
  );
  const hasData = Boolean(timeseries);

  const currentMonthlyValue = timeseries?.[sliderIndex]?.[0] ?? null;

  const lineGenerator = d3
    .line()
    .defined((d) => !isNaN(d[1])) // skip missing/gap points
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  // function that (re)draws the chart whenever the container size changes.
  const chartData = useMemo(() => {
    if (!hasData) return null;

    // convert data from {month: [value]} to {[month, value]} format,
    // which many d3 methods expect.
    let timeseriesArray = monthArray.filter((d) => timeseries[d]).map((d) => [d, timeseries[d][0]]);

    return (
      <path
        key={'line-path'}
        id="line-path"
        d={lineGenerator(timeseriesArray)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }, [hasData, timeseries]);

  return (
    <Box
      id={'chart'}
      ref={containerRef}
      preserveAspectRatio="xMidYMid meet"
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* this is the container svg */}
      <svg id={'timeseries-chart'} width={'100%'} height={'100%'}>
        {/* ensures that the svg or png has a uniform background */}
        <rect width={'100%'} height={'100%'} fill={theme.rawColors.background} />

        <g id={'x-axis'} transform={`translate(0, ${y1 + inset})`}>
          {/* axis line */}
          <line
            key={`x-axis-line`}
            x1={marginLeft}
            y1={0}
            x2={width - marginRight}
            y2={0}
            stroke={'currentColor'}
            fill={'none'}
          />

          {/* x-axis tick and labels */}
          {xTicks.map((month, idx) => (
            <g key={`x-tick-${idx}`} className={'x-axis-tick'}>
              <line
                key={`x-tick-line-${idx}`}
                x1={xScale(month)}
                y1={0}
                x2={xScale(month)}
                y2={tickSize}
                stroke={'currentColor'}
                fill={'none'}
              />
              <text
                key={`x-tick-label-${idx}`}
                x={xScale(month)}
                y={tickSize + 12}
                textAnchor={'middle'}
                fontSize={'0.625rem'}
                fontFamily={"'Relative Book Pro', Roboto, system-ui, sans-serif"}
                stroke={'none'}
                fill={'currentColor'}
              >
                {month}
              </text>
            </g>
          ))}

          <g id={'x-axis-label'}>
            <text
              key={`x-label`}
              x={(x0 + x1) / 2}
              y={tickSize + 30}
              textAnchor={'middle'}
              fontSize={'0.75rem'}
              fontFamily={"'Relative Book Pro', Roboto, system-ui, sans-serif"}
              fontWeight={'bold'}
              stroke={'none'}
              fill={'currentColor'}
            >
              {'Month'}
            </text>
          </g>
        </g>

        <g id={'y-axis'} transform={`translate(${marginLeft}, 0)`}>
          {/* axis line */}
          <line
            key={`y-axis-line`}
            x1={0}
            y1={y0 - inset}
            x2={0}
            y2={y1 + inset}
            stroke={'currentColor'}
          />

          {/* y-axis ticks and labels */}
          {yTicks.map((value, idx) => (
            <g key={`y-tick-${idx}`}>
              <line
                key={`y-tick-line-${idx}`}
                x1={0}
                y1={yScale(value)}
                x2={-tickSize}
                y2={yScale(value)}
                stroke={'currentColor'}
                fill={'none'}
              />
              <text
                key={`y-tick-label-${idx}`}
                x={-15}
                y={yScale(value)}
                dy={'0.05em'}
                textAnchor={'middle'}
                dominantBaseline={'middle'}
                fontSize={'0.625rem'}
                fontFamily={"'Relative Book Pro', Roboto, system-ui, sans-serif"}
                stroke={'none'}
                fill={'currentColor'}
              >
                {value}
              </text>
            </g>
          ))}

          <g id={'y-axis-label'}>
            <text
              key={`y-label`}
              x={-tickSize - 32}
              y={(y0 + y1) / 2}
              transform={`rotate(-90, ${-tickSize - 32}, ${(y0 + y1) / 2})`}
              textAnchor={'middle'}
              fontSize={'0.75rem'}
              fontFamily={"'Relative Book Pro', Roboto, system-ui, sans-serif"}
              fontWeight={'bold'}
              stroke={'none'}
              fill={'currentColor'}
            >
              {yAxisLabel}
            </text>
          </g>
        </g>

        {chartData}

        <g id="month-value-tracker">
          <line
            //add line tracking time slider date
            key={'month-vertical-line'}
            id={'month-vertical-line'}
            x1={xScale(sliderIndex)}
            x2={xScale(sliderIndex)}
            y1={y0 - inset}
            y2={y1 + inset}
            stroke={'#808080'}
            strokeWidth={1.5}
            strokeDasharray={'4'}
            fill={'none'}
            opacity={sliding ? 1 : 0}
            style={{ transition: 'opacity .15s' }}
          />

          {plotData && hasData && (
            <circle
              // add circle tracking value at time slider date
              key={`month-value-circle`}
              id={`month-value-circle`}
              cx={xScale(sliderIndex)}
              cy={yScale(currentMonthlyValue)}
              r={4}
              stroke={'currentColor'}
              fill={'currentColor'}
              strokeWidth={0.5}
              opacity={sliding ? 1 : 0}
              style={{ transition: 'opacity .15s' }}
            />
          )}
        </g>
      </svg>
    </Box>
  );
}
