import Button from '../button.jsx'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from "gsap"
// Import the new background component (Adjust the path if you saved it elsewhere!)
import PixelBackground from '../PixelBackground.jsx' 

const Hero = () => {
  const buttonRef = useRef(null)

  useGSAP(() => {
    gsap.from('.hero-text h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out"
    })
    
    gsap.from(buttonRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.8,
      ease: "bounce.out"
    })
  })

  return (
    // Added 'relative' and 'overflow-hidden' so the canvas stays contained here
    <div className='hero-layout relative overflow-hidden min-h-screen'>
      
      {/* The Canvas Background Layer 
        (It has z-index: -1 built-in, so it will sit at the very back)
      */}
      <PixelBackground 
        cloudImages={[
          '/clouds 1-Photoroom.png',
          '/clouds 4-Photoroom.png'
        ]}
        
        windImage="/assets/wind.png"
      />

      {/* Your Existing UI Layer 
        Added 'relative z-10' to the header to guarantee it renders ON TOP of the canvas
      */}
      <header className='flex flex-col justify-center md:w-full w-screen md:px-20 px-5 relative z-10 h-screen'>
        <div className='flex flex-col gap-7'>
          <div className='hero-text mt-10 ml-3'>
            <h1>Hey! I'm</h1>
            <h1>Adeeb Mohamed</h1>
          </div>
          <div className="flex justify-start" ref={buttonRef}>
            <Button text="See My Work" />
          </div>
        </div>
      </header>
    </div>
  )
}

export default Hero