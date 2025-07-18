import React, { useState, useEffect } from 'react';
import './treinoAluno.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import { CgGym } from "react-icons/cg";
import Perfil from '../../../components/perfil/perfil';

function TreinoAluno() {
  const [fichas, setFichas] = useState([]);
  const [fichaAberta, setFichaAberta] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTreino = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`http://localhost:3001/gymWorkoutPlan/user/${user.id}`);
        const data = await res.json();
        setFichas(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Erro ao buscar treinos:", err);
      }
    };

    fetchTreino();
  }, [user?.id]);

  const toggleFicha = (index) => {
    setFichaAberta(fichaAberta === index ? null : index);
  };

  return (
    <div className="plano-treino-container">
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homeAluno" },
          { label: "Aulas", href: "/aulaAluno" },
          { label: "Treino", href: "/treinoAluno" },
          { label: "Dieta", href: "/dietaAluno" },
          { label: "Liftly Market", href: "/listaProfissionais" }
        ]}
      />
      <h1>Plano de Treino</h1>

      {fichas.length === 0 && (
        <p className="nenhuma-ficha">Nenhum plano de treino disponível no momento.</p>
      )}

      {fichas.map((ficha, index) => (
        <div key={index} className="card-treino">
          <div className="topo-card">
            <div>
              <strong><CgGym className='icon' /> {ficha.nomeFicha || `Ficha ${index + 1}`}</strong>
              <p>Exercícios: {ficha.exercicios?.length || 0}</p>
            </div>
            <button onClick={() => toggleFicha(index)}>
              {fichaAberta === index ? 'Fechar' : 'Ver detalhes'}
            </button>
          </div>

          {fichaAberta === index && (
            <div className="detalhes-treino">
              <table>
                <thead>
                  <tr>
                    <th>Exercício</th>
                    <th>Séries</th>
                    <th>Repetições</th>
                    <th>Carga</th>
                    <th>Descanso</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {ficha.exercicios.map((ex, i) => (
                    <tr key={i}>
                      <td>{ex.nome}</td>
                      <td>{ex.series}</td>
                      <td>{ex.repeticoes}</td>
                      <td>{ex.carga || '-'}</td>
                      <td>{ex.descanso}</td>
                      <td>{ex.observacoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TreinoAluno;
