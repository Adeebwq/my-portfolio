import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from "react-router-dom";

const PROJECTS = [
    {
        id: 'desktop',
        title: 'Portfolio Website',
        category: 'web',
        year: '2026',
        blurb: 'Custom Website',
        description: 'A fully functional Windows XP themed website built in React, with draggable windows, a working file explorer, and a Silent Hill inspired atmosphere. Features GSAP animations throughout, taskbar, and nested folder navigation.',
        tech: ['React', 'GSAP', 'Tailwind'],
        images: [
            '/website-1.png',
            '/website-2.png',
            '/website-3.png',
        ],
        repo: 'https://github.com/'
    },
    {
        id: 'SPO2',
        title: 'Custom SPO2',
        category: 'kicad',
        year: '2026',
        blurb: '25W stereo class-D amplifier on a compact PCB',
        description: 'A TPA3116-based stereo class-D audio amplifier with custom PCB layout. Focused on minimizing EMI on the output filter and achieving clean THD+N measurements.',
        tech: ['KiCad', 'Analog Design', 'Audio'],
        images: [
            '/pcb test 3d model-1.png',
            '/pcb test 3d model-2.png',
            '/pcb test 3d model-3.png',
            '/test pcb.png',
            '/pcb test schematic.png',
        ],
    },
]

const CATEGORY_META = {
    web: { label: 'WEB', color: '#ffffff', bg: '#0066ff' },
    kicad: { label: 'KICAD', color: '#000000', bg: '#ffcc00' },
    hardware: { label: 'HARDWARE', color: '#000000', bg: '#00cc88' },
}

export default function TechnicalProjects() {
    const [selectedId, setSelectedId] = useState(null)
    const [imgIndex, setImgIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const loadingRef = useRef(null)
    const detailRef = useRef(null)
    const mainImgRef = useRef(null)

    const selected = selectedId ? PROJECTS.find((p) => p.id === selectedId) : null

    useEffect(() => {
        if (selected && detailRef.current) {
            gsap.fromTo(
                detailRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            )
        }
    }, [selectedId])

    useEffect(() => {
        if (mainImgRef.current) {
            gsap.fromTo(
                mainImgRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            )
        }
    }, [imgIndex, selectedId])

    const openProject = (id) => {
        setSelectedId(id)
        setImgIndex(0)
    }
    const closeProject = () => {
        setSelectedId(null)
        setImgIndex(0)
    }
    const nextImg = () => {
        if (!selected) return
        setImgIndex((i) => (i + 1) % selected.images.length)
    }
    const prevImg = () => {
        if (!selected) return
        setImgIndex((i) => (i - 1 + selected.images.length) % selected.images.length)
    }

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') closeProject()
            else if (selected && e.key === 'ArrowRight') nextImg()
            else if (selected && e.key === 'ArrowLeft') prevImg()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [selected])
    // Loading screen timer & fade out
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loadingRef.current) {
                gsap.to(loadingRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => setIsLoading(false)
                })
            } else {
                setIsLoading(false)
            }
        }, 1800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            padding: '32px 16px',
            background: '#1a1a1a',
            backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
        }}>
            <style>{`
                .xp-window { background: #ece9d8; border: 3px solid #000; box-shadow: 10px 10px 0 #000; }
                .xp-titlebar { background: linear-gradient(90deg, #0058e6 0%, #3a6ea5 100%); color: #fff; padding: 6px 10px; font-weight: bold; font-size: 13px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; letter-spacing: 0.5px; text-shadow: 1px 1px 0 #003366; }
                .xp-window-btn { width: 20px; height: 18px; background: #d6d2c2; border: 2px solid #000; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #000; cursor: default; }
                .xp-window-btn--close { background: #ff5577; color: #fff; }
                .xp-button { background: #ece9d8; border: 2px solid #000; padding: 6px 12px; font-weight: 900; font-size: 12px; color: #000; cursor: pointer; box-shadow: 3px 3px 0 #000; transition: transform 0.05s, box-shadow 0.05s, background 0.05s; text-decoration: none; display: inline-flex; align-items: center; }
                .xp-button:hover  { background: #fff; }
                .xp-button:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
                .xp-button--primary { background: #ffcc00; }
                .xp-button--primary:hover { background: #ffd633; }
                .project-card { background: #fefefe; border: 3px solid #000; box-shadow: 6px 6px 0 #000; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; overflow: hidden; }
                .project-card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 #000; }
                .project-card:active { transform: translate(2px, 2px); box-shadow: 3px 3px 0 #000; }
                .thumb { border: 2px solid #000; cursor: pointer; opacity: 0.55; transition: opacity 0.15s, transform 0.15s, border-color 0.15s; padding: 0; background: #000; overflow: hidden; }
                .thumb:hover { opacity: 1; }
                .thumb--active { opacity: 1; border-color: #ffcc00; transform: translateY(-2px); }
                        /* Loading Screen Animations */
        @keyframes blink-block {
          0%, 100% { background: #000; }
          50% { background: #00ff15ff; }
        }
        .loading-block {
          width: 24px;
          height: 24px;
          border: 2px solid #000;
          background: #000;
          animation: blink-block 1.8s infinite;
        }
            `}</style>
            {isLoading && (
                <div
                    ref={loadingRef}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#1a1a1a',
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
                        `,
                        backgroundSize: '24px 24px',
                    }}
                >
                    <div className="xp-window" style={{ width: '360px', padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 900, fontSize: '18px', marginBottom: '24px', letterSpacing: '1px' }}>
                            OPENING PROJECTS.EXE
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="loading-block"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>

                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#201f1fff' }}>
                            Please wait while files are loaded...
                        </div>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div className="xp-window">
                    <div className="xp-titlebar">
                        <span>⚙ TECHNICAL_PROJECTS.EXE</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <span className="xp-window-btn">_</span>
                            <span className="xp-window-btn">□</span>
                            <span className="xp-window-btn xp-window-btn--close">✕</span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div style={{
                        padding: '8px 16px',
                        background: '#d6d2c2',
                        borderBottom: '3px solid #000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 8,
                        fontSize: 12,
                        fontWeight: 900,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Link to="/" className="xp-button" style={{ padding: "2px 10px", fontSize: 11 }}>
                                🏠 HOME
                            </Link>
                            {selected && (
                                <button onClick={closeProject} className="xp-button xp-button--primary" style={{ padding: "2px 10px", fontSize: 11 }}>
                                    ◀ BACK
                                </button>
                            )}
                            <span style={{ color: "#000" }}>
                                C:This PC\Documents\Projects\Technical{selected ? `${selected.category}\\${selected.id}` : ""}
                            </span>
                        </div>
                    </div>

                    {/* Content Area (NOW OUTSIDE THE TOOLBAR) */}
                    <div style={{ padding: '20px 20px 24px', background: '#ece9d8' }}>
                        {!selected && <GridView onOpen={openProject} />}
                        {selected && (
                            <div ref={detailRef}>
                                <DetailView
                                    project={selected}
                                    imgIndex={imgIndex}
                                    setImgIndex={setImgIndex}
                                    nextImg={nextImg}
                                    prevImg={prevImg}
                                    mainImgRef={mainImgRef}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

function GridView({ onOpen }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>ALL PROJECTS</h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                        <span key={key} style={{ padding: '2px 8px', fontSize: 10, fontWeight: 900, border: '2px solid #000', background: meta.bg, color: meta.color }}>
                            {meta.label}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {PROJECTS.map((p) => {
                    const cat = CATEGORY_META[p.category]
                    return (
                        <div key={p.id} className="project-card" onClick={() => onOpen(p.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(p.id) }}>
                            <div style={{ position: 'relative', borderBottom: '3px solid #000', aspectRatio: '4/3', background: '#000', overflow: 'hidden' }}>
                                <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', fontSize: 10, fontWeight: 900, border: '2px solid #000', background: cat.bg, color: cat.color }}>
                                    {cat.label}
                                </span>
                                <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', fontSize: 10, fontWeight: 900, border: '2px solid #000', background: '#fff' }}>
                                    {p.year}
                                </span>
                            </div>
                            <div style={{ padding: 12 }}>
                                <h3 style={{ fontWeight: 900, fontSize: 15, lineHeight: 1.15 }}>{p.title}</h3>
                                <p style={{ fontSize: 12, marginTop: 4, color: '#555' }}>{p.blurb}</p>
                                <div style={{ fontSize: 10, fontWeight: 900, marginTop: 8, color: '#0066ff' }}>CLICK TO EXPAND →</div>
                            </div>
                        </div>

                    )
                })}
            </div>
        </div>
    )
}

function DetailView({ project, imgIndex, setImgIndex, nextImg, prevImg, mainImgRef }) {
    const cat = CATEGORY_META[project.category]
    const total = project.images.length
    const hasMultiple = total > 1

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: 24 }} className="detail-grid">
            <div>
                <div style={{ position: 'relative', border: '3px solid #000', boxShadow: '6px 6px 0 #000', aspectRatio: '4/3', background: '#000' }}>
                    <img ref={mainImgRef} src={project.images[imgIndex]} alt={`${project.title} ${imgIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    {hasMultiple && (
                        <>
                            <button onClick={prevImg} aria-label="Previous image" className="xp-button" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', padding: '6px 10px', fontSize: 14, lineHeight: 1 }}>◀</button>
                            <button onClick={nextImg} aria-label="Next image" className="xp-button" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: '6px 10px', fontSize: 14, lineHeight: 1 }}>▶</button>
                        </>
                    )}
                    <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '2px 8px', fontSize: 11, fontWeight: 900, border: '2px solid #000', background: '#ffcc00', color: '#000' }}>
                        {imgIndex + 1} / {total}
                    </div>
                </div>

                {hasMultiple && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                        {project.images.map((img, i) => (
                            <button key={i} onClick={() => setImgIndex(i)} className={`thumb ${i === imgIndex ? 'thumb--active' : ''}`} style={{ width: 76, height: 57, boxShadow: i === imgIndex ? '3px 3px 0 #000' : 'none' }} aria-label={`Show image ${i + 1}`}>
                                <img src={img} alt={`thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 8px', fontSize: 11, fontWeight: 900, border: '2px solid #000', background: cat.bg, color: cat.color }}>{cat.label}</span>
                    <span style={{ padding: '2px 8px', fontSize: 11, fontWeight: 900, border: '2px solid #000', background: '#fff' }}>{project.year}</span>
                </div>

                <h1 style={{ fontWeight: 900, fontSize: 26, lineHeight: 1.1, marginTop: 12 }}>{project.title}</h1>
                <div style={{ borderTop: '3px solid #000', margin: '16px 0' }} />
                <p style={{ fontSize: 13, lineHeight: 1.55, color: '#222' }}>{project.description}</p>

                <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>TECH STACK</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {project.tech.map((t) => (
                            <span key={t} style={{ padding: '4px 8px', fontSize: 11, fontWeight: 700, border: '2px solid #000', background: '#fff', boxShadow: '2px 2px 0 #000' }}>{t}</span>
                        ))}
                    </div>
                </div>

                {(project.repo || project.demo) && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
                        {project.repo && (
                            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="xp-button xp-button--primary">VIEW REPO →</a>
                        )}
                        {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="xp-button">LIVE DEMO →</a>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .detail-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}