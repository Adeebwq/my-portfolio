import Button from '../button.jsx'
import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from "gsap"
import PixelBackground from '../pixelbackground.jsx'

const Hero = () => {
  const buttonRef = useRef(null)
  const cardRef = useRef(null)

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

    gsap.from(cardRef.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: "power2.out"
    })
  })

  return (
    <div className='hero-layout relative overflow-hidden min-h-screen'>

      <PixelBackground
        cloudImages={[
          '/clouds 1-Photoroom.png',
          '/clouds 4-Photoroom.png'
        ]}
        windImage="/assets/wind.png"
      />

      <header className='flex flex-col justify-center w-full md:px-20 px-5 relative z-10 h-screen'>

        <div className='max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12'>

          {/* LEFT SIDE: Text & Button */}
          <div className='w-full md:w-1/2 flex flex-col gap-7'>
            <div className='hero-text mt-10 ml-3'>
              <h1>Hey! I'm</h1>
              <h1>Adeeb Mohamed</h1>
            </div>
            <div
              className="flex justify-start ml-3 cursor-pointer"
              ref={buttonRef}
              onClick={() => {
                const el = document.getElementById("desktop");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Button text="See My Work" />
            </div>
          </div>

          {/* RIGHT SIDE: The Portrait ASCII Card */}
          <div
            ref={cardRef}
            className='w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0'
          >
            <div
              className="w-full max-w-[340px] transition-transform duration-300 hover:-translate-y-2 hover:-translate-x-2 flex flex-col"
              style={{
                background: '#ece9d8',
                border: '4px solid #000',
                boxShadow: '10px 10px 0 #000',
              }}
            >
              {/* Titlebar */}
              <div
                className="flex justify-between items-center px-4 py-2 border-b-4 border-black shrink-0"
                style={{ background: 'linear-gradient(90deg, #0058e6 0%, #3a6ea5 100%)' }}
              >
                <span className="text-white font-bold tracking-wider text-sm" style={{ textShadow: "1px 1px 0 #000" }}>
                  portrait.png
                </span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-white border border-black"></div>
                  <div className="w-3 h-3 bg-white border border-black"></div>
                </div>
              </div>

              {/* Image Content Area (Portrait Aspect Ratio) */}
              <div className="p-2 bg-white m-1 border border-black flex-grow flex items-center justify-center overflow-hidden aspect-[3/4]">
                {/* 
                  👇 PASTE YOUR IMAGE PATH HERE 👇
                  Make sure your image is inside the 'public' folder.
                */}
                <img
                  src="/image copy.png"
                  alt="Adeeb Mohamed ASCII Portrait"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain', // Keeps the whole image visible inside the card
                    imageRendering: 'pixelated' // Keeps it crisp and retro
                  }}
                />
              </div>

              {/* Status Bar */}
              <div className="px-2 py-1 text-[10px] border-t-2 border-black bg-[#ece9d8] flex justify-between font-bold shrink-0">
                <span>RENDER.MODE</span>
                <span>100%</span>
              </div>
            </div>
          </div>

        </div>

      </header>
    </div>
  )
}

export default Hero