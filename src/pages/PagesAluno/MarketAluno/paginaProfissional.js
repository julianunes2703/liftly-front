import React from 'react';
import './paginaProfissional.css';
import Perfil from '../../../components/perfil/perfil';
import Menu from '../../../components/menu-lateral/menu-lateral';
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";

function PaginaProfissional() {
  const profissional = {
    nome: "Julia",
    idade: 33,
    nota: 4.8,
    descricao: "Eu sou a Julia, formada em Ed.Física na UFSJ e quero te ajudar a alcançar seus objetivos."
  };

  return (
    <div className="pagina-profissional">
        <Perfil/>
                   <Menu
                links={[
                  { label: "Dietas", href: '/listaProfissionais'},
                  { label: "Treinos", href: '/listaProfissionais' }
                ]}
              />
        
        
              <h1>Liftly Market</h1>

      <div className="cabecalho">
        <div className="info-profissional">
          <div className="avatar"><LuUser /></div>
          <div className="dados">
            <strong>{profissional.nome}</strong>
            <p>{profissional.idade} anos</p>
            <p className="nota">{profissional.nota} <FaStar /></p>
          </div>
        </div>
        <button className="btn-contato">Entrar em contato</button>
      </div>

      <hr className="divisor" />

      <p className="descricao">
        <strong>Descrição:</strong> {profissional.descricao}
      </p>
    </div>
  );
}

export default PaginaProfissional;