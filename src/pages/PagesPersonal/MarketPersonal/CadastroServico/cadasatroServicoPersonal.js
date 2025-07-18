import React from "react";
import Perfil from "../../../../components/perfil/perfil";
import Menu from "../../../../components/menu-lateral/menu-lateral";
import CadastroServico from "../../../../components/MarketPlace/CadastroServico";
import { href } from "react-router-dom";

function CadastroServicoPersonal(){
    return(
        <div className="cadastro-servico-personal"> 
        <Perfil/>

           <Menu
        links={[
          { label: "Home", href: "/homePersonal" },
          {label: "Criar ficha", href:"/marketPersonalFicha"},
          {label: "Cadastrar Anúncio", href: '/cadastroServicoPersonal'}
        ]}
      />
            <CadastroServico/>
            </div>
    )
}

export default CadastroServicoPersonal;