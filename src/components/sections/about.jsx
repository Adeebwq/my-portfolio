import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ThreeDisc from './disc.jsx'

// Import your images
import firstImage from '/pic22.jpg'
import overlayImage from '/image.png'
import hillimg from '/hill.png'
// ADD THESE IMPORTS (adjust paths to your actual cloud/bird images)
import cloudImg from '/clouds 1-Photoroom.png' 
import birdImg from '/bird.png'

const About = () => {
  const [popups, setPopups] = useState([])
  const [showOverlay, setShowOverlay] = useState(false)
  const sectionRef = useRef(null)
  const popupRefs = useRef([])
  const overlayRef = useRef(null)
  const hillRef = useRef(null)
  const isActive = useRef(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null) // Added ref to track the delay timer

  const getRandomPosition = () => {
    if (!sectionRef.current) return { x: 100, y: 100 }
    const rect = sectionRef.current.getBoundingClientRect()
    const padding = 60
    const maxX = rect.width - padding
    const maxY = rect.height - padding
    return {
      x: padding + Math.random() * maxX,
      y: padding + Math.random() * maxY
    }
  }

  const addPopup = () => {
    if (showOverlay) return
    const { x, y } = getRandomPosition()
    const newPopup = { id: Date.now() + Math.random(), x, y }
    setPopups(prev => [...prev, newPopup])
  }

  useEffect(() => {
    if (popups.length === 0) return
    const lastIndex = popups.length - 1
    const el = popupRefs.current[lastIndex]
    if (el) {
      gsap.fromTo(el,
        { scale: 0, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0, ease: "back.out(0.2)" }
      )
    }
    if (popups.length >= 25 && !showOverlay) {
      setShowOverlay(true)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [popups, showOverlay])

  useEffect(() => {
    if (showOverlay && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { scale: 0, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)", zIndex: 100 }
      )
    }
  }, [showOverlay])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !isActive.current && !showOverlay) {
          isActive.current = true
          
          // 1. Animate the hill sliding up immediately
          if (hillRef.current) {
            gsap.fromTo(hillRef.current, 
              { y: '100%' }, 
              { y: '0%', duration: 1.2, ease: "power3.out", delay: 0.2 }
            )
          }

          // 2. DELAY THE POPUPS by 1.8 seconds (waits for hill to finish)
          timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
              addPopup()
            }, 100)
          }, 1800) 
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(sectionRef.current)
    
    // Cleanup timers when component unmounts
    return () => {
      observer.disconnect()
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [showOverlay])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        // Adds a sky blue color that ensures this section isn't transparently showing empty space
        background: 'linear-gradient(to bottom, #629DFB, #9AB3DA)', 
        overflow: 'visible',
        padding: '2rem'
      }}
    >
      
      {/* BACKGROUND LAYER: FEW CLOUDS & BIRDS (Placed high up) */}
      <div className="ambient-sky-layer" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* A large, slow cloud near the top left */}
        <img src={cloudImg} className="drift-anim" style={{ position: 'absolute', top: '10%', width: '200px', opacity: 0.8, animationDuration: '60s' }} alt="cloud" />
        {/* A smaller, slightly faster cloud near top right */}
        <img src={cloudImg} className="drift-anim" style={{ position: 'absolute', top: '20%', width: '120px', opacity: 0.5, animationDuration: '45s', animationDelay: '-15s' }} alt="cloud" />
        {/* A single bird */}
        <img src={birdImg} className="drift-anim" style={{ position: 'absolute', top: '15%', width: '40px', animationDuration: '30s', animationDelay: '-5s' }} alt="bird" />
      </div>

      {/* THE PARALLAX HILL LAYER */}
      <div 
        ref={hillRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '35vh',
          zIndex: 1, 
          transform: 'translateY(100%)',
          pointerEvents: 'none'
        }}
      >
        <img 
          src={hillimg} 
          alt="Parallax Hill" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      </div>

      {/* THE ERROR POPUPS */}
      {popups.map((pop, idx) => (
        <img
          key={pop.id}
          ref={el => popupRefs.current[idx] = el}
          src={firstImage}
          alt="popup"
          style={{
            position: 'absolute',
            left: pop.x,
            top: pop.y,
            width: '400px',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10 
          }}
        />
      ))}
        
      {/* OVERLAY WINDOW AND SCROLL DISC */}
      {showOverlay && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px', 
          height: '900px', 
          zIndex: 200,
          pointerEvents: 'none' 
        }}>
          
          <img
            ref={overlayRef}
            src={overlayImage}
            alt="overlay"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          />

          <div style={{
            position: 'absolute',
            right: '30px', 
            top: '53%', 
            transform: 'translateY(-50%)',
            zIndex: 300, 
            pointerEvents: 'auto', 
          }}>
            <ThreeDisc radius={180} itemHeight={80} />
          </div>

        </div>
      )}
    </section>
  )
}

export default About