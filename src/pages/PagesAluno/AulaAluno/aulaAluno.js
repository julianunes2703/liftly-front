import React, { useState } from 'react';
import './aulaAluno.css'; 
import Menu from '../../../components/menu-lateral/menu-lateral';
import { CiClock2 } from "react-icons/ci";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";


const AgendarAulas = () => {
  const [showDays, setShowDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Segunda-feira');
  const [agendamentos, setAgendamentos] = useState({});
  const [aulas, setAulas] = useState([
    { id: 1, nome: "Yoga", horario: "08:00", instrutor: "Maria", vagas: 10 },
  ]);

  const toggleDays = () => {
    setShowDays(!showDays);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setShowDays(false);
  };

  const toggleAgendamento = (id) => {
    setAulas((prevAulas) =>
      prevAulas.map((aula) => {
        if (aula.id === id) {
          return {
            ...aula,
            vagas: agendamentos[id] ? aula.vagas + 1 : aula.vagas - 1,
          };
        }
        return aula;
      })
    );

    setAgendamentos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container">
         <Menu
             links={[
                 { label: "Home", href: "/homeAluno"},
                 {label: "Aulas", href:"/aulaAluno"},
                 {label: "Treino", href: "/treinoAluno"},
                 {label: "Dieta", href: "/dietaAluno" },
                 {label: "Liftly Market", href: "/listaProfissionais"}
                   ]}
             />
      <h1>Agendar Aulas</h1>

      <div className="button" onClick={toggleDays}>
        <span className="button-text">{selectedDay}</span>
        <span className={`arrow ${showDays ? 'arrow-rotate' : ''}`}>↓</span>
      </div>

      {showDays && (
        <ul className="day-list">
          {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((day) => (
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

      <div className="detalhe-aula">
       
        {/* Aqui mapeia as aulas */}
        {aulas.map((aula) => (
          <ul key={aula.id} className="detalhe-aula-list detalhe-aula-row">
            <li className="detalhe-aula-item" > <CiClock2 className='icons'/>{aula.horario}</li>
            <li className="detalhe-aula-item"> <FaListUl className="icons" />{aula.nome}</li>
            <li className="detalhe-aula-item"> <FaRegUserCircle className="icons"/>{aula.instrutor}</li>
            <li className="detalhe-aula-item"> <IoPeopleSharp className="icons"/>{aula.vagas} vagas</li>
            <li className="detalhe-aula-item">
              <button
                className={`agendar-btn ${agendamentos[aula.id] ? "cancelar" : ""}`}
                onClick={() => toggleAgendamento(aula.id)}
                disabled={aula.vagas === 0 && !agendamentos[aula.id]}
              >
                {agendamentos[aula.id] ? "Cancelar" : "Agendar"}
              </button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default AgendarAulas;
