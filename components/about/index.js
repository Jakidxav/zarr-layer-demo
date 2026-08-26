import { Box, Text } from 'theme-ui';
import { Reset } from '@carbonplan/icons';
import { Dimmer } from '@carbonplan/components';

import InfoDemo from './info-demo';
import { useStore } from '../store/index';

export const About = () => {
  const showAbout = useStore((state) => state.showAbout);

  const sx = {
    'about-container': {
      backgroundColor: 'background',
      transform: showAbout ? 'translateX(0px)' : 'translateX(-100%)',
      display: showAbout ? 'initial' : 'hidden',
    },
    'about-inner-container': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '44rem',
      marginX: 'auto',
      px: [4],
      pb: [4],
      fontSize: [2, 2, 2, 3],
    },
    'about-heading': {
      mt: [3],
      mb: [2],
      pr: [0, 5, 5, 6],
      fontSize: [4, 4, 4, 5],
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'h3',
    },
    'text-highlight': {
      bg: 'muted',
    },
  };

  return (
    <Box as="div" id="about-container" sx={sx['about-container']}>
      <Box id="about-inner-container" sx={sx['about-inner-container']}>
        <Box sx={sx['about-heading']}>
          <Text sx={{ textDecoration: 'underline' }}>How to use this site</Text>
        </Box>

        <Box>
          <Text>
            You will find an <Text sx={sx['text-highlight']}>Info</Text> icon next to each
            variable's name. There, you will find additional information about what the variable is
            showing, how the data layer was created, and links to any additional information if
            there is any. Clicking on the <Text sx={sx['text-highlight']}>Info</Text> icon reveals
            hidden dropdown text. You can try this with the icon to the right.
            <InfoDemo>This is hidden dropdown text.</InfoDemo>
          </Text>
        </Box>

        <Box sx={{ my: 2 }}>
          <Text>
            Clicking the <Text sx={{ bg: 'muted' }}>Sun</Text> icon{' '}
            <Dimmer
              sx={{
                color: 'primary',
                height: '1.25rem',
                verticalAlign: '-0.5rem',
                display: 'inline-block',
              }}
            />{' '}
            will change the website theme between light and dark modes.
          </Text>
        </Box>

        <Box sx={{ my: 2 }}>
          <Text>
            The <Text sx={sx['text-highlight']}>Reset</Text> icon resets the map extent to the
            original zoom and center. Test this on the map by panning and zooming, then clicking on
            the{' '}
            <Reset
              sx={{ strokeWidth: 1.5, width: '1rem', height: '1rem', verticalAlign: '-0.15rem' }}
            />{' '}
            icon.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
