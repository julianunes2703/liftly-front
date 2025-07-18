import React from 'react';
import './buscar.css';
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";


function Buscar({ value, onChange, placeholder = "Buscar...", onSearch }) {
  return (
    <div className="barra-busca">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}

      />
      <button className="botao-buscar" onClick={onSearch}>
            <HiOutlineMagnifyingGlass size={20} />
</button>

    </div>
  );
}

export default Buscar;
