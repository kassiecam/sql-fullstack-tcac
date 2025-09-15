import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientSearch from "./pages/ClientSearch";
import ClientRegistration from "./pages/ClientRegistration";
import BuildingSelection from "./pages/BuildingSelection";
import Floor from "./pages/Floor";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/buildings" element={<BuildingSelection />} />
        <Route path="/floor" element={<Floor />} />
        <Route path="/register" element={<ClientRegistration />} />
        <Route path="/search" element={<ClientSearch />} />
      </Routes>
    </Router>
  );
}

export default App;

