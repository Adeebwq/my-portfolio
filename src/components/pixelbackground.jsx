import React, { useEffect, useRef } from 'react';

const PixelBackground = ({ cloudImages = [], windImage = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    const CONFIG = {
      colors: {
        top: [20, 76, 214],    
        mid: [43, 109, 242],   
        bot: [98, 157, 251]    
      },
      bandHeight: 8,
      cloudSpeedMin: 0.2, cloudSpeedMax: 0.5, cloudCount: 6,
      birdSpeedMin: 1.0, birdSpeedMax: 2.5, birdCount: 4,
      windSpeedMin: 2.0, windSpeedMax: 5.0, windCount: 12,
      parallaxStrength: 30,
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = false; 
    };
    
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / width) * 2 - 1;
      targetMouseY = (e.clientY / height) * 2 - 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const lerpColor = (c1, c2, t) => [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[2] - c1[2]) * t)
    ];

    const getRandomSafeY = (objHeight) => {
      if (Math.random() > 0.5) {
        return Math.random() * (height * 0.25 - objHeight);
      } else {
        return height * 0.75 + Math.random() * (height * 0.25 - objHeight);
      }
    };

    // --- Image Loading ---
    const loadImg = (src) => {
      if (!src) return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const loadedClouds = cloudImages.map(loadImg).filter(Boolean);
    const loadedWind = loadImg(windImage);

    // --- Pre-render Bird V-Shapes ---
    const birdSpriteFrames = [];
    const birdRawPixels = [
      [ "  XX  ", " XXXX ", "XX  XX" ], // Frame 0: Wings down
      [ "XX  XX", " XXXX ", "  XX  " ]  // Frame 1: Wings up
    ];
    
    birdRawPixels.forEach(frameStr => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      // Increased base pixel size from 4 to 6 to make them chunkier
      const pixelSize = 6; 
      
      tempCanvas.width = frameStr[0].length * pixelSize;
      tempCanvas.height = frameStr.length * pixelSize;
      
      // Changed from white to a very dark blue/black silhouette
      tempCtx.fillStyle = '#0f172a'; 
      
      for(let y = 0; y < frameStr.length; y++) {
        for(let x = 0; x < frameStr[y].length; x++) {
          if (frameStr[y][x] === 'X') {
            tempCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
      }
      birdSpriteFrames.push(tempCanvas);
    });

    // --- Classes ---
    class Cloud {
      constructor() {
        this.img = loadedClouds.length > 0 ? loadedClouds[Math.floor(Math.random() * loadedClouds.length)] : null;
    
    // CHANGE THIS: Lower the scale to 0.5 or 1 so the whole sheet fits on screen
    this.scale = 1.3; 

        this.reset(true);
      }
      reset(randomX = false) {
        this.width = (this.img?.width || 50) * this.scale;
        this.height = (this.img?.height || 32) * this.scale;
        this.x = randomX ? Math.random() * width : -this.width - 50;
        this.y = getRandomSafeY(this.height);
        this.speed = CONFIG.cloudSpeedMin + Math.random() * (CONFIG.cloudSpeedMax - CONFIG.cloudSpeedMin);
      }
      update() {
        this.x += this.speed;
        if (this.x > width + 50) this.reset();
      }
      draw(offsetX, offsetY) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;
        ctx.drawImage(this.img, this.x + offsetX * 0.5, this.y + offsetY * 0.5, this.width, this.height);
      }
    }

class Bird {
      constructor() {
        this.width = birdSpriteFrames[0].width;
        this.height = birdSpriteFrames[0].height;
        
        // Increased scale drastically so they are highly visible
        this.scale = 0.5; 
        
        this.reset(true);
      }
      reset(randomX = false) {
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.scaledWidth = this.width * this.scale;
        this.scaledHeight = this.height * this.scale;
        
        this.x = randomX ? Math.random() * width : (this.direction === 1 ? -this.scaledWidth : width + this.scaledWidth);
        this.y = getRandomSafeY(this.scaledHeight);
        this.speed = (CONFIG.birdSpeedMin + Math.random() * (CONFIG.birdSpeedMax - CONFIG.birdSpeedMin)) * this.direction;
        this.flapTimer = 0;
        this.frame = 0;
      }
      update() {
        this.x += this.speed;
        this.flapTimer++;
        // Slightly faster flapping
        if (this.flapTimer > 12) { 
            this.frame = this.frame === 0 ? 1 : 0;
            this.flapTimer = 0;
        }
        if (this.direction === 1 && this.x > width + 50) this.reset();
        if (this.direction === -1 && this.x < -this.scaledWidth - 50) this.reset();
      }
      draw(offsetX, offsetY) {
        ctx.save();
        ctx.translate(this.x + offsetX * 1.5, this.y + offsetY * 1.5);
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(birdSpriteFrames[this.frame], 0, 0, this.scaledWidth, this.scaledHeight);
        ctx.restore();
      }
    }
    class WindStreak {
      constructor() {
        this.img = loadedWind;
        this.scale = 1 + Math.random() * 2;
        this.reset(true);
      }
      reset(randomX = false) {
        this.width = (this.img?.width || 30) * this.scale;
        this.height = (this.img?.height || 10) * this.scale;
        this.x = randomX ? Math.random() * width : -this.width;
        this.y = Math.random() * height;
        this.speed = CONFIG.windSpeedMin + Math.random() * (CONFIG.windSpeedMax - CONFIG.windSpeedMin);
        this.opacity = 0.2 + Math.random() * 0.5;
      }
      update() {
        this.x += this.speed;
        if (this.x > width) this.reset();
      }
      draw(offsetX, offsetY) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.img, this.x + offsetX * 0.2, this.y + offsetY * 0.2, this.width, this.height);
        ctx.restore();
      }
    }

    const clouds = Array.from({ length: CONFIG.cloudCount }, () => new Cloud());
    const birds = Array.from({ length: CONFIG.birdCount }, () => new Bird());
    const winds = Array.from({ length: CONFIG.windCount }, () => new WindStreak());

    const animate = () => {
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      const pX = currentMouseX * CONFIG.parallaxStrength;
      const pY = currentMouseY * CONFIG.parallaxStrength;

      const numBands = Math.ceil(height / CONFIG.bandHeight);
      const midBand = Math.floor(numBands / 2);
      
      for (let i = 0; i < numBands; i++) {
        let color;
        if (i <= midBand) {
          color = lerpColor(CONFIG.colors.top, CONFIG.colors.mid, i / midBand);
        } else {
          color = lerpColor(CONFIG.colors.mid, CONFIG.colors.bot, (i - midBand) / (numBands - midBand));
        }
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillRect(0, i * CONFIG.bandHeight, width, CONFIG.bandHeight);
      }

      winds.forEach(w => { w.update(); w.draw(pX, pY); });
      clouds.forEach(c => { c.update(); c.draw(pX, pY); });
      birds.forEach(b => { b.update(); b.draw(pX, pY); });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cloudImages, windImage]); // Removed birdImage from the dependency array

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, 
        pointerEvents: 'none',
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default PixelBackground;