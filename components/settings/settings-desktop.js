import { Box } from 'theme-ui';
import Settings from './settings';

export default function DesktopSettingsContainer() {
  return (
    <Box
      as="div"
      id="settings-container-desktop"
      sx={{
        outlineColor: 'primary',
        outlineStyle: 'solid',
        outlineWidth: '1px',
        backgroundColor: 'background',
      }}
    >
      <Settings />
    </Box>
  );
}
