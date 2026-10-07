import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CounterAnimation({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          setCount(obj.val);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  return (
    <span ref={containerRef} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
