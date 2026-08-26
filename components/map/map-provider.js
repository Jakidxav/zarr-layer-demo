import { createContext, useContext, useState } from 'react';

const MapContext = createContext(null);

const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);

  return <MapContext.Provider value={{ map, setMap }}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider component');
  }
  return context; // { map }
};

export default MapProvider;
