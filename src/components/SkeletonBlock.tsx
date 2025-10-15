import React from 'react';

interface Props {
  height?: string;
  className?: string;
}

const SkeletonBlock: React.FC<Props> = ({ height = 'h-24', className = '' }) => {
  return (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${height} ${className}`}></div>
  );
};

export default SkeletonBlock;
