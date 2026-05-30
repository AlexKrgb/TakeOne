import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    const isMobile =
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isMobile) return;

    const applyPosition = () => {
      rafRef.current = undefined;
      const cursor = cursorRef.current;
      const dot = dotRef.current;
      if (!cursor || !dot) return;

      const size = hoveringRef.current ? 64 : 24;
      const offset = size / 2;
      cursor.style.transform = `translate3d(${positionRef.current.x - offset}px, ${positionRef.current.y - offset}px, 0)`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
    };

    const scheduleUpdate = () => {
      if (rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(applyPosition);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      scheduleUpdate();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.onclick !== null ||
        target.closest('button') !== null ||
        target.closest('a') !== null;

      if (hoveringRef.current !== isClickable) {
        hoveringRef.current = isClickable;
        scheduleUpdate();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 pointer-events-none mix-blend-difference"
      style={{ zIndex: 2147483647, willChange: 'transform' }}
    >
      <div
        ref={dotRef}
        className="bg-[#ED2800] rounded-full"
        style={{ width: 24, height: 24, willChange: 'width, height' }}
      />
    </div>
  );
}
