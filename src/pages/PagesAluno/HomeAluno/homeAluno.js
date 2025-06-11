import React, { useEffect, useState } from "react";
import "./homeAluno.css";
import { href, Link, useNavigate } from 'react-router-dom';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";

function HomeAluno() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');


  useEffect(() => {
    const userSalvo = localStorage.getItem('user');
    if (userSalvo) {
      const user = JSON.parse(userSalvo);
      setNome(user.name); 
    }
  }, []);




  return (


    <div className="homeAluno">
        <Perfil/>

          <Menu
        links={[
            { label: "Home", href: "/homeAluno"},
            {label: "Aulas", href:"/aulaAluno"},
            {label: "Treino", href: "/treinoAluno"},
            {label: "Dieta", href: "/dietaAluno" },
            {label: "Liftly Market", href: "/listaProfissionais"}
              ]}
        />

      <div className="img-container">
        <div className="homeAluno-body">
          <h1>Bem vindo!</h1>
          <div className="botoes">
            <button onClick={() => navigate("/treinoAluno")}>Inicial Treino</button>
            <button onClick={() => navigate("/dietaAluno")}>Visualizar Dieta</button>
            <button onClick={() => navigate("/aulaAluno")}>Agendar Aula</button>
          </div>
        </div>
        <div className="img">
          <img src={require('./fotoAluno (2).png')} alt="fotoAluno" />
        </div>
      </div>
    </div>
  );
}

export default HomeAluno;
