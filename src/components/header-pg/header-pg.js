import React from "react";
import "./header-pg.css";
import LogoLiftly from "../liftly/liftly";

function Header() {
  return (
    <header className="header">
     <LogoLiftly/>
      <nav className="nav-links">
        <a href="/sobre">Sobre</a>
        <a href="/planos">Planos</a>
        <a href="/aulas">Aulas</a>
        <a href="/contato">Contato</a>
      </nav>
    </header>
  );
}

export default Header;
