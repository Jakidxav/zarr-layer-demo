import { Box } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

export default function ColorbarContainer({ children }) {
  const isWide = useBreakpointIndex() > 0;

  const sx = {
    'colorbar-container': {
      height: '5rem',
      width: isWide ? '18.75rem' : '100%',
      zIndex: 10,
      position: 'absolute',
      left: isWide ? '0.5rem' : 0,
      top: isWide ? null : 0,
      bottom: isWide ? '0.5rem' : null,
      borderWidth: isWide ? '1px' : 0,
      borderBottomWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'primary',
      borderRadius: isWide ? '0.5rem' : 0,
      bg: 'background',
      alignContent: 'center',
    },
  };

  return (
    <Box id="colorbar-container" sx={sx['colorbar-container']}>
      {children}
    </Box>
  );
}
