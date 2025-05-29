'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';

interface MapWrapperProps {
  center: [number, number];
  zoom: number;
  markers: Array<{
    position: [number, number];
    title: string;
  }>;
}

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div
      className="h-[400px] w-full bg-gray-100 rounded-lg animate-pulse"
      aria-busy="true"
      aria-label="Loading map"
    />
  ),
});

const MapWrapper: FC<MapWrapperProps> = (props) => {
  return (
    <div className="w-full h-[400px] relative">
      <MapComponent {...props} />
    </div>
  );
};

export default MapWrapper; 