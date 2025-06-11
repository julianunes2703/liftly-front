import React, { useState } from 'react';
import { BsTelephone } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from "react-icons/md";
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import './cadastroAluno.css';

const CadastrarAluno = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");

  const [alunos, setAlunos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busca, setBusca] = useState("");

  const handleCadastro = (e) => {
    e.preventDefault();

    if (!nome || !email || !telefone) {
      setErro("Preencha todos os campos.");
      return;
    }

    const novoAluno = {
      id: Date.now(),
      nome,
      email,
      telefone
    };

    setAlunos([...alunos, novoAluno]);
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

  const handleRemoverAluno = (id) => {
    setAlunos(alunos.filter(aluno => aluno.id !== id));

    // Futuro: deletar do backend
    // fetch(`/api/alunos/${id}`, { method: 'DELETE' });
  };

  const alunosFiltrados = alunos.filter((a) =>
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
          <h1 className='cadastro'>Cadastrar Aluno</h1>
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
            <button type="button" onClick={() => setMostrarModal(true)}>Visualizar Alunos</button>
          </div>
        </form>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Alunos Cadastrados</h2>

            <input
              type="text"
              placeholder="Buscar por nome"
              className="busca-input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            {alunosFiltrados.length === 0 ? (
              <p>Nenhum aluno encontrado.</p>
            ) : (
              alunosFiltrados.map((aluno) => (
                <div key={aluno.id} className="aluno-item">
                  <p><strong>Nome:</strong> {aluno.nome}</p>
                  <p><strong>Email:</strong> {aluno.email}</p>
                  <p><strong>Telefone:</strong> {aluno.telefone}</p>
                  <button className="apagar" onClick={() => handleRemoverAluno(aluno.id)}>Excluir</button>
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

export default CadastrarAluno;
