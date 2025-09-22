import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 40, className = '' }) => {
  return (
    <div className={`loading-container ${className}`}>
      <Loader2 
        size={size} 
        className="loading-spinner" 
        style={{
          color: 'white',
          animation: 'spin 1s linear infinite'
        }}
      />
    </div>
  );
};

export default LoadingSpinner;