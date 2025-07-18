import React, { useEffect, useState } from "react";
import "./homeNutricionista.css";
import { href, useNavigate } from 'react-router-dom';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";

function HomeNutricionista() {
  const navigate = useNavigate();

  return (


    <div className="homeNutricionista">
        <Perfil/>

           <Menu
            links={[
                {label: "Home", href: "/homeNutricionista"},
                {label: "Criar Dieta", href:"/marketNutricionistaDieta"},
                {label: "Cadastrar Anúncio", href:"/cadastroServicoNutri"}
            ]}/>

      <div className="img-container">
        <div className="homeNutricionista-body">
          <h1>Bem vinda, Nutri!</h1>
          <div className="botoes">
            <button onClick={() => navigate("/marketNutricionistaDieta")}>Criar Dieta</button>
            <button onClick={() => navigate("/cadastroServicoNutri")}> Cadastrar Novo Anúncio</button>
          </div>
        </div>
        <div className="img">
          <img src={require('./fotoNutricionista.png')} alt="fotoNutricionista" />
        </div>
      </div>
    </div>
  );
}

export default HomeNutricionista;
