import React, { useState, useEffect } from 'react';

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9997] w-[500px] h-[500px] rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, rgba(124,111,247,0.04) 0%, transparent 65%)`,
        transition: 'left 0.12s ease, top 0.12s ease',
      }}
    />
  );
};

export default CursorGlow;
