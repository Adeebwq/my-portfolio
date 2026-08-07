import Hero from "./components/sections/hero.jsx";
import About from "./components/sections/about.jsx";
import Desktop from "./components/sections/desktop.jsx";
import PixelBackground from "./components/PixelBackground.jsx";

const App = () => {
  return (
    <>
      <PixelBackground />
      <Hero />
      <About />
      <Desktop />
    </>
  );
};

export default App;
