import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './aulaAluno.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

const AgendarAulas = () => {
    const [aulasDisponiveis, setAulasDisponiveis] = useState([]);
    const [meusAgendamentos, setMeusAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token');

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

            const responseGym = await axios.get('http://localhost:3001/usergym/my-gym', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const gymId = responseGym.data.gymId;

            const response = await axios.get(`http://localhost:3001/schedules/available-classes?gymId=${gymId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAulasDisponiveis(response.data);
        } catch (err) {
            console.error("Erro ao carregar aulas disponíveis:", err);
            setError("Erro ao buscar aulas disponíveis");
        } finally {
            setLoading(false);
        }
    };

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
                headers: { Authorization: `Bearer ${token}` }
            });
            setMeusAgendamentos(response.data);
        } catch (err) {
            console.error("Erro ao carregar meus agendamentos:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar seus agendamentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableClasses();
        fetchMySchedules();
    }, []);

    const handleAgendarAula = async (classId) => {
        try {
            const token = getToken();
            if (!token) {
                alert("Você precisa estar logado para agendar aulas.");
                return;
            }

            const response = await axios.post(`http://localhost:3001/schedules/book`,
                { classId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert(response.data.message);
            fetchAvailableClasses();
            fetchMySchedules();
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao agendar aula. Tente novamente.";
            console.error("Erro ao agendar aula:", err.response?.data || err);
            alert(errorMessage);
        }
    };

    const handleCancelarAgendamento = async (scheduleId) => {
        try {
            const token = getToken();
            if (!token) {
                alert("Você precisa estar logado para cancelar agendamentos.");
                return;
            }

            const response = await axios.put(`http://localhost:3001/schedules/cancel/${scheduleId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            fetchAvailableClasses();
            fetchMySchedules();
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao cancelar agendamento. Tente novamente.";
            console.error("Erro ao cancelar agendamento:", err.response?.data || err);
            alert(errorMessage);
        }
    };

    const isAulaAgendada = (classId) => {
        return meusAgendamentos.some(
            (agendamento) => agendamento.classId === classId && agendamento.status !== 'Cancelado'
        );
    };

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

            <h2 className="section-title">Aulas Disponíveis</h2>
            <div className="detalhe-aula">
                {aulasDisponiveis.length === 0 ? (
                    <p className="no-classes-message">Nenhuma aula disponível para agendamento.</p>
                ) : (
                    aulasDisponiveis.map((aula) => {
                        const agendada = isAulaAgendada(aula.id);
                        const scheduleId = getScheduleIdForClass(aula.id);
                        const displayStartTime = new Date(aula.startTime).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={aula.id} className="aula-card">
                                <ul className="detalhe-aula-list detalhe-aula-row">
                                    <li className="detalhe-aula-item"> <CiClock2 className='icons' />{displayStartTime}</li>
                                    <li className="detalhe-aula-item"> <FaListUl className="icons" />{aula.name}</li>
                                    <li className="detalhe-aula-item"> <FaRegUserCircle className="icons" />{aula.instructor.name}</li>
                                    <li className="detalhe-aula-item"> <IoPeopleSharp className="icons" />{aula.availableSlots} vagas</li>
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
                                                disabled={aula.isFull}
                                            >
                                                {aula.isFull ? "Lotada" : "Agendar"}
                                            </button>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AgendarAulas;
