import { Colorbar as ColorbarComponent } from '@carbonplan/components';
import { useColormap, useThemedColormap } from '@carbonplan/colormaps';
import { useBreakpointIndex } from '@theme-ui/match-media';

import { useStore } from '../store/index';

export default function Colorbar() {
  const isWide = useBreakpointIndex() > 0;

  const variable = useStore((state) => state.variable);
  const colormap = useStore((state) => state.colormap)();
  const clim = useStore((state) => state.clim)();
  const defaultLabels = useStore((state) => state.defaultLabels);
  const defaultUnits = useStore((state) => state.defaultUnits);

  const sx = {
    colorbar: {
      width: '100%',
      display: 'inline-block',
      px: isWide ? 0 : 2,
      my: 'auto',
    },
  };

  return (
    <ColorbarComponent
      sx={sx['colorbar']}
      sxClim={{ fontSize: [1, 1, 1, 2], pt: [1] }}
      width="100%"
      colormap={colormap}
      label={defaultLabels[variable]}
      units={defaultUnits[variable]}
      clim={[clim[0].toFixed(2), clim[1].toFixed(2)]}
      horizontal
      bottom
      discrete
    />
  );
}
