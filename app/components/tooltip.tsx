import React from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '4px',
        pointerEvents: 'none',
        visibility: visible ? 'visible' : 'hidden',
        transform: 'translate(-50%, -100%)',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
