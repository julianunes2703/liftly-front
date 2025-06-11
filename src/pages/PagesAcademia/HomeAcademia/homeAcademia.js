import React, { useEffect, useState } from "react";
import "./homeAcademia.css";
import { href, useNavigate } from 'react-router-dom';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";

function HomeAcademia() {
  const navigate = useNavigate();

  return (


    <div className="homeAcademia">
        <Perfil/>

          <Menu
        links={[
            {label: "Home", href: "/homeAcademia"},
            {label: "Cadastrar Aluno", href: "/cadastroAluno"},
            {label: "Cadastrar Aulas", href: "/cadastrarAulas"},
            {label: "Cadastrar Personal Trainer", href: "/cadastroPersonal" }
              ]}
        />

      <div className="img-container">
        <div className="homeAcademia-body">
          <h1>Bem vinda, Academia!</h1>
          <div className="botoes">
            <button onClick={() => navigate("/cadastrarAulas")}>Agendar Aulas</button>
            <button onClick={() => navigate("/cadastroAluno")}>Cadastrar Alunos</button>
            <button onClick={() => navigate("/cadastroPersonal")}>Cadastrar Personal Trainer</button>
          </div>
        </div>
        <div className="img">
          <img src={require('./fotoAcademia.png')} alt="fotoAcademia" />
        </div>
      </div>
    </div>
  );
}

export default HomeAcademia;
