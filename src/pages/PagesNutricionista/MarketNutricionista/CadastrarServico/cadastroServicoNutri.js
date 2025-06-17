import React from "react";
import Perfil from "../../../../components/perfil/perfil";
import Menu from "../../../../components/menu-lateral/menu-lateral";
import CadastroServico from "../../../../components/MarketPlace/CadastroServico";
import { href } from "react-router-dom";

function CadastroServicoNutri(){
    return(
        <div className="cadastro-servico-nutri"> 
        <Perfil/>

            <Menu
            links={[
                {label: "Home", href: "/homeNutricionista"},
                {label: "Criar Dieta", href:"/marketNutricionistaDieta"},
                {label:"Meus Alunos", href:"/marketNutricionistaAlunos"},
                {label: "Cadastrar Anúncio", href:"/cadastroServicoNutri"}
            ]}/>

            <CadastroServico/>
            </div>
    )
}

export default CadastroServicoNutri;