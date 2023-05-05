import './globals.css';
import React from 'react';
import FaceComparison from './FaceComparison';

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaceComparison />
    </div>
  );
}
