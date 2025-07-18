import React, { useEffect, useState } from "react";
import "./homePersonal.css";
import { href, useNavigate } from 'react-router-dom';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";

function HomePersonal() {
  const navigate = useNavigate();

  return (


    <div className="homePersonal">
        <Perfil/>

          <Menu
        links={[
            { label: "Home", href: "/homePersonal"},
            { label: "Criar ficha", href: "/marketPersonalFicha" },
            { label: "Cadastrar Anúncio", href: "/cadastroServicoPersonal" },

              ]}/>

      <div className="img-container">
        <div className="homePersonal-body">
          <h1>Bem vindo, Personal!</h1>
          <div className="botoes">
            <button onClick={() => navigate("/marketPersonalFicha")}>Criar Ficha</button>
              <button onClick={() => navigate("/cadastroServicoPersonal")}>Cadastrar Novo Anúncio</button>
          </div>
        </div>
        <div className="img">
          <img src={require('./fotoPersonal.png')} alt="fotoPersonal" />
        </div>
      </div>
    </div>
  );
}

export default HomePersonal;
