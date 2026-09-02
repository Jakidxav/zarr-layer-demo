import { useEffect } from 'react';
import { Box, Button, IconButton, Text } from 'theme-ui';
import { alpha } from '@theme-ui/color';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { QuestionCircle, X } from '@carbonplan/icons';

import { Dimmer } from '@carbonplan/components';
import { Select } from 'theme-ui';

import { ChartIcon } from '../icons/index';
import { useStore } from '../store/index';

export default function Header() {
  const isWide = useBreakpointIndex() > 0;

  const showAbout = useStore((state) => state.showAbout);
  const setShowAbout = useStore((state) => state.setShowAbout);
  const showDesktopSettings = useStore((state) => state.showDesktopSettings);
  const setShowDesktopSettings = useStore((state) => state.setShowDesktopSettings);
  const showCharts = useStore((state) => state.showCharts);
  const setShowCharts = useStore((state) => state.setShowCharts);
  const setPlotData = useStore((state) => state.setPlotData);

  useEffect(() => {
    if (!showCharts) {
      setPlotData({});
    }
  }, [showCharts]);

  return (
    <Box as="div" id="header" sx={{ position: 'relative', bg: alpha('muted', 0.5) }}>
      <Box
        as="div"
        id="site-name-container"
        sx={{
          display: 'flex',
          height: '100%',
          justifyContent: isWide ? 'space-around' : 'flex-start',
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        <Text id="site-name-text">zarr-layer-demo</Text>

        {isWide && (
          <Button
            sx={{
              width: '8.75rem',
              height: ['2rem'],
              lineHeight: '100%',
              color: 'secondary',
              bg: 'background',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'secondary',
              borderRadius: '5px',
              fontSize: [2],
              fontFamily: 'body',
              letterSpacing: 'body',
              textAlign: 'center',
              '&:hover': {
                color: 'primary',
                borderColor: 'primary',
              },
              '&:active': {
                color: 'white',
                bg: 'primary',
              },
            }}
            onClick={() => setShowDesktopSettings(!showDesktopSettings)}
          >
            <Text>{showDesktopSettings ? 'Hide settings' : 'Show settings'}</Text>
          </Button>
        )}
      </Box>

      <Box
        as="div"
        id="header-settings-container"
        sx={{
          '#charts-toggle:hover ~ #charts-hover-error': {
            visibility: isWide ? 'visible' : 'hidden',
          },
        }}
      >
        {/* <IconButton
          key="charts"
          id={'charts-toggle'}
          aria-label="Show or hide charts"
          onClick={() => {
            setShowCharts(!showCharts);
          }}
          sx={{
            stroke: 'primary',
            display: isWide ? 'initial' : 'none',
            outlineWidth: 'none',
            '&:focus': {
              outline: 'none',
            },
            '&:hover, &:focus-visible': {
              outlineWidth: '1px',
              outlineStyle: 'solid',
              outlineColor: 'primary',
            },
          }}
        >
          {isWide && !showCharts && <ChartIcon />}
          {showCharts && <X />}
        </IconButton> */}

        <Dimmer
          sx={{ width: '2rem', height: '2rem', mt: 1 }}
          aria-label="Change theme to light or dark"
        />

        <IconButton
          key="info"
          id={'about-button'}
          aria-label="Read more about how to use the site"
          onClick={() => {
            setShowAbout(!showAbout);
          }}
          sx={{ stroke: 'primary', cursor: 'pointer' }}
        >
          {!showAbout && <QuestionCircle sx={{ flexShrink: 0 }} />}
          {showAbout && <X />}
        </IconButton>
      </Box>
    </Box>
  );
}
