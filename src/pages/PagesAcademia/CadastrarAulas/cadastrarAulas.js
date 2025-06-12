import React, { useState, useEffect } from 'react'; // Importado useEffect
import axios from 'axios'; // Importado axios
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

import Menu from '../../../components/menu-lateral/menu-lateral';
import './cadastrarAulas.css';
import Perfil from '../../../components/perfil/perfil';

const CadastrarAulas = () => {
    // Estados do formulário, aplicando .trim() nos setters para garantir dados limpos
    const [horario, setHorario] = useState("");
    const [nomeAula, setNomeAula] = useState("");
    const [nomeProfessor, setNomeProfessor] = useState(""); // Este será instructorName para o backend
    const [lotacao, setLotacao] = useState(""); // Este será maxCapacity para o backend
    const [duracao, setDuracao] = useState(""); // Adicionado campo para duração da aula
    const [erro, setErro] = useState("");
    const [aulas, setAulas] = useState([]); // Aulas carregadas/gerenciadas do back-end
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [editandoAulaId, setEditandoAulaId] = useState(null); // Para saber qual aula está sendo editada

    // Função auxiliar para obter o token da academia logada
    const getToken = () => {
        const token = localStorage.getItem('tokenAcademia'); // Supondo que o token da academia esteja salvo aqui
        return token;
    };

    // Função para carregar as aulas da academia do back-end
    const fetchClasses = async () => {
        setLoading(true);
        setErro(null);
        try {
            const token = getToken();
            if (!token) {
                setErro("Você precisa estar logado como Academia para gerenciar aulas.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:3001/gyms/classes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAulas(response.data); // Popula o estado 'aulas' com as aulas do back-end
        } catch (err) {
            console.error("Erro ao carregar aulas:", err.response?.data || err);
            setErro(err.response?.data?.error || "Erro ao carregar aulas. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Efeito para carregar as aulas quando o componente é montado
    useEffect(() => {
        fetchClasses();
    }, []); // Array de dependências vazio para rodar apenas uma vez

    // Função para Cadastrar ou Atualizar Aula
    const handleCadastro = async (e) => {
        e.preventDefault();

        // Validação inicial dos campos (já 'trimados' pelo onChange)
        if (!horario || !nomeAula || !nomeProfessor || !lotacao || !duracao) {
            setErro("Preencha todos os campos!");
            return;
        }

        const token = getToken();
        if (!token) {
            setErro("Você precisa estar logado como Academia para cadastrar/atualizar aulas.");
            return;
        }

        // Mapeia os campos do front-end para os nomes esperados pelo back-end (Class model)
        const classData = {
            name: nomeAula, // Mapeia nomeAula para 'name'
            instructorName: nomeProfessor, // Mapeia nomeProfessor para 'instructorName'
            startTime: horario, // Mapeia horario para 'startTime'
            duration: parseInt(duracao, 10), // Converte duração para número
            maxCapacity: parseInt(lotacao, 10) // Converte lotacao para número
        };

        try {
            if (editandoAulaId) {
                // Se estiver editando, faz um PUT
                const response = await axios.put(`http://localhost:3001/gyms/classes/${editandoAulaId}`, classData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert(response.data.message);
                setEditandoAulaId(null); // Reseta o ID de edição
            } else {
                // Se não estiver editando, faz um POST para nova aula
                const response = await axios.post(`http://localhost:3001/gyms/classes`, classData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert(response.data.message);
            }

            // Após sucesso, recarrega a lista de aulas e limpa o formulário
            fetchClasses();
            setHorario("");
            setNomeAula("");
            setNomeProfessor("");
            setLotacao("");
            setDuracao("");
            setErro("");
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido ao gerenciar aula.';
            console.error("Erro ao gerenciar aula:", err.response?.data || err);
            setErro(errorMessage);
            alert(`Erro: ${errorMessage}`);
        }
    };

    // Função para apagar uma aula
    const handleApagar = async (classId) => {
        if (!window.confirm("Tem certeza que deseja apagar esta aula? Isso removerá todos os agendamentos vinculados.")) {
            return; // Confirmação do usuário
        }

        try {
            const token = getToken();
            if (!token) {
                setErro("Você precisa estar logado como Academia para apagar aulas.");
                return;
            }

            await axios.delete(`http://localhost:3001/gyms/classes/${classId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Aula apagada com sucesso!");
            fetchClasses(); // Recarrega a lista de aulas
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido ao apagar aula.';
            console.error("Erro ao apagar aula:", err.response?.data || err);
            setErro(errorMessage);
            alert(`Erro: ${errorMessage}`);
        }
    };

    // Função para preencher o formulário para edição
    const handleEditar = (aula) => {
        setHorario(new Date(aula.startTime).toISOString().slice(0, 16)); // Formata para datetime-local
        setNomeAula(aula.name);
        setNomeProfessor(aula.instructor.name); // Pega o nome do instrutor
        setLotacao(aula.maxCapacity.toString()); // Converte para string
        setDuracao(aula.duration.toString()); // Converte para string
        setEditandoAulaId(aula.id); // Define o ID da aula que está sendo editada
        setMostrarModal(false); // Fecha o modal
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
                    <h1 className='cadastro'>{editandoAulaId ? "Editar Aula" : "Cadastrar Aulas"}</h1>

                    <div className='cadastro-card'>
                        <div className="input-field">
                            <CiClock2 className="icon" />
                            {/* Horário: Usar input type="datetime-local" para facilitar a data e hora */}
                            <input
                                type="datetime-local" // Tipo de input para data e hora
                                placeholder="Horário (AAAA-MM-DDTHH:mm)"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)} // Não precisa de trim aqui
                            />
                        </div>

                        <div className="input-field">
                            <FaListUl className="icon" />
                            <input
                                type="text"
                                placeholder="Nome Aula"
                                value={nomeAula}
                                onChange={(e) => setNomeAula(e.target.value.trim())} // Aplica trim
                            />
                        </div>

                        <div className="input-field">
                            <FaRegUserCircle className="icon" />
                            <input
                                type="text"
                                placeholder="Nome Professor"
                                value={nomeProfessor}
                                onChange={(e) => setNomeProfessor(e.target.value.trim())} // Aplica trim
                            />
                        </div>

                        <div className="input-field">
                            <IoPeopleSharp className="icon" />
                            <input
                                type="number" // Lotação é um número
                                placeholder="Lotação Máxima"
                                value={lotacao}
                                onChange={(e) => setLotacao(e.target.value)} // Não precisa de trim, mas converter para número
                            />
                        </div>

                        <div className="input-field">
                            <CiClock2 className="icon" /> {/* Reutilizando ícone, pode ser outro */}
                            <input
                                type="number" // Duração é um número
                                placeholder="Duração (minutos)"
                                value={duracao}
                                onChange={(e) => setDuracao(e.target.value)} // Não precisa de trim, mas converter para número
                            />
                        </div>

                        {erro && <p className="error-message">{erro}</p>}

                        <div className="botoes-container">
                            <button type="submit">{editandoAulaId ? "Atualizar Aula" : "Confirmar Cadastro"}</button>
                            {editandoAulaId && (
                                <button type="button" onClick={() => {
                                    setEditandoAulaId(null);
                                    setHorario("");
                                    setNomeAula("");
                                    setNomeProfessor("");
                                    setLotacao("");
                                    setDuracao("");
                                    setErro("");
                                }}>
                                    Cancelar Edição
                                </button>
                            )}
                            <button type="button" className="visualizar-btn" onClick={() => setMostrarModal(true)}>
                                Visualizar Aulas
                            </button>
                        </div>

                    </div>
                </form>
            </div>

            {/* Modal de Visualização de Aulas */}
            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Aulas Cadastradas</h2>
                        {aulas.length === 0 ? (
                            <p>Nenhuma aula cadastrada.</p>
                        ) : (
                            aulas.map((aula) => (
                                <div key={aula.id} className="aula-item">
                                    <p><strong>Aula:</strong> {aula.name}</p> {/* Usa aula.name */}
                                    <p><strong>Professor:</strong> {aula.instructor.name}</p> {/* Usa aula.instructor.name */}
                                    <p><strong>Horário:</strong> {new Date(aula.startTime).toLocaleString()}</p> {/* Formata a data */}
                                    <p><strong>Duração:</strong> {aula.duration} min</p>
                                    <p><strong>Lotação:</strong> {aula.maxCapacity} alunos</p>
                                    <div className="modal-buttons">
                                        <button onClick={() => handleEditar(aula)}>Editar</button>
                                        <button onClick={() => handleApagar(aula.id)}>Apagar</button>
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
