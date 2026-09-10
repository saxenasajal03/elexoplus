import React, { useState } from 'react';

export default function PulsingBackground() {
  const [balls] = useState(() => Array.from({ length: 40 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.floor(Math.random() * 8) + 3}px`,
    animationDelay: `${Math.random() * -5}s`,
    animationDuration: `${Math.random() * 4 + 3}s`
  })));

  return (
    <div className="fixed inset-0 bg-black z-[-1] overflow-hidden" aria-hidden="true">
      {balls.map((b, i) => (
        <div
          key={i}
          className="ball"
          style={{
            top: b.top, left: b.left, width: b.size, height: b.size,
            animationDelay: b.animationDelay, animationDuration: b.animationDuration
          }}
        />
      ))}
    </div>
  );
}
