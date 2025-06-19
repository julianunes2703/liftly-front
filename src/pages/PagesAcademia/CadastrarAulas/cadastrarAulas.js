import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import './cadastrarAulas.css';

export default function CadastrarAulas() {
  const [horario, setHorario] = useState("");
  const [nomeAula, setNomeAula] = useState("");
  const [nomeProfessor, setNomeProfessor] = useState("");
  const [lotacao, setLotacao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [erro, setErro] = useState("");
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoAulaId, setEditandoAulaId] = useState(null);
   const [mostrarModal, setMostrarModal] = useState(false);
   const [professores, setProfessores] = useState([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState("");

  // Puxa o token salvo no localStorage
  const getToken = () => localStorage.getItem('tokenAcademia');


  // Busca as aulas da academia
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setErro("");
    const token = getToken();
    if (!token) {
      setErro("Você precisa estar logado como Academia para gerenciar aulas.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/classes', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
             }

      });
      setAulas(response.data);
    } catch (err) {
      console.error("Erro ao carregar aulas:", err);
      setErro(err.response?.data?.error || "Erro ao carregar aulas.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega as aulas no mount
    useEffect(() => {
            fetchClasses();
            fetchProfessores();
        }, []);


  // Cadastra ou atualiza uma aula
  const handleCadastro = async e => {
    e.preventDefault();
    if (!horario || !nomeAula || !selectedProfessorId || !lotacao || !duracao) {
      setErro("Preencha todos os campos!");
      return;
    }
    const token = getToken();
    if (!token) {
      setErro("Você precisa estar logado como Academia para cadastrar/atualizar aulas.");
      return;
    }
    const classData = {
      name: nomeAula,
      instructorId: selectedProfessorId,
      startTime: horario,
      duration: parseInt(duracao, 10),
      maxCapacity: parseInt(lotacao, 10)
    };
    try {
      if (editandoAulaId) {
        await axios.put(
          `http://localhost:3001/classes/${editandoAulaId}`,
          classData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Aula atualizada com sucesso!");
      } else {
        await axios.post(
          'http://localhost:3001/classes',
          classData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Aula cadastrada com sucesso!");
      }
      // limpa e recarrega
      setHorario("");
      setNomeAula("");
      setNomeProfessor("");
      setLotacao("");
      setDuracao("");
      setEditandoAulaId(null);
      setErro("");
      fetchClasses();
    } catch (err) {
      console.error("Erro ao gerenciar aula:", err);
      setErro(err.response?.data?.error || "Erro desconhecido ao gerenciar aula.");
    }
  };

  // Exclui aula
  const handleApagar = async classId => {
    if (!window.confirm("Tem certeza que deseja apagar esta aula?")) return;
    const token = getToken();
    if (!token) {
      setErro("Você precisa estar logado como Academia para apagar aulas.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Aula apagada com sucesso!");
      fetchClasses();
    } catch (err) {
      console.error("Erro ao apagar aula:", err);
      setErro(err.response?.data?.error || "Erro ao apagar aula.");
    }
  };

  // Prepara edição
  const handleEditar = aula => {
    setHorario(new Date(aula.startTime).toISOString().slice(0,16));
    setNomeAula(aula.name);
    setNomeProfessor(aula.instructor.name);
    setLotacao(aula.maxCapacity.toString());
    setDuracao(aula.duration.toString());
    setEditandoAulaId(aula.id);
  };

     const fetchProfessores = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:3001/gyms/trainers', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const professoresExtraidos = response.data
            .filter(p => p)
            .map(p => ({
              id: p.id,
              name: p.name,
              email: p.email
            }));

            console.log("Professores recebidos:", response.data);


          setProfessores(professoresExtraidos);
        } catch (err) {
          console.error('Erro ao buscar professores:', err);
        }
      };



  if (loading) return <div className="loading-message">Carregando aulas...</div>;

  return (
    <div>
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homeAcademia" },
          { label: "Cadastrar Aluno", href: "/cadastroAluno" },
          { label: "Cadastrar Aulas", href: "/cadastrarAulas" },
          { label: "Cadastrar Personal Trainer", href: "/cadastroPersonal" }
        ]}
      />

      <div className="cadastro-container">
        <form onSubmit={handleCadastro}>
          <h1>{editandoAulaId ? "Editar Aula" : "Cadastrar Aulas"}</h1>
          <div className="cadastro-card">
            <div className="input-field">
              <CiClock2 className="icon"/>
              <input
                type="datetime-local"
                value={horario}
                onChange={e => setHorario(e.target.value)}
              />
            </div>
            <div className="input-field">
              <FaListUl className="icon"/>
              <input
                type="text"
                placeholder="Nome Aula"
                value={nomeAula}
                onChange={e => setNomeAula(e.target.value.trim())}
              />
            </div>
              <div className="input-field">
                  <FaRegUserCircle className="icon"/>
               <select value={selectedProfessorId} onChange={e => setSelectedProfessorId(e.target.value)}>
                  <option value="">Selecione o professor</option>
                  {professores.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

            <div className="input-field">
              <IoPeopleSharp className="icon"/>
              <input
                type="number"
                placeholder="Lotação Máxima"
                value={lotacao}
                onChange={e => setLotacao(e.target.value)}
              />
            </div>
            <div className="input-field">
              <CiClock2 className="icon"/>
              <input
                type="number"
                placeholder="Duração (minutos)"
                value={duracao}
                onChange={e => setDuracao(e.target.value)}
              />
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="botoes-container">
              <button type="submit">
                {editandoAulaId ? "Atualizar Aula" : "Confirmar Cadastro"}
              </button>
              {editandoAulaId && (
                <button
                  type="button"
                  onClick={() => {
                    setHorario("");
                    setNomeAula("");
                    setNomeProfessor("");
                    setLotacao("");
                    setDuracao("");
                    setEditandoAulaId(null);
                    setErro("");
                  }}
                >
                  Cancelar Edição
                </button>
              )}
              <button
                type="button"
                onClick={() => setMostrarModal(true)}
              >
                Visualizar Aulas
              </button>
            </div>
          </div>
        </form>

        {/* Modal simples de visualização */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Aulas Cadastradas</h2>
              {aulas.map(aula => (
                <div key={aula.id} className="aula-item">
                  <p><strong>Aula:</strong> {aula.name}</p>
                  <p><strong>Professor:</strong> {aula.instructor?.name || 'Indefinido'}</p>
                  <p><strong>Horário:</strong> {new Date(aula.startTime).toLocaleString()}</p>
                  <p><strong>Duração:</strong> {aula.duration} min</p>
                  <p><strong>Lotação:</strong> {aula.maxCapacity} alunos</p>
                  <div className="modal-buttons">
                    <button onClick={() => handleEditar(aula)}>Editar</button>
                    <button onClick={() => handleApagar(aula.id)}>Apagar</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setMostrarModal(false)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
