import { Box, Flex } from 'theme-ui';
import { keyframes } from '@emotion/react';

const Loading = () => {
  const fade = keyframes({
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        fontFamily: 'mono',
        backgroundColor: 'background',
        animationDuration: '0.15s',
        animationDelay: '1s',
        animationName: fade.toString(),
        animationFillMode: 'forwards',
        position: 'absolute',
        zIndex: 20,
        top: 0,
        maxWidth: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          textTransform: 'uppercase',
          height: '100%',
          width: '100%',
          color: 'secondary',
          fontSize: [2, 2, 2, 3],
        }}
      >
        loading...
      </Flex>
    </Box>
  );
};

export default Loading;
