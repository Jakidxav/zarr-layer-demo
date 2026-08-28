import { useEffect, useRef } from 'react';
import { Box, useColorMode } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

import { Header, Loading, Meta } from '../components/view/index';
import { DesktopSettings, MobileSettings } from '../components/settings/index';
import { Colorbar } from '../components/colorbar/index';
import { Map } from '../components/map/index';
import { About } from '../components/about/index';
// import { ChartContainer, DotChart, DownloadChartButton } from '../components/charts/index';
import { useStore } from '../components/store/index';

export default function Index() {
  const isWide = useBreakpointIndex() > 0;
  const [colorMode, setColorMode] = useColorMode();
  const container = useRef(null);

  // settings
  const showDesktopSettings = useStore((store) => store.showDesktopSettings);

  // charts
  const showCharts = useStore((store) => store.showCharts);
  const setShowCharts = useStore((store) => store.setShowCharts);
  const plotData = useStore((store) => store.plotData);

  useEffect(() => {
    setColorMode('light');
  }, []);

  useEffect(() => {
    if (!isWide && showCharts) {
      setShowCharts(false);
    }
  }, [isWide]);

  return (
    <>
      <Meta />

      <Box as="div" id="container-grid">
        <Header />

        <Box as="div" id="main-container" ref={container}>
          <Loading />

          <Map />

          {isWide && showDesktopSettings && <DesktopSettings />}

          {/* {isWide && showCharts && (
            <>
              <ChartContainer>
                <DotChart />
              </ChartContainer>

              {plotData && Object.keys(plotData).length > 0 && <DownloadChartButton />}
            </>
          )} */}

          {!isWide && <MobileSettings />}

          {!isWide && <Colorbar />}

          <About />
        </Box>
      </Box>
    </>
  );
}
