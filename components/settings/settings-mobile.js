import { Box } from 'theme-ui';
import { alpha } from '@theme-ui/color';

import Settings from './settings';
import { useStore } from '../store/index';

export default function MobileSettingsContainer() {
  const showMobileSettings = useStore((state) => state.showMobileSettings);
  const setShowMobileSettings = useStore((state) => state.setShowMobileSettings);

  return (
    <>
      <Box
        as="div"
        id="settings-options-mobile"
        sx={{
          borderColor: 'primary',
          borderStyle: 'solid',
          borderWidth: '0px',
          borderTopWidth: '1px',
          backgroundColor: 'background',
          '& :first-child': {
            color: 'primary',
            borderStyle: 'solid',
            borderWidth: 0,
            borderRightWidth: '1px',
          },
        }}
      >
        <Box
          as="div"
          role="button"
          onClick={() => {
            setShowMobileSettings(false);
          }}
          sx={{ bg: !showMobileSettings ? alpha('muted', 0.5) : 'background' }}
        >
          Map
        </Box>

        <Box
          as="div"
          role="button"
          onClick={() => {
            setShowMobileSettings(true);
          }}
          sx={{ bg: showMobileSettings ? alpha('muted', 0.5) : 'background' }}
        >
          Settings
        </Box>
      </Box>

      {showMobileSettings && (
        <Box
          as="div"
          id="settings-container-mobile"
          sx={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'primary',
            bg: 'background',
          }}
        >
          <Settings />
        </Box>
      )}
    </>
  );
}
