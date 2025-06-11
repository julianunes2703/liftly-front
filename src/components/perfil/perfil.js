import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./perfil.css";

function Perfil() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="perfil-container" ref={ref}>
      <div className="perfil-button" onClick={() => setOpen(!open)}>
        <FaUser />
        <FaChevronDown className={`seta ${open ? "girar" : ""}`} />
      </div>

      {open && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/editarPerfil")}>Editar Perfil</button>
          <button onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>Sair</button>
        </div>
      )}
    </div>
  );
}

export default Perfil;
