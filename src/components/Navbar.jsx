import React from 'react';

const Navbar = ({ setContactOpen }) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 👇 NEW FUNCTION: Scrolls to desktop, then opens popup
    const handleContactClick = () => {
        setContactOpen(true);
        scrollToSection('desktop');
    };

    const linkClass = "relative group text-black uppercase tracking-widest text-xs md:text-base font-bold cursor-pointer transition-colors hover:text-gray-600";
    const underlineClass = "absolute left-0 bottom-[-4px] w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out";

    return (
        <nav
            className="fixed top-0 left-0 w-full z-[99999] flex justify-center gap-3 md:gap-10 px-2 py-4 md:py-8 flex-wrap"
            style={{
                fontFamily: "'Bitcount Prop double'",
            }}
        >
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={linkClass}>
                Home
                <span className={underlineClass}></span>
            </button>

            <button onClick={() => scrollToSection('about')} className={linkClass}>
                About Me
                <span className={underlineClass}></span>
            </button>

            <button onClick={() => scrollToSection('desktop')} className={linkClass}>
                Projects
                <span className={underlineClass}></span>
            </button>

            {/* 👇 CHANGED TO USE THE NEW FUNCTION 👇 */}
            <button onClick={handleContactClick} className={linkClass}>
                Contact Me
                <span className={underlineClass}></span>
            </button>
        </nav>
    );
};

export default Navbar;