import React from 'react';
import Head from 'next/head';
import { useThemeUI } from 'theme-ui';

const Meta = () => {
  const { theme, colorMode } = useThemeUI();

  const title = 'zarr-layer-demo';
  const description =
    'Exploring how input Zarr format affects web map render and query performance';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content={theme.colors.background} />
      <meta name="color-scheme" content={colorMode === 'light' ? 'light' : 'dark'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="format-detection" content="telephone=no" />
    </Head>
  );
};

export default Meta;
