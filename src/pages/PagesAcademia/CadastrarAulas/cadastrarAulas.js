import React, { useState } from 'react';
import { href, useNavigate } from 'react-router-dom';
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

import Menu from '../../../components/menu-lateral/menu-lateral';
import './cadastrarAulas.css';
import Perfil from '../../../components/perfil/perfil';

const CadastrarAulas = () => {
  const [horario, setHorario] = useState("");
  const [nomeAula, setNomeAula] = useState("");
  const [nomeProfessor, setNomeProfessor] = useState("");
  const [lotacao, setLotacao] = useState("");
  const [erro, setErro] = useState("");
  const [aulas, setAulas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    if (!horario || !nomeAula || !nomeProfessor || !lotacao) {
      setErro("Preencha todos os campos!");
      return;
    }

    const novaAula = { horario, nomeAula, nomeProfessor, lotacao };
    setAulas([...aulas, novaAula]);

    // Limpa os campos
    setHorario("");
    setNomeAula("");
    setNomeProfessor("");
    setLotacao("");
    setErro("");
  };

  const handleApagar = (index) => {
    const novas = [...aulas];
    novas.splice(index, 1);
    setAulas(novas);
  };

  const handleEditar = (index) => {
    const aula = aulas[index];
    setHorario(aula.horario);
    setNomeAula(aula.nomeAula);
    setNomeProfessor(aula.nomeProfessor);
    setLotacao(aula.lotacao);

    const novas = [...aulas];
    novas.splice(index, 1); // Remove temporariamente
    setAulas(novas);
    setMostrarModal(false);
  };

  return (
    <div>
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homeAcademia" },
          { label: "Cadastrar Aluno", href: "/cadastroAluno" },
          {label: "Cadastrar Aulas", href: "/cadastrarAulas"},
          {label: "Cadastrar Personal Trainer", href: "/cadastroPersonal" }
        ]}
      />

      <div className="cadastro-container">
        <form onSubmit={handleCadastro}>
          <h1 className='cadastro'>Cadastrar Aulas</h1>

          <div className='cadastro-card'>
            <div className="input-field">
              <CiClock2 className="icon" />
              <input
                type="text"
                placeholder="Horário"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>

            <div className="input-field">
              <FaListUl className="icon" />
              <input
                type="text"
                placeholder="Nome Aula"
                value={nomeAula}
                onChange={(e) => setNomeAula(e.target.value)}
              />
            </div>

            <div className="input-field">
              <FaRegUserCircle className="icon" />
              <input
                type="text"
                placeholder="Nome Professor"
                value={nomeProfessor}
                onChange={(e) => setNomeProfessor(e.target.value)}
              />
            </div>

            <div className="input-field">
              <IoPeopleSharp className="icon" />
              <input
                type="text"
                placeholder="Lotação"
                value={lotacao}
                onChange={(e) => setLotacao(e.target.value)}
              />
            </div>

            {erro && <p className="error-message">{erro}</p>}

           <div className="botoes-container">
                <button type="submit">Confirmar</button>
                <button type="button" className="visualizar-btn" onClick={() => setMostrarModal(true)}>
                    Visualizar aulas
                </button>
            </div>

          </div>
        </form>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Aulas Cadastradas</h2>
            {aulas.length === 0 ? (
              <p>Nenhuma aula cadastrada.</p>
            ) : (
              aulas.map((aula, index) => (
                <div key={index} className="aula-item">
                  <p><strong>Aula:</strong> {aula.nomeAula}</p>
                  <p><strong>Professor:</strong> {aula.nomeProfessor}</p>
                  <p><strong>Horário:</strong> {aula.horario}</p>
                  <p><strong>Lotação:</strong> {aula.lotacao}</p>
                  <div className="modal-buttons">
                    <button onClick={() => handleEditar(index)}>Editar</button>
                    <button onClick={() => handleApagar(index)}>Apagar</button>
                  </div>
                </div>
              ))
            )}
            <div className="modal-buttons">
            <button onClick={() => setMostrarModal(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrarAulas;
