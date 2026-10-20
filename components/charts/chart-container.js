import { Box, Spinner } from 'theme-ui';

import { useStore } from '../store/index';

export default function ChartContainer({ children }) {
  const queryStatus = useStore((state) => state.queryStatus);

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
    </Box>
  );
}
