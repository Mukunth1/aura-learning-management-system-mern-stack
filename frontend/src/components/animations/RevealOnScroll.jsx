import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'zoom'
  duration = 0.8,
}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    let initialProps = { opacity: 0 };
    if (direction === 'up') initialProps.y = 40;
    else if (direction === 'down') initialProps.y = -40;
    else if (direction === 'left') initialProps.x = 40;
    else if (direction === 'right') initialProps.x = -40;
    else if (direction === 'zoom') initialProps.scale = 0.92;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        initialProps,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, direction, duration]);

  return (
    <div ref={elRef} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
