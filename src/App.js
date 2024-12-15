import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Signup from "./Pages/signup";
import Login from "./Pages/Login";
import Gui from "./Pages/gui";
import HamburgerMenu from "./components/HamburgerMenu";
import About from "./components/about";
import Contact from "./components/contact";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/gui" element={<Gui />} /> 
        <Route path="/HamburgerMenu" element={<HamburgerMenu />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
