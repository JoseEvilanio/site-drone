
import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  width?: "fit-content" | "100%";
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, width = "100%" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'reveal-visible' : ''}`}
      // Fixed: Merged duplicate style attributes into a single object
      style={{ width, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default Reveal;
