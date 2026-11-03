import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ThreeDisc from './disc.jsx'

// Import your images
import firstImage from '/pic22.jpg'
import overlayImage from '/image.png'
import cloudImg from '/clouds 1-Photoroom.png'
import birdImg from '/bird.png'

const About = () => {
  const [popups, setPopups] = useState([])
  const [showOverlay, setShowOverlay] = useState(false)

  const sectionRef = useRef(null)
  const popupRefs = useRef([])
  const overlayRef = useRef(null)

  const isActive = useRef(false) // Prevents re-triggering while staying on this page
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const scrollLocked = useRef(false)
  const showOverlayRef = useRef(false)

  // Keep a ref in sync so addPopup always sees the fresh showOverlay value
  useEffect(() => {
    showOverlayRef.current = showOverlay
  }, [showOverlay])

  /* ---------------- Scroll lock helpers ---------------- */
  const lockScroll = () => {
    if (scrollLocked.current) return
    scrollLocked.current = true
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = sbw > 0 ? `${sbw}px` : ''
  }

  const unlockScroll = () => {
    if (!scrollLocked.current) return
    scrollLocked.current = false
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }

  const snapAndLock = () => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const absoluteTop = rect.top + window.scrollY
    window.scrollTo({ top: absoluteTop, behavior: 'auto' })
    lockScroll()
  }

  /* ---------------- Popup helpers ---------------- */
  const getRandomPosition = () => {
    if (!sectionRef.current) return { x: 100, y: 100 }
    const rect = sectionRef.current.getBoundingClientRect()
    const popupWidth = 400
    const popupHeight = 320
    const padX = popupWidth / 2 + 20
    const padY = popupHeight / 2 + 20

    const usableW = Math.max(rect.width - padX * 2, 1)
    const usableH = Math.max(rect.height - padY * 2, 1)

    return {
      x: padX + Math.random() * usableW,
      y: padY + Math.random() * usableH
    }
  }

  const addPopup = () => {
    if (showOverlayRef.current) return
    const { x, y } = getRandomPosition()
    setPopups(prev => [...prev, { id: Date.now() + Math.random(), x, y }])
  }

  // Animate the newest popup + trigger overlay once 25 are on screen
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

  // Pop the overlay in + unlock scrolling once the whole sequence is over
  useEffect(() => {
    if (showOverlay && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { scale: 0, opacity: 0, rotation: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)", zIndex: 100 }
      )
      const t = setTimeout(() => unlockScroll(), 800)
      return () => clearTimeout(t)
    }
  }, [showOverlay])

  // Trigger the sequence when the section is (mostly) in view
  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry.isIntersecting && !isActive.current) {
          isActive.current = true

          snapAndLock()

          timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
              addPopup()
            }, 100)
          }, 1800)
        }
      },
      { threshold: 0.85 }
    )
    observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      unlockScroll()
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: 'linear-gradient(to bottom, #629DFB, #9AB3DA)',
        overflow: 'hidden',
        padding: '2rem'
      }}
    >
      {/* BACKGROUND LAYER: CLOUDS & BIRDS */}
      <div className="ambient-sky-layer" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <img src={cloudImg} className="drift-anim" style={{ position: 'absolute', top: '10%', width: '200px', opacity: 0.8, animationDuration: '60s' }} alt="cloud" />
        <img src={cloudImg} className="drift-anim" style={{ position: 'absolute', top: '20%', width: '120px', opacity: 0.5, animationDuration: '45s', animationDelay: '-15s' }} alt="cloud" />
        <img src={birdImg} className="drift-anim" style={{ position: 'absolute', top: '15%', width: '40px', animationDuration: '30s', animationDelay: '-5s' }} alt="bird" />
      </div>

      {/* ERROR POPUPS */}
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
          height: 'min(900px, 85vh)',
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