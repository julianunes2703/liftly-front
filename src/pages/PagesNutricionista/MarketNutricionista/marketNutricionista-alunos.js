import React, { useState }from "react";
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import Buscar from "../../../components/buscar/buscar";
import { href, useNavigate } from 'react-router-dom';

import "./marketNutricionista-alunos.css"

function MarketNutricionistaAlunos(){
     const navigate = useNavigate();

    const [busca, setBusca] = useState("");
    const [alunos, setAlunos] = useState([]);

    const alunosFiltrados = alunos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );
    return(
        <div className="market-personal">
            <Perfil/>

            <Menu
            links={[
                {label: "Home", href: "/homeNutricionista"},
                {label: "Criar Dieta", href:"/marketNutricionistaDieta"},
                {label:"Meus Alunos", href:"/marketNutricionistaAlunos"},
                {label: "Cadastrar Anúncio", href:"/cadastroServicoNutri"}
            ]}/>

            <h1>Liftly Market</h1>

            <Buscar/>

            <div className="alunos">
                <ul>
                <li>Julia</li>
                <li>julianunessouza@gmail.com</li>
                <button className="botao-editar" onClick={() => navigate('/marketNutricionistaDieta')}>Editar</button>
                </ul>
            </div>

        </div>
    )
};

export default MarketNutricionistaAlunos;
