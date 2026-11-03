import { useState } from "react"; // <-- Make sure this is here!
import Hero from "../components/sections/hero.jsx";
import About from "../components/sections/about.jsx";
import Desktop from "../components/sections/desktop.jsx";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
    // 👇 THIS IS THE MISSING LINE CAUSING THE CRASH 👇
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <>
            <Navbar setContactOpen={setContactOpen} />
            <Hero />
            <About />
            {/* Passing the state down to the Desktop component */}
            <Desktop contactOpen={contactOpen} setContactOpen={setContactOpen} />
        </>
    );
};

export default Home;