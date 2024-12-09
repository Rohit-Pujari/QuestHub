import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./index.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";

function App() {
  interface NavLink {
    name: string;
    path: string;
    element: React.FC;
  }

  const navLinks: NavLink[] = [
    { name: "Home", path: "/", element: Home},
    { name: "About", path: "/about", element: About},
    { name: "Features", path: "/features", element: Features },
    { name: "Contact", path: "/contact", element: Contact},
  ];

  return (
    <BrowserRouter>
      {/* Pass navLinks as prop to NavBar */}
      <NavBar navLinks={navLinks} />
      <Routes>
        {/* Define routes for each path */}
        {navLinks.map(navLink => (
          <Route key={navLink.path} path={navLink.path} element={<navLink.element />}/>
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
