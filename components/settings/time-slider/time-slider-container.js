import { Box } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

export default function TimeSliderContainer({ children }) {
  const isWide = useBreakpointIndex() > 0;

  const sx = {
    'time-slider-container': {
      position: 'absolute',
      height: '7rem',
      width: '100%',
      zIndex: 10,
      left: 0,
      bottom: '4rem',
      px: 4,
      borderWidth: 0,
      borderTopWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'primary',
      borderRadius: 0,
      bg: 'background',
      alignContent: 'center',
    },
  };

  return (
    <Box id="time-slider-container-mobile" sx={sx['time-slider-container']}>
      {children}
    </Box>
  );
}
