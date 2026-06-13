import { useEffect, useMemo, useState } from 'react';

const CELEBRATION_KEY = 'sv_session_celebration_seen_v2';
const COLORS = ['#ec407a', '#ff94bd', '#facc15', '#38bdf8', '#a78bfa', '#34d399', '#ffffff'];

const hasSeenCelebration = () => {
  try {
    return window.sessionStorage.getItem(CELEBRATION_KEY) === 'true';
  } catch (error) {
    return false;
  }
};

const markCelebrationSeen = () => {
  try {
    window.sessionStorage.setItem(CELEBRATION_KEY, 'true');
  } catch (error) {
    // Ignore unavailable storage; the overlay remains non-blocking.
  }
};

const buildPieces = (count) =>
  Array.from({ length: count }, (_, index) => {
    const isLeft = index % 2 === 0;
    const distance = 34 + ((index * 17) % 54);
    const lift = -8 - ((index * 11) % 42);
    const drift = -16 + ((index * 19) % 38);

    return {
      id: index,
      side: isLeft ? 'left' : 'right',
      color: COLORS[index % COLORS.length],
      shape: index % 5 === 0 ? 'streamer' : index % 3 === 0 ? 'circle' : 'confetti',
      style: {
        '--tx': `${isLeft ? distance : -distance}vw`,
        '--ty': `${lift + drift}vh`,
        '--spin': `${isLeft ? 240 + index * 9 : -240 - index * 9}deg`,
        '--delay': `${(index % 12) * 35}ms`,
        '--duration': `${2200 + (index % 10) * 90}ms`,
        '--size': `${6 + (index % 5) * 2}px`,
        '--start-y': `${24 + ((index * 13) % 48)}vh`,
        '--color': COLORS[index % COLORS.length],
      },
    };
  });

export default function SessionCelebration() {
  const [isVisible, setIsVisible] = useState(false);
  const pieces = useMemo(() => buildPieces(110), []);

  useEffect(() => {
    if (hasSeenCelebration()) return undefined;

    markCelebrationSeen();
    setIsVisible(true);

    const hideTimer = window.setTimeout(() => setIsVisible(false), 3800);
    return () => window.clearTimeout(hideTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="session-celebration" aria-hidden="true">
      <div className="celebration-glow celebration-glow--left" />
      <div className="celebration-glow celebration-glow--right" />
      <div className="party-popper party-popper--left" />
      <div className="party-popper party-popper--right" />
      <div className="celebration-center-burst">
        <span>Surprise!</span>
      </div>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`celebration-piece celebration-piece--${piece.side} celebration-piece--${piece.shape}`}
          style={piece.style}
        />
      ))}
    </div>
  );
}
