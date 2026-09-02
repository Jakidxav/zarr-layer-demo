import { useCallback, useEffect, useState } from 'react';
import { Box, Slider } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

import { useStore } from '../../store/index';

export default function TimeSlider() {
  const isWide = useBreakpointIndex() > 0;

  const packageName = useStore((state) => state.packageName);
  const monthArray = useStore((state) => state.monthArray);
  const minMonth = monthArray.at(0);
  const maxMonth = monthArray.at(-1);
  const month = useStore((state) => state.month);
  const setMonth = useStore((state) => state.setMonth);
  const sliding = useStore((state) => state.sliding);
  const setSliding = useStore((state) => state.setSliding);
  const [sliderIndex, setSliderIndex] = useState(month);

  useEffect(() => {
    if (packageName === 'topozarr' && !sliding) {
      setMonth(Number(sliderIndex));
    } else if (packageName === 'ndpyramid') {
      setMonth(Number(sliderIndex));
    }
    if (!sliding) setMonth(Number(sliderIndex));
  }, [sliderIndex, sliding, packageName]);

  const sx = {
    'slider-title': {
      mt: isWide ? 4 : 3,
      fontSize: isWide ? 2 : 1,
      letterSpacing: 'smallcaps',
      textTransform: 'uppercase',
      mb: 2,
    },
    'time-slider': {
      width: '100%',
      mt: 3,
      mb: 3,
    },
    'slider-labels-container': {
      textAlign: 'center',
      pb: 0,
      mb: isWide ? 3 : 3,
    },
  };

  return (
    <Box>
      <Box id="slider-title" sx={sx['slider-title']}>
        Month
      </Box>

      <Slider
        key={'time-slider'}
        id={'time-slider'}
        sx={sx['time-slider']}
        value={sliderIndex}
        onChange={(e) => setSliderIndex(e.target.value)}
        onMouseDown={() => setSliding(true)}
        onMouseUp={() => setSliding(false)}
        onPointerUp={() => setSliding(false)}
        min={1}
        max={12}
        step={1}
      />

      <Box id="slider-labels-container" sx={sx['slider-labels-container']}>
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
          {sliderIndex}
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
  );
}
