import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom"; // <-- THIS FIXES THE CRASH

/* ================================================================== */
/*  Icons                                                             */
/* ================================================================== */

/* ================================================================== */
/*  Custom Icons (Replace paths with your actual filenames)           */
/* ================================================================== */

// 1. Desktop Computer Icon (48x48 or 64x64 recommended)
export const RetroComputerIcon = () => (
  <img
    src="/this pc copy.png"
    alt="This PC"
    className="w-12 h-12 object-contain"
    style={{ imageRendering: "pixelated" }}
  />
);

// 2. Folder Icon (48x48 or 64x64 recommended)
export const RetroFolderIcon = () => (
  <img
    src="/folder icon copy.png"
    alt="Folder"
    className="w-12 h-12 object-contain"
    style={{ imageRendering: "pixelated" }}
  />
);

// 3. Tiny Video Icon (16x16 recommended)
const PixelVideoIcon = () => (
  <img
    src="/vid icon.png"
    alt="Video"
    className="w-4 h-4 object-contain"
    style={{ imageRendering: "pixelated", flexShrink: 0 }}
  />
);

// 4. Tiny Poster/Image Icon (16x16 recommended)
const PixelImageIcon = () => (
  <img
    src="/image pixel icon.png"
    alt="Poster"
    className="w-4 h-4 object-contain"
    style={{ imageRendering: "pixelated", flexShrink: 0 }}
  />
);

/* ================================================================== */
/*  Main Desktop Component                                            */
/* ================================================================== */

export default function RetroDesktop({
  contactOpen,                 // <-- ADD THIS
  setContactOpen,
  background = "linear-gradient(to bottom, #9AB3DA 0%, #C2D1E9 55%, #E3ECF7 100%)",
  backgroundOverlay = "none",
  showGrain = false,
  cloudImage = "/clouds 1-Photoroom.png",
  showClouds = true,
  hillImage = "/hill.png",
  hillHeight = "35vh",
  hillDelayMs = 100,
  hillDurationMs = 1200,
  thisPcIcon = <RetroComputerIcon />,
  thisPcLabel = "This PC",
  projectsLabel = "projects",
  technicalLabel = "technical",
  creativeLabel = "creative",
  startLabel = "start",
}) {
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [path, setPath] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const windowRef = useRef(null);
  const contactRef = useRef(null);
  const sectionRef = useRef(null);
  const hillRef = useRef(null);
  const taskbarRef = useRef(null);
  const isActive = useRef(false);

  // Animation logic for window opening
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    return () => gsap.killTweensOf(el);
  }, []);

  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    gsap.killTweensOf(el);

    if (explorerOpen) {
      gsap.fromTo(el, { scale: 0.8, opacity: 0, visibility: "visible" }, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out", overwrite: true });
    } else {
      gsap.to(el, {
        scale: 0.8, opacity: 0, duration: 0.2, ease: "power2.in", overwrite: true,
        onComplete: () => {
          gsap.set(el, { visibility: "hidden", opacity: 0, scale: 1, x: 0, y: 0 });
          setPath([]);
          setFilter("all");
          setFilterMenuOpen(false);
        },
      });
    }
  }, [explorerOpen]);
  // Tell GSAP to center the Contact window and take over its transform
  useEffect(() => {
    if (contactOpen && contactRef.current) {
      gsap.set(contactRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    }
  }, [contactOpen]);
  // Hill and taskbar intro animation
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isActive.current) {
          isActive.current = true;
          const tl = gsap.timeline();
          if (hillRef.current) {
            tl.fromTo(hillRef.current, { y: "100%" }, { y: "0%", duration: hillDurationMs / 1000, ease: "power3.out" }, hillDelayMs / 1000);
          }
          if (taskbarRef.current) {
            tl.fromTo(taskbarRef.current, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.8, ease: "back.out(1.4)" }, hillDelayMs / 1000 + 0.2);
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      if (hillRef.current) gsap.killTweensOf(hillRef.current);
      if (taskbarRef.current) gsap.killTweensOf(taskbarRef.current);
    };
  }, [hillDelayMs, hillDurationMs]);

  const startDrag = (e, ref) => {
    if (e.button !== 0) return;
    if (e.target.closest("[data-no-drag]")) return;

    const el = ref.current; // <-- Uses the passed ref
    if (!el) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startTx = gsap.getProperty(el, "x");
    const startTy = gsap.getProperty(el, "y");

    const onMove = (ev) => {
      gsap.set(el, { x: startTx + (ev.clientX - startX), y: startTy + (ev.clientY - startY) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const goBack = () => {
    if (path.length === 0) return;
    setPath(path.slice(0, -1));
    setFilterMenuOpen(false);
  };

  const openProjects = () => setPath(["projects"]);
  const openCreative = () => setPath(["projects", "creative"]);

  const clouds = [
    { top: "10%", width: 200, opacity: 0.8, duration: "60s", delay: "0s" },
    { top: "20%", width: 120, opacity: 0.5, duration: "45s", delay: "-15s" },
    { top: "5%", width: 160, opacity: 0.6, duration: "75s", delay: "-30s" },
    { top: "32%", width: 100, opacity: 0.4, duration: "50s", delay: "-20s" },
  ];

  const addressString = "C:\\Documents and Settings\\SilentHill\\My Documents" + (path.length ? "\\" + path.join("\\") : "");

  // POSTER AND VID UPLOAD
  const CREATIVE_ITEMS = [
    { type: "poster", title: "Mulearn — SIH Trial", url: "https://drive.google.com/file/d/1MpB0epgGXoL0bvNuNwoMiUBaOBooMeKB/view?usp=sharing" },
    { type: "poster", title: "Mulearn — Independence Day", url: "https://drive.google.com/file/d/1WPj9UwGCe8ihsySMhvgkKHMhgE7H7AbE/view?usp=sharing" },
    { type: "poster", title: "Mulearn — SIH OUt", url: "https://drive.google.com/file/d/1w_8LKvKg8WRhP-G55sA8GznW7bOm-_qx/view?usp=sharing" },
    { type: "poster", title: "Mulearn - Birthday", url: "https://drive.google.com/file/d/1VqhKBjnbeR5QhNamuMffb7Sv-W4PYl71/view?usp=sharing" },
    { type: "video", title: "Reel - Q&A", url: "https://www.instagram.com/reel/DRzX-DWjs8N/?vrfl=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "poster", title: "Mulearn - HR", url: "https://drive.google.com/file/d/12jBkzsL3nz4vt7D85FwgfBlKnUBgppVk/view?usp=sharing" },
    { type: "video", title: "Reel - Q&A 2", url: "https://www.instagram.com/reel/DKb7NFeheiw/?srtk=MzRlODBiNWFlZA==" },
    { type: "poster", title: "Mulearn - Interns", url: "https://drive.google.com/file/d/1EiJ1GTmOtkgmltK0us_OII6zs3Um0M4l/view?usp=sharing" },
    { type: "poster", title: "Poster — Lam Brochure", url: "https://drive.google.com/file/d/1Gy_6qyfhY_0UXdRnOSIMl5o2ZdujShpq/view?usp=sharing" },
    { type: "video", title: "Reel — Q&A 3", url: "https://www.instagram.com/reel/DR4iRWKDBod/?exln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "poster", title: "Poster — Lam Logistics", url: "https://drive.google.com/file/d/1YWXnoY69-4ZVRr2In-kuN3YZlJGUzWCB/view?usp=sharing" },
    { type: "video", title: "Reel — short", url: "https://www.instagram.com/reel/DMqCAbDhfQd/?dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "poster", title: "Poster — Degree Batch", url: "https://drive.google.com/file/d/18ad1rr6mnaWLEJwJ-ulMtITUWfHLChmc/view?usp=sharing" },
    { type: "poster", title: "Poster — YT Thumbnail", url: "https://drive.google.com/file/d/1N_3tHrFv6RR-MxkIAkPbL4g5wHVNnl89/view?usp=sharing" },
    { type: "poster", title: "Poster — YT Thumbnail-2", url: "https://drive.google.com/file/d/1cqwZbBdSduhoQztXMq1G8It9y_1EHScp/view?usp=sharing" },
    { type: "video", title: "Reel — AD", url: "https://www.instagram.com/reel/DM7et-uBCQC/?rpxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "video", title: "Reel — AD 2", url: "https://www.instagram.com/reel/DMuYN5VhdjH/?xtok=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "poster", title: "Poster — Lam Multimedia", url: "https://drive.google.com/file/d/1ZH2ztY5gP28B6T2Wek6dmq8kECjDn_tR/view?usp=sharing" },
    { type: "poster", title: "Poster — YT Thumbnail-2", url: "https://drive.google.com/file/d/1cqwZbBdSduhoQztXMq1G8It9y_1EHScp/view?usp=sharing" },
    { type: "poster", title: "Poster — YT Thumbnail-2", url: "https://drive.google.com/file/d/1cqwZbBdSduhoQztXMq1G8It9y_1EHScp/view?usp=sharing" },
    { type: "video", title: "Reel", url: "https://www.instagram.com/reel/DMfvZ3pBWyk/?dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
    { type: "video", title: "Reel", url: "https://www.instagram.com/reel/DMSVGXKhFE5/?mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" },
  ];

  const filteredItems = CREATIVE_ITEMS.filter((item) => {
    if (filter === "all") return true;
    if (filter === "videos") return item.type === "video";
    if (filter === "posters") return item.type === "poster";
    return true;
  });

  const renderFolderView = () => {
    if (path.length === 0) {
      return (
        <div className="flex gap-6">
          <button type="button" className="folder-item" onClick={openProjects}>
            <span className="w-12 h-12 flex items-center justify-center"><RetroFolderIcon /></span>
            <span>{projectsLabel}</span>
          </button>
          <button type="button" className="folder-item" onClick={() => setContactOpen(true)}>
            <span className="w-12 h-12 flex items-center justify-center"><RetroFolderIcon /></span>
            <span>contact</span>
          </button>
        </div>
      );
    }

    if (path.length === 1 && path[0] === "projects") {
      return (
        <div className="flex gap-6">
          {/* THIS IS THE FIX: Using Link instead of <a> */}
          <Link to="/technical" className="folder-item" title="Open technical projects">
            <span className="w-12 h-12 flex items-center justify-center"><RetroFolderIcon /></span>
            <span>{technicalLabel}</span>
          </Link>
          <button type="button" className="folder-item" onClick={openCreative}>
            <span className="w-12 h-12 flex items-center justify-center"><RetroFolderIcon /></span>
            <span>{creativeLabel}</span>
          </button>
        </div>
      );
    }
    return null;
  };

  const renderCreativeView = () => (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      <div className="flex justify-between items-center mb-2 relative">
        <span className="text-[11px] text-[#555]">{filteredItems.length} item(s)</span>
        <div className="relative">
          <button type="button" onClick={() => setFilterMenuOpen((v) => !v)} className="xp-button" style={{ width: "auto", height: "auto", padding: "2px 8px" }}>
            Filter: {filter === "all" ? "All" : filter === "videos" ? "Videos" : "Posters"} ▾
          </button>
          {filterMenuOpen && (
            <div className="absolute right-0 mt-1 z-20 bg-[#ece9d8] border border-[#aca899] shadow-md" style={{ minWidth: 120 }} onMouseLeave={() => setFilterMenuOpen(false)}>
              {[{ value: "all", label: "All" }, { value: "videos", label: "Videos" }, { value: "posters", label: "Posters" }].map((opt) => (
                <button key={opt.value} type="button" onClick={() => { setFilter(opt.value); setFilterMenuOpen(false); }} className="block w-full text-left px-3 py-1 text-[12px] hover:bg-[#0058e6] hover:text-white" style={{ fontWeight: filter === opt.value ? "bold" : "normal" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="overflow-y-auto flex-1 border-t border-[#d0d0d0]" style={{ maxHeight: 300, minHeight: 100 }}>
        {filteredItems.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-black hover:bg-[#c6d8f5] border-b border-[#eee] no-underline"
          >
            {item.type === "video" ? <PixelVideoIcon /> : <PixelImageIcon />}
            <span className="flex-1 truncate">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adeebmohamed02@gmail.com"); // <-- PUT YOUR EMAIL HERE
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="desktop" ref={sectionRef} className="relative w-full h-screen overflow-hidden select-none isolate">
      <style>{`
        .xp-window { background: #ece9d8; border: 2px solid #0058e6; border-top-color: #3a6ea5; border-left-color: #3a6ea5; border-radius: 6px 6px 4px 4px; box-shadow: 3px 3px 0 rgba(0,0,0,0.45), inset 1px 1px 0 #fff, inset -1px -1px 0 #aca899; }
        .xp-titlebar { background: linear-gradient(90deg, #0058e6 0%, #3a6ea5 70%, #2b4f8c 100%); color: #fff; padding: 4px 6px; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0; border-bottom: 1px solid #003399; text-shadow: 1px 1px 0 #003366; cursor: grab; touch-action: none; }
        .xp-titlebar:active { cursor: grabbing; }
        .xp-button { background: #ece9d8; border: 1px solid #003399; border-radius: 3px; width: 18px; height: 16px; font-size: 10px; font-weight: bold; color: #003399; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #aca899; cursor: pointer; }
        .xp-button:hover  { background: #ed2121ff; }
        .desktop-icon { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 96px; padding: 8px 4px; border-radius: 4px; cursor: pointer; color: #fff; font-size: 12px; font-weight: 500; text-shadow: 2px 2px 0 rgba(0,0,0,0.55); background: transparent; border: 1px solid transparent; }
        .desktop-icon:hover { background: rgba(64,128,255,0.22); border-color: rgba(255,255,255,0.35); }
        .folder-item { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 96px; padding: 8px 4px; border-radius: 3px; cursor: pointer; font-size: 12px; color: #000; background: transparent; border: 1px solid transparent; text-decoration: none; }
        .folder-item:hover { background: #c6d8f5; border-color: #7fa4d9; }
        .xp-taskbar { position: absolute; left: 0; right: 0; bottom: 0; height: 42px; background: linear-gradient(180deg, #245edb 0%, #1c4bb6 10%, #0e3aa8 90%); border-top: 2px solid #3a6ea5; display: flex; align-items: center; padding: 0 8px; box-shadow: 0 -2px 5px rgba(0,0,0,0.5); }
        .start-button { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(180deg, #3a8c3a 0%, #1f6b1f 100%); padding: 4px 16px 4px 10px; border-radius: 15px; font-weight: bold; font-size: 13px; color: #fff; text-shadow: 1px 1px 0 #003300; border: 1px solid #1f4f1f; border-top-color: #6bb36b; cursor: pointer; }
        @keyframes drift { from { transform: translateX(-30%); } to { transform: translateX(130vw); } }
        .drift-anim { animation-name: drift; animation-timing-function: linear; animation-iteration-count: infinite; }
                /* --- Red Laser Sweep Animation --- */
        @keyframes red-laser-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .contact-sweep-text {
          /* A gradient with a block of red in the middle */
          background: linear-gradient(
            90deg, 
            #000 0%, 
            #000 40%, 
            #ff0000 50%, 
            #ff0000 55%, 
            #000 65%, 
            #000 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: red-laser-sweep 3.0s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0" style={{ background, zIndex: -20 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: backgroundOverlay, zIndex: -10 }} />
      {showGrain && <div className="absolute inset-0 pointer-events-none opacity-20 grain" style={{ zIndex: -10 }} />}

      {showClouds && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {clouds.map((c, i) => (
            <img key={i} src={cloudImage} className="drift-anim" style={{ position: "absolute", top: c.top, width: `${c.width}px`, opacity: c.opacity, animationDuration: c.duration, animationDelay: c.delay }} alt="cloud" />
          ))}
        </div>
      )}

      <div ref={hillRef} className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ height: hillHeight, zIndex: 2, transform: "translateY(100%)" }}>
        <img src={hillImage} alt="Hill" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
        <button type="button" className="desktop-icon" onClick={() => setExplorerOpen(true)}>
          <span className="w-12 h-12 flex items-center justify-center">{thisPcIcon}</span>
          <span>{thisPcLabel}</span>
        </button>
      </div>

      <div ref={windowRef} role="dialog" className="xp-window absolute left-1/2 top-1/2 w-[750px] max-w-[92vw]" style={{ opacity: 0, visibility: "hidden", zIndex: 1000 }}>
        <div className="xp-titlebar" onPointerDown={(e) => startDrag(e, windowRef)}>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 64 64" className="w-4 h-4"><path d="M6 14 H26 L32 20 H58 V52 H6 Z" fill="#f5c542" stroke="#9a7600" strokeWidth="4" /></svg>
            <span>This PC</span>
          </div>
          <div className="flex items-center gap-1" data-no-drag>
            <span className="xp-button">_</span>
            <span className="xp-button">□</span>
            <button type="button" className="xp-button" onClick={() => setExplorerOpen(false)}>✕</button>
          </div>
        </div>

        <div className="xp-toolbar flex gap-3 px-2 py-1 text-[12px] border-b border-[#aca899] bg-[#ece9d8] text-[#222]">
          <button type="button" onClick={goBack} disabled={path.length === 0} className="bg-transparent border-0 cursor-pointer disabled:opacity-40 text-[#222]">◀ Back</button>
          <span>▲ Up</span>
          <span>🔍 Search</span>
          <span>📁 Folders</span>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 bg-[#ece9d8] border-b border-[#aca899] text-[11px]">
          <span className="font-bold">Address</span>
          <span className="bg-white border border-[#7a7a7a] px-2 py-0.5 w-full truncate">{addressString}</span>
        </div>

        <div className="p-3 m-1.5 bg-white border border-[#aca899] rounded-sm" style={{ minHeight: 350 }}>
          {path.length === 2 && path[0] === "projects" && path[1] === "creative" ? renderCreativeView() : renderFolderView()}
        </div>
      </div>

      <div ref={taskbarRef} className="xp-taskbar" style={{ transform: "translateY(100%)", opacity: 0, zIndex: 500 }}>
        <button type="button" className="start-button"><span>{startLabel}</span></button>
        <div className="ml-4 text-white/70 text-xs flex gap-6 items-center"><span>🔊</span><span>🌐</span></div>
      </div>
      {/* ---------------- Contact Popup ---------------- */}
      {contactOpen && (
        <div
          ref={contactRef} // <-- Added ref
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // transform: 'translate(-50%, -50%)', <-- REMOVED
            zIndex: 2000,
            width: '550px',
            maxWidth: '90vw',
            background: '#ece9d8',
            border: '2px solid #0058e6',
            borderTopColor: '#3a6ea5',
            borderLeftColor: '#3a6ea5',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.5)',
            borderRadius: '4px',
          }}
        >
          {/* Titlebar with drag event */}
          <div
            className="xp-titlebar"
            onPointerDown={(e) => startDrag(e, contactRef)} // <-- Added drag
            style={{ cursor: 'grab', padding: '6px 8px' }}
          >
            <span>Contact.exe</span>
            <button
              type="button"
              className="xp-button"
              onClick={() => setContactOpen(false)}
              data-no-drag // <-- Prevents dragging when clicking the X button
            >
              ✕
            </button>
          </div>

          {/* Content Area */}
          <div style={{ padding: '50px 30px', textAlign: 'center', background: '#fff', margin: '4px', border: '1px solid #aca899' }}>

            {/* The new laser sweep text */}
            <h2
              className="contact-sweep-text"
              style={{
                fontWeight: 500,
                fontSize: '42px',
                marginBottom: '40px',
                imageRendering: 'pixelated'
              }}
            >
              CONTACT ME !
            </h2>

            {/* Logos Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' }}>

              <a href="https://github.com/Adeebwq" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <img
                  src="/github.png"
                  alt="GitHub"
                  style={{ width: '56px', height: '56px', objectFit: 'contain', cursor: 'pointer', filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.3))', transition: 'transform 0.1s' }}
                  className="hover:scale-110"
                />
              </a>

              <a href="https://www.linkedin.com/in/adeeb-mohamed-4067153b6" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <img
                  src="/linkedin.png"
                  alt="LinkedIn"
                  style={{ width: '56px', height: '56px', objectFit: 'contain', cursor: 'pointer', filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.3))', transition: 'transform 0.1s' }}
                  className="hover:scale-110"
                />
              </a>

              <a href="https://www.instagram.com/_adeeb_mohd/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <img
                  src="/insta.png"
                  alt="Instagram"
                  style={{ width: '56px', height: '56px', objectFit: 'contain', cursor: 'pointer', filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.3))', transition: 'transform 0.1s' }}
                  className="hover:scale-110"
                />
              </a>

              {/* Gmail Copy Button */}
              <button
                onClick={handleCopyEmail}
                title="Click to copy email address"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  // Slight adjustment to align with the other icons
                }}
              >
                <img
                  src="/gmail.png" // <-- Your image path
                  alt="Gmail"
                  style={{
                    width: '56px',
                    height: '56px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.3))',
                    transition: 'transform 0.1s'
                  }}
                  className="hover:scale-110"
                />

                {/* Tiny visual feedback below the icon */}
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: copied ? '#080808ff' : 'transparent',
                  transition: 'color 0.2s',
                  height: '12px',
                }}>
                  {copied ? "Copied to Clipboard !" : "."}
                </span>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}