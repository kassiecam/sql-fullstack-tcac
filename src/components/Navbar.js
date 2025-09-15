import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
    return (
        <nav>
            <Link to="/">Login</Link> {" "}
            <Link to="/buildings">Building Selection</Link> {" "}
            <Link to="/floor">Floor</Link> {" "}
            <Link to="/register">Client Registration</Link> {" "}
            <Link to="/search">Client Search</Link>
        </nav>
    );
}

export default Navbar;
