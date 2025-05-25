import React, { createContext, useState } from 'react';

export const GPSContext = createContext();

export const GPSProvider = ({ children }) => {
  const [gpsData, setGpsData] = useState({ latitude: null, longitude: null, accuracy: null });

  return (
    <GPSContext.Provider value={{ gpsData, setGpsData }}>
      {children}
    </GPSContext.Provider>
  );
};
