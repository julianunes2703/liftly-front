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
            {label: "Liftly Market", href: "/MarketPersonalFicha"}
              ]}/>

      <div className="img-container">
        <div className="homePersonal-body">
          <h1>Bem vindo, Personal!</h1>
          <div className="botoes">
            <button onClick={() => navigate("/marketPersonalAlunos")}>Lista de alunos</button>
            <button onClick={() => navigate("/marketPersonalFicha")}>Liftly Market</button>
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
