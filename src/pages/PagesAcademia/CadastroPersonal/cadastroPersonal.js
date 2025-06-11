import React, { useState } from 'react';
import { BsTelephone } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from "react-icons/md";
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import './cadastroPersonal.css';
import { href } from 'react-router-dom';

const CadastrarPersonal = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");

  const [personais, setPersonais] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busca, setBusca] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();

    if (!nome || !email || !telefone) {
      setErro("Preencha todos os campos.");
      return;
    }

    const novoPersonal = {
      id: Date.now(),
      nome,
      email,
      telefone
    };

    setPersonais([...personais, novoPersonal]);
    setNome("");
    setEmail("");
    setTelefone("");
    setErro("");

    // Futuro: Enviar dados ao backend
    // fetch('/api/alunos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(novoAluno)
    // });
  };

  const handleRemoverPersonal = (id) => {
    setPersonais(personais.filter(personal => personal.id !== id));

    // Futuro: deletar do backend
    // fetch(`/api/alunos/${id}`, { method: 'DELETE' });
  };

  const personaisFiltrados = personais.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <Perfil />
      <Menu links={[
        { label: "Home", href: "/homeAcademia" },
        { label: "Cadastrar Aulas", href: "/cadastrarAulas" },
        { label: "Cadastrar Aluno", href: "/cadastroAluno" },
        {label: "Cadastrar Personal Trainer", href: "/cadastroPersonal" }
      ]} />

      <div className="cadastro-container">
        <form onSubmit={handleCadastro}>
          <h1 className='cadastro'>Cadastrar Personal Trainer</h1>
          <div className='cadastro-card'>
            <div className="input-field">
              <FaUser className="icon" />
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="input-field">
              <MdOutlineMailOutline className="icon" />
              <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-field">
              <BsTelephone className="icon" />
              <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <button type="submit">Confirmar</button>
            <button type="button" onClick={() => setMostrarModal(true)}>Visualizar Personais Trainers</button>
          </div>
        </form>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Personais Trainers Cadastrados</h2>

            <input
              type="text"
              placeholder="Buscar por nome"
              className="busca-input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            {personaisFiltrados.length === 0 ? (
              <p>Nenhum personal trainer encontrado.</p>
            ) : (
              personaisFiltrados.map((personal) => (
                <div key={personal.id} className="aluno-item">
                  <p><strong>Nome:</strong> {personal.nome}</p>
                  <p><strong>Email:</strong> {personal.email}</p>
                  <p><strong>Telefone:</strong> {personal.telefone}</p>
                  <button className="apagar" onClick={() => handleRemoverPersonal(personal.id)}>Excluir</button>
                </div>
              ))
            )}

            <button className="fechar" onClick={() => setMostrarModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrarPersonal;
