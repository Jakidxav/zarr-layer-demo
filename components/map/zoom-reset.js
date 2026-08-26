import { useCallback, useRef } from 'react';
import { keyframes } from '@emotion/react';
import { IconButton } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { Reset } from '@carbonplan/icons';

import { useMap } from './map-provider';
import { useMapView } from './use-map-view';
import { useStore } from '../store/index';

const ZoomReset = () => {
  const isWide = useBreakpointIndex() > 0;
  const { map } = useMap();
  const resetButton = useRef(null);

  const initialZoom = useStore((state) => state.initialZoom);
  const initialCenter = useStore((state) => state.initialCenter);
  const { zoom, center } = useMapView();

  const spin = keyframes({
    from: {
      transform: 'rotate(0turn)',
    },
    to: {
      transform: 'rotate(1turn)',
    },
  });

  const handleResetClick = useCallback((event) => {
    // reset map
    resetButton.current = event.target;
    resetButton.current.classList.add('spin');

    if (zoom != initialZoom && center != initialCenter) {
      console.log(zoom);
      console.log(center);
      console.log();

      map.flyTo({
        center: initialCenter,
        zoom: initialZoom,
      });

      console.log(zoom);
      console.log(center);
      console.log();
    }
  });

  const handleAnimationEnd = useCallback(() => {
    resetButton.current.classList.remove('spin');
  });

  const atInitialConditions =
    zoom === initialZoom && center[0] === initialCenter[0] && center[1] === initialCenter[1];

  return (
    <IconButton
      aria-label="Reset map extent"
      onClick={handleResetClick}
      onAnimationEnd={handleAnimationEnd}
      disabled={atInitialConditions}
      sx={{
        display: isWide ? 'initial' : 'none',
        stroke: 'primary',
        color: atInitialConditions ? 'muted' : 'primary',
        cursor: 'pointer',
        position: 'absolute',
        right: '0.5rem',
        bottom: '0.5rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: atInitialConditions ? 'muted' : 'primary',
        bg: 'background',
        '.spin': {
          animation: `${spin.toString()} 1s`,
        },
      }}
    >
      <Reset sx={{ strokeWidth: 1.75, width: 20, height: 20 }} />
    </IconButton>
  );
};

export default ZoomReset;
