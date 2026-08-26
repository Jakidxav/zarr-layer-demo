import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import { useMap } from './map-provider';
import { useStore } from '../store/index';

const Router = () => {
  const { map } = useMap();
  const router = useRouter();
  const pathname = usePathname();

  const [mapReady, setMapReady] = useState(false);
  const zoom = useStore((state) => state.zoom);
  const setZoom = useStore((state) => state.setZoom);
  const bounds = useStore((state) => state.bounds);
  const center = useStore((state) => state.center);
  const setCenter = useStore((state) => state.setCenter);
  const variableArray = useStore((state) => state.variableArray);
  const variable = useStore((state) => state.variable);
  const setVariable = useStore((state) => state.setVariable);
  const setVariableIdx = useStore((state) => state.setVariableIdx);
  // const confidence = useStore((state) => state.confidence);
  // const setConfidence = useStore((state) => state.setConfidence);
  // const setConfidenceIdx = useStore((state) => state.setConfidenceIdx);

  // const verifySearchParams = useCallback((url) => {
  //   // check to see if there are other search params that shouldn't be there
  //   url.searchParams.forEach(function (value, key) {
  //     if (!['layer'].includes(key)) {
  //       url.searchParams.delete(key);
  //     }
  //   });
  // });

  const getInitialLayer = useCallback((url) => {
    let initialLayer;
    let tempLayer = url.searchParams.get('layer');

    if (tempLayer != null && typeof tempLayer == 'string' && variableArray.includes(tempLayer)) {
      initialLayer = tempLayer;
    } else {
      initialLayer = 'percent';
    }

    url.searchParams.set('layer', initialLayer);
    return initialLayer;
  });

  const getInitialZoom = useCallback((url) => {
    let initialZoom;
    let tempZoom = url.searchParams.get('zoom');

    if (tempZoom != null && typeof parseFloat(tempZoom) == 'number' && parseFloat(tempZoom) > 0.0) {
      initialZoom = tempZoom;
    } else {
      initialZoom = 3;
    }

    url.searchParams.set('zoom', initialZoom);
    return initialZoom;
  });

  const getInitialCenter = useCallback((url) => {
    let initialCenter;

    // this makes sure that the center search param is in array format, so we don't need to check the type
    let tempCenter = url.searchParams.get('center');
    if (tempCenter == null) {
      url.searchParams.set('center', '28.5,-1');
      return [28.5, -1.0];
    }

    tempCenter = tempCenter.split(',').map((d) => parseFloat(d));

    if (
      tempCenter.length == 2 &&
      typeof tempCenter[0] == 'number' &&
      !Number.isNaN(tempCenter[0]) &&
      typeof tempCenter[1] == 'number' &&
      !Number.isNaN(tempCenter[1])
    ) {
      // check to see if center is within east / west and north / south bounds
      if (
        tempCenter[0] > bounds[0] &&
        tempCenter[0] < bounds[2] &&
        tempCenter[1] > bounds[1] &&
        tempCenter[1] < bounds[3]
      ) {
        initialCenter = tempCenter.toString();
      } else {
        initialCenter = '28.5,-1';
      }
    } else {
      initialCenter = '28.5,-1';
    }

    url.searchParams.set('center', initialCenter);
    return initialCenter.split(',').map((d) => parseFloat(d));
  });

  useEffect(() => {
    const handleLoad = () => {
      setMapReady(true);
    };

    // check if page is already fully loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      // page is still loading, attach listener
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    if (!map || !mapReady) return;

    const url = new URL(window.location.href);
    // verifySearchParams(url);
    let savedVariable = getInitialLayer(url);
    let savedZoom = getInitialZoom(url);
    let savedCenter = getInitialCenter(url);

    if (savedCenter[0] == 28.5 && savedCenter[1] == -1) {
      savedZoom = 3;
      url.searchParams.set('zoom', 3);
    }

    setVariable(savedVariable);
    setVariableIdx(variableArray.indexOf(savedVariable));
    setZoom(savedZoom);
    setCenter(savedCenter);

    map.easeTo({
      center: savedCenter,
      zoom: parseFloat(savedZoom),
      duration: 0,
    });

    router.replace(
      `${pathname}?layer=${url.searchParams.get('layer')}&zoom=${url.searchParams.get(
        'zoom'
      )}&center=${url.searchParams.get('center')}`
    );

    // prevent back button
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
    window.history.pushState(null, null, url);
    window.onpopstate = () => window.history.go(1);
  }, [map, mapReady]);

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const newZoom = parseFloat(map.getZoom().toFixed(2));
      const newCenter = [
        parseFloat(map.getCenter().lng.toFixed(2)),
        parseFloat(map.getCenter().lat.toFixed(2)),
      ];

      setZoom(newZoom);
      setCenter(newCenter);

      if (router.isReady) {
        const url = new URL(window.location.href);
        url.searchParams.set('zoom', newZoom);
        url.searchParams.set('center', newCenter);
        router.replace(
          `${pathname}?layer=${url.searchParams.get('layer')}&zoom=${url.searchParams.get(
            'zoom'
          )}&center=${url.searchParams.get('center')}`
        );
      }
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, router.isReady, pathname]);

  useEffect(() => {
    if (router.isReady) {
      const url = new URL(window.location.href);
      url.searchParams.set('layer', variable);

      router.replace(
        `${pathname}?layer=${url.searchParams.get('layer')}&zoom=${url.searchParams.get(
          'zoom'
        )}&center=${url.searchParams.get('center')}`
      );
    }
  }, [variable]);

  return null;
};

export default Router;
