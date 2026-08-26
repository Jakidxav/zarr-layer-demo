import { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { Box, IconButton, Text } from 'theme-ui';
import { Info } from '@carbonplan/icons';

const InfoDemo = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = (e) => {
    setExpanded(!expanded);
  };

  return (
    <>
      <IconButton
        onClick={toggle}
        aria-label="Toggle more info"
        role="checkbox"
        sx={{
          height: '1rem',
          display: 'inline-block',
          cursor: 'pointer',
          color: 'primary',
          verticalAlign: '-0.5rem',
        }}
      >
        <Info
          sx={{
            strokeWidth: '1.75',
            transition: 'stroke 0.15s',
          }}
        />
      </IconButton>
      <Box sx={{ pt: [2], mb: [1] }}>
        <AnimateHeight duration={100} height={expanded ? 'auto' : 0} easing={'linear'}>
          <Text sx={{ color: 'secondary' }}>{children}</Text>
        </AnimateHeight>
      </Box>
    </>
  );
};

export default InfoDemo;
