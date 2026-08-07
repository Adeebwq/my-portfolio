import React, { useState, useEffect, useRef } from 'react';

const TECH_ITEMS = [
  { id: 1, name: 'HTML', src: '/html-Photoroom.png' },
  { id: 2, name: 'CSS', src: '/css-Photoroom.png' },
  { id: 3, name: 'JavaScript', src: '/js-Photoroom.png' },
  { id: 4, name: 'Figma', src: '/figma-Photoroom.png' },
  { id: 5, name: 'React', src: '/react-Photoroom.png' },
  { id: 6, name: 'Python', src: '/python-Photoroom.png' },
  { id: 7, name: 'MySQL', src: '/mysql-Photoroom.png' },
  { id: 8, name: 'Premiere Pro', src: '/prempro-Photoroom.png' },
  { id: 9, name: 'After Effects', src: '/ae-Photoroom.png' },
  { id: 10, name: 'C', src: '/c-Photoroom.png' },
  { id: 11, name: 'C++', src: '/c++-Photoroom.png' },
];

export default function Disc({ radius = 150, itemHeight = 100, isAutoRotating = true, delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false); // Controls the pop-up delay state
  const [rotation, setRotation] = useState(0);
  const [isVisualDragging, setIsVisualDragging] = useState(false);
  
  const isDragging = useRef(false);
  const startY = useRef(0);
  const rotationRef = useRef(0);

  const anglePerItem = 360 / TECH_ITEMS.length;

  // --- POP UP DELAY LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay); // delay is in milliseconds (e.g., 800ms)

    return () => clearTimeout(timer);
  }, [delay]);
  // ---------------------------

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // --- SMOOTH AUTO ROTATION LOOP ---
  useEffect(() => {
    // Only auto-rotate if the component is visible AND not being dragged
    if (!isVisible || !isAutoRotating || isVisualDragging) return;

    let animationFrameId;

    const animate = () => {
      rotationRef.current -= 0.3; 
      setRotation(rotationRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, isAutoRotating, isVisualDragging]);

  const handleWheel = (e) => {
    e.preventDefault(); 
    if (e.deltaY > 0) {
      setRotation((prev) => prev - anglePerItem);
    } else {
      setRotation((prev) => prev + anglePerItem);
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    setIsVisualDragging(true);
    startY.current = e.clientY;
  };

  useEffect(() => {
    const handleMove = (clientY) => {
      if (!isDragging.current) return;
      const deltaY = clientY - startY.current;

      if (Math.abs(deltaY) > 5) {
        setRotation((prev) => prev + deltaY * 0.4); 
        startY.current = clientY;
      }
    };

    const onMouseMove = (e) => handleMove(e.clientY);
    const onMouseUp = () => { 
      isDragging.current = false; 
      setIsVisualDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div 
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: '160px',
        height: `${itemHeight * 2.5}px`,
        perspective: '800px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: isVisualDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        
        // --- POP UP ANIMATION STYLES ---
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.3)',
        transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Smooth bounce-up effect
        // -------------------------------
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${itemHeight}px`,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation}deg)`,
        transition: isVisualDragging ? 'none' : 'transform 0.1s linear',
      }}>
        {TECH_ITEMS.map((item, index) => (
          <div 
            key={item.id} 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backfaceVisibility: 'hidden',
              transform: `rotateX(${anglePerItem * index}deg) translateZ(${radius}px)`,
            }}
          >
            <img 
              src={item.src} 
              alt={item.name} 
              style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain', pointerEvents: 'none' }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}