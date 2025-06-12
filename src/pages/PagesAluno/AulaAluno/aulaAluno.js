import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './aulaAluno.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

const AgendarAulas = () => {
    const [showDays, setShowDays] = useState(false);
    // Podemos inicializar com o dia atual ou 'Todos os Dias' para buscar tudo no início
    const [selectedDay, setSelectedDay] = useState(''); // Estado para filtrar por dia da semana
    const [aulasDisponiveis, setAulasDisponiveis] = useState([]); // Aulas carregadas do back-end
    const [meusAgendamentos, setMeusAgendamentos] = useState([]); // Agendamentos do aluno logado
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros

    // Função para buscar o token do aluno logado
    const getToken = () => {
        // Suponha que o token do ALUNO esteja salvo em 'tokenAluno' no localStorage
        // Você precisará garantir que seu fluxo de login do aluno salve o token como 'tokenAluno'
        const token = localStorage.getItem('token'); // Ou 'tokenAluno' se você usa um nome diferente
        return token;
    };

    // Função para buscar aulas disponíveis do back-end
    const fetchAvailableClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) {
                setError("Você precisa estar logado para ver as aulas.");
                setLoading(false);
                return;
            }

            // Opcional: Pegar o ID da academia do aluno logado (se você tem essa informação no token ou perfil)
            // Ou o aluno pode selecionar a academia para a qual quer ver as aulas.
            // Por simplicidade, vamos deixar sem gymId no início ou adicionar um fixo para teste
            const gymId = "SEU_GYM_ID_FIXO_PARA_TESTE"; // <<--- SUBSTITUA PELO ID REAL DE UMA ACADEMIA QUE TENHA AULAS

            // Construir a URL com o gymId na query, se ele existir
            const url = gymId ? `http://localhost:3001/schedules/available-classes?gymId=${gymId}` : `http://localhost:3001/schedules/available-classes`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAulasDisponiveis(response.data);
        } catch (err) {
            console.error("Erro ao carregar aulas disponíveis:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar aulas. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar os agendamentos do aluno logado
    const fetchMySchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) {
                setError("Você precisa estar logado para ver seus agendamentos.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:3001/schedules`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMeusAgendamentos(response.data);
        } catch (err) {
            console.error("Erro ao carregar meus agendamentos:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar seus agendamentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    // Efeito para carregar aulas e agendamentos quando o componente monta
    useEffect(() => {
        fetchAvailableClasses();
        fetchMySchedules();
    }, []); // Array de dependências vazio para rodar apenas uma vez ao montar

    const toggleDays = () => {
        setShowDays(!showDays);
    };

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setShowDays(false);
        // TODO: Implementar filtro das aulas já carregadas pelo dia selecionado
        // Ou recarregar as aulas do backend com um filtro de dia (mais complexo para agora)
    };

    // Função para Agendar uma aula
    const handleAgendarAula = async (classId) => {
        try {
            const token = getToken();
            if (!token) {
                alert("Você precisa estar logado para agendar aulas.");
                return;
            }

            const response = await axios.post(`http://localhost:3001/schedules/book`, 
                { classId: classId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert(response.data.message); // Exibe mensagem de sucesso do back-end
            fetchAvailableClasses(); // Recarrega as aulas disponíveis para atualizar as vagas
            fetchMySchedules(); // Recarrega meus agendamentos
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao agendar aula. Tente novamente.";
            console.error("Erro ao agendar aula:", err.response?.data || err);
            alert(errorMessage);
        }
    };

    // Função para Cancelar um agendamento
    const handleCancelarAgendamento = async (scheduleId) => {
        try {
            const token = getToken();
            if (!token) {
                alert("Você precisa estar logado para cancelar agendamentos.");
                return;
            }

            const response = await axios.put(`http://localhost:3001/schedules/cancel/${scheduleId}`, 
                {}, // PUT com body vazio ou { status: 'Cancelado' } se o backend esperasse
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert(response.data.message); // Exibe mensagem de sucesso do back-end
            fetchAvailableClasses(); // Recarrega as aulas disponíveis para atualizar as vagas
            fetchMySchedules(); // Recarrega meus agendamentos
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao cancelar agendamento. Tente novamente.";
            console.error("Erro ao cancelar agendamento:", err.response?.data || err);
            alert(errorMessage);
        }
    };

    // Função auxiliar para verificar se uma aula já está agendada pelo usuário logado
    const isAulaAgendada = (classId) => {
        // Verifica se existe algum agendamento para esta aula que não esteja cancelado
        return meusAgendamentos.some(
            (agendamento) => agendamento.classId === classId && agendamento.status !== 'Cancelado'
        );
    };

    // Função auxiliar para obter o ID do agendamento de uma aula específica
    const getScheduleIdForClass = (classId) => {
        const agendamento = meusAgendamentos.find(
            (agendamento) => agendamento.classId === classId && agendamento.status !== 'Cancelado'
        );
        return agendamento ? agendamento.id : null;
    };


    if (loading) return <div className="loading-message">Carregando aulas...</div>;
    if (error) return <div className="error-message">Erro: {error}</div>;

    return (
        <div className="container">
            <Menu
                links={[
                    { label: "Home", href: "/homeAluno" },
                    { label: "Aulas", href: "/aulaAluno" },
                    { label: "Treino", href: "/treinoAluno" },
                    { label: "Dieta", href: "/dietaAluno" },
                    { label: "Liftly Market", href: "/listaProfissionais" }
                ]}
            />
            <h1>Agendar Aulas</h1>

            {/* Selector de Dias */}
            <div className="button" onClick={toggleDays}>
                <span className="button-text">{selectedDay || 'Selecione o Dia'}</span>
                <span className={`arrow ${showDays ? 'arrow-rotate' : ''}`}>↓</span>
            </div>

            {showDays && (
                <ul className="day-list">
                    {['Todos os Dias', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((day) => (
                        <li
                            key={day}
                            onClick={() => handleDaySelect(day)}
                            className="day-list-item"
                        >
                            {day}
                        </li>
                    ))}
                </ul>
            )}

            {/* Detalhes das Aulas Disponíveis */}
            <h2 className="section-title">Aulas Disponíveis</h2>
            <div className="detalhe-aula">
                {aulasDisponiveis.length === 0 ? (
                    <p className="no-classes-message">Nenhuma aula disponível para agendamento.</p>
                ) : (
                    aulasDisponiveis.map((aula) => {
                        const agendada = isAulaAgendada(aula.id);
                        const scheduleId = getScheduleIdForClass(aula.id);
                        const displayStartTime = new Date(aula.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <ul key={aula.id} className="detalhe-aula-list detalhe-aula-row">
                                <li className="detalhe-aula-item"> <CiClock2 className='icons'/>{displayStartTime}</li>
                                <li className="detalhe-aula-item"> <FaListUl className="icons" />{aula.name}</li> {/* Use aula.name */}
                                <li className="detalhe-aula-item"> <FaRegUserCircle className="icons"/>{aula.instructor.name}</li> {/* Use aula.instructor.name */}
                                <li className="detalhe-aula-item"> <IoPeopleSharp className="icons"/>{aula.availableSlots} vagas</li> {/* Exibe vagas disponíveis */}
                                <li className="detalhe-aula-item">
                                    {agendada ? (
                                        <button
                                            className="agendar-btn cancelar"
                                            onClick={() => handleCancelarAgendamento(scheduleId)}
                                        >
                                            Cancelar
                                        </button>
                                    ) : (
                                        <button
                                            className="agendar-btn"
                                            onClick={() => handleAgendarAula(aula.id)}
                                            disabled={aula.isFull} // Desabilita se a aula estiver lotada
                                        >
                                            {aula.isFull ? "Lotada" : "Agendar"}
                                        </button>
                                    )}
                                </li>
                            </ul>
                        );
                    })
                )}
            </div>

            {/* Meus Agendamentos (opcional, mas bom para o aluno ver o que agendou) */}
            <h2 className="section-title">Meus Agendamentos</h2>
            <div className="meus-agendamentos">
                {meusAgendamentos.length === 0 ? (
                    <p className="no-schedules-message">Você não possui agendamentos confirmados.</p>
                ) : (
                    meusAgendamentos.filter(s => s.status === 'Confirmado').map((agendamento) => {
                        const aula = agendamento.class; // A aula está incluída no agendamento
                        const displayStartTime = new Date(aula.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const displayScheduledAt = new Date(agendamento.scheduledAt).toLocaleDateString();

                        return (
                            <ul key={agendamento.id} className="detalhe-agendamento-list detalhe-aula-row">
                                <li className="detalhe-aula-item"> <CiClock2 className='icons'/>{displayStartTime}</li>
                                <li className="detalhe-aula-item"> <FaListUl className="icons" />{aula.name}</li>
                                <li className="detalhe-aula-item"> <FaRegUserCircle className="icons"/>{aula.instructor.name}</li>
                                <li className="detalhe-aula-item">Agendado em: {displayScheduledAt}</li>
                                <li className="detalhe-aula-item">Status: {agendamento.status}</li>
                                <li className="detalhe-aula-item">
                                    {agendamento.status === 'Confirmado' && (
                                        <button
                                            className="agendar-btn cancelar"
                                            onClick={() => handleCancelarAgendamento(agendamento.id)}
                                        >
                                            Cancelar Agendamento
                                        </button>
                                    )}
                                </li>
                            </ul>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AgendarAulas;
