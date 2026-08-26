import { useEffect } from 'react';
import { Box } from 'theme-ui';

import { useStore } from '../store/index';

export default function ChartContainer({ children }) {
  return (
    <Box
      as="div"
      id={'chart-container'}
      sx={{
        borderColor: 'primary',
        borderStyle: 'solid',
        borderWidth: '1px',
        backgroundColor: 'background',
        height: '17rem',
        width: '20rem',
        borderRadius: '0.5rem',
        zIndex: 10,
        position: 'absolute',
        right: '0.5rem',
        top: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowYd: 'hidden',
      }}
    >
      <Box
        as="div"
        sx={{
          flex: '1 1 auto',
          m: [1],
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
