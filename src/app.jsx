import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import TechnicalProjects from "./pages/TechnicalProjects";
import ScrollToTop from "./components/Scrolltotop.jsx";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technical" element={<TechnicalProjects />} />
      </Routes>
    </>
  );
};

export default App;
