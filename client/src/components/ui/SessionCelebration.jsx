import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const COLORS = ['#ec407a', '#ff94bd', '#facc15', '#38bdf8', '#a78bfa', '#34d399', '#ffffff'];

const buildPieces = (count) =>
  Array.from({ length: count }, (_, index) => {
    const isLeft = index % 2 === 0;
    const distance = 28 + ((index * 17) % 62);
    const lift = -44 - ((index * 11) % 44);
    const drift = -10 + ((index * 19) % 28);

    return {
      id: index,
      side: isLeft ? 'left' : 'right',
      color: COLORS[index % COLORS.length],
      shape: index % 4 === 0 ? 'streamer' : index % 3 === 0 ? 'circle' : 'confetti',
      style: {
        '--tx': `${isLeft ? distance : -distance}vw`,
        '--ty': `${lift + drift}vh`,
        '--spin': `${isLeft ? 240 + index * 9 : -240 - index * 9}deg`,
        '--delay': `${(index % 12) * 35}ms`,
        '--duration': `${2200 + (index % 10) * 90}ms`,
        '--size': `${6 + (index % 5) * 2}px`,
        '--start-y': `${70 + ((index * 13) % 22)}vh`,
        '--color': COLORS[index % COLORS.length],
      },
    };
  });

const BALLOONS = [
  { id: 1, side: 'left', color: '#ec407a', delay: '220ms', x: '18vw' },
  { id: 2, side: 'left', color: '#facc15', delay: '520ms', x: '31vw' },
  { id: 3, side: 'right', color: '#38bdf8', delay: '300ms', x: '20vw' },
  { id: 4, side: 'right', color: '#a78bfa', delay: '640ms', x: '34vw' },
];

export default function SessionCelebration() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const pieces = useMemo(() => buildPieces(130), []);
  const isLandingPage = pathname === '/';

  useEffect(() => {
    if (!isLandingPage) {
      setIsVisible(false);
      return undefined;
    }

    setIsVisible(true);

    const hideTimer = window.setTimeout(() => setIsVisible(false), 3800);
    return () => window.clearTimeout(hideTimer);
  }, [isLandingPage]);

  if (!isLandingPage || !isVisible) return null;

  return (
    <div className="session-celebration" aria-hidden="true">
      <div className="celebration-glow celebration-glow--left" />
      <div className="celebration-glow celebration-glow--right" />
      <div className="party-popper party-popper--left" />
      <div className="party-popper party-popper--right" />
      {BALLOONS.map((balloon) => (
        <span
          key={balloon.id}
          className={`birthday-balloon birthday-balloon--${balloon.side}`}
          style={{
            '--balloon-color': balloon.color,
            '--balloon-delay': balloon.delay,
            '--balloon-x': balloon.x,
          }}
        />
      ))}
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
