import React, { useState }from "react";
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import Buscar from "../../../components/buscar/buscar";
import {useNavigate } from 'react-router-dom';


import "./marketPersonal-alunos.css"


function MarketPersonalAlunos(){
     const navigate = useNavigate();

    return(
        <div className="market-personal">
            <Perfil/>

            <Menu
            links={[
                {label: "Home", href: "/homePersonal"},
                {label: "Criar Ficha", href:'/marketPersonalFicha'},
                {label:"Meus Alunos", href:"/marketPersonalAlunos"}
            ]}/>

            <h1>Liftly Market</h1>

                <Buscar/>

            <div className="alunos">
                <ul>
                <li> Julia </li>
                <li>julianunessouza@gmail.com</li>
                <button className="botao-editar" onClick={() => navigate('/marketPersonalFicha')}>Editar</button>
                </ul>
            </div>

        </div>
    )
};

export default MarketPersonalAlunos
