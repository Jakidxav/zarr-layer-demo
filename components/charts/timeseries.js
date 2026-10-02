'use client';

import { useRef, useMemo } from 'react';
import { Box, Spinner } from 'theme-ui';
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
      return plotData?.['variable']?.[stat];
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
  const queryStatus = useStore((state) => state.queryStatus);
  const sliding = useStore((state) => state.sliding);

  // chart layout
  const width = 310;
  const height = 270;
  const paddingBottom = 35;
  const paddingTop = 10;
  const paddingLeft = 50;
  const paddingRight = 10;
  const extraPaddingX = 10;
  const extraPaddingY = 10;
  const xTickPadding = 10;
  const yTickPadding = 10;
  const paddingYLabel = 10;

  // x axis
  const xTicks = monthArray;
  const xDomain = [xTicks.at(0), xTicks.at(-1)];
  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([paddingLeft + xTickPadding, width - paddingRight - extraPaddingX]);

  // y axis
  const yScale = d3
    .scaleLinear()
    .domain([varMin, varMax])
    .range([height - paddingBottom - extraPaddingY - yTickPadding, paddingTop + yTickPadding]);

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

    return timeseriesArray;
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

        <g
          id={'x-axis'}
          transform={`translate(${paddingLeft}, ${height - paddingBottom - extraPaddingY})`}
        >
          {/* axis line */}
          <line
            key={`x-axis-line`}
            x1={0}
            y1={0}
            x2={width - paddingRight - paddingLeft}
            y2={0}
            stroke={'currentColor'}
            fill={'none'}
          />
        </g>

        <g id={'x-axis-label'}>
          <text
            key={`x-label`}
            x={(width + paddingLeft) / 2}
            y={height - 15}
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

        {xTicks.map((month, idx) => (
          <g key={`x-tick-${idx}`} className={'x-axis-tick'}>
            <line
              key={`x-tick-line-${idx}`}
              x1={xScale(month)}
              y1={height - paddingBottom - extraPaddingY}
              x2={xScale(month)}
              y2={height - paddingBottom - extraPaddingY / 2}
              stroke={'currentColor'}
              fill={'none'}
            />
            <text
              key={`x-tick-label-${idx}`}
              x={xScale(month)}
              y={height - paddingBottom + extraPaddingY / 2}
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

        <g id={'y-axis'} transform={`translate(${paddingLeft}, 0)`}>
          {/* axis line */}
          <line
            key={`y-axis-line`}
            x1={0}
            y1={paddingTop}
            x2={0}
            y2={height - paddingBottom - extraPaddingY}
            stroke={'currentColor'}
          />

          <g id={'y-axis-label'}>
            <text
              key={`y-label`}
              x={-20}
              y={height / 2}
              transform={`rotate(270, ${-35}, ${height / 2})`}
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

          {yTicks.map((value, idx) => (
            <g key={`y-tick-${idx}`}>
              <line
                key={`y-tick-line-${idx}`}
                x1={0}
                y1={yScale(value)}
                x2={-5}
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
        </g>

        {chartData && (
          <g key={'timeseries-data-container'} id="timeseries-data-container">
            <path
              key={'line-path'}
              id="line-path"
              d={lineGenerator(chartData)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        <g id="month-value-tracker">
          <line
            //add line tracking time slider date
            key={'month-vertical-line'}
            id={'month-vertical-line'}
            x1={xScale(sliderIndex)}
            x2={xScale(sliderIndex)}
            y1={paddingTop}
            y2={height - paddingBottom - extraPaddingY}
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

      {queryStatus === 'loading' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size={35} strokeWidth={3} />
        </Box>
      )}
    </Box>
  );
}
