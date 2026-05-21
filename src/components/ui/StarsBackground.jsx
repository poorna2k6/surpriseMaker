import { useEffect, useState } from 'react';

/**
 * Animated starfield background component.
 *
 * Creates ~80 CSS-animated stars at random positions, each with a random
 * size, opacity, and twinkle-animation delay. Fixed-position, z-index 0,
 * covers the entire viewport. Pointer events are disabled so it never
 * blocks interaction.
 */

// Generate a stable array of star descriptors on first render
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,          // % from left
    y: Math.random() * 100,          // % from top
    size: Math.random() * 2 + 1,     // 1 – 3 px
    opacity: Math.random() * 0.6 + 0.2, // 0.2 – 0.8
    delay: Math.random() * 4,        // 0 – 4 s animation delay
    duration: Math.random() * 2 + 1.5,  // 1.5 – 3.5 s twinkle cycle
  }));
}

export function StarsBackground({ count = 80 }) {
  const [stars] = useState(() => generateStars(count));

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            backgroundColor: 'rgb(216 180 254)', // purple-200
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default StarsBackground;
