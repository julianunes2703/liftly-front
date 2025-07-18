// Arquivo: DietaAluno.js
import React, { useState, useEffect } from 'react';
import './dietaAluno.css';
import { MdFoodBank } from "react-icons/md";
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';

function DietaAluno() {
  const [dietas, setDietas] = useState([]);
  const [dietaAberta, setDietaAberta] = useState(null);
  const [refeicaoAberta, setRefeicaoAberta] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDietas = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`http://localhost:3001/dietPlan/user/${user.id}`);
        const data = await res.json();
        setDietas(data);
      } catch (err) {
        console.error("Erro ao buscar dietas:", err);
      }
    };

    fetchDietas();
  }, [user?.id]);

  const toggleDieta = (index) => {
    setDietaAberta(dietaAberta === index ? null : index);
    setRefeicaoAberta(null);
  };

  const toggleRefeicao = (index) => {
    setRefeicaoAberta(refeicaoAberta === index ? null : index);
  };

  return (
    <div className="plano-dieta-container">
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

      <h1>Plano Alimentar</h1>

      {dietas.length === 0 && <p className="nenhuma-dieta">Nenhuma dieta disponível no momento.</p>}

      {dietas.map((dieta, i) => (
        <div key={i} className="card-dieta">
          <div className="topo-card">
            <div>
              <strong><MdFoodBank className='icon' /> {dieta.nomeDieta || `Dieta ${i + 1}`}</strong>
              <p>Total de Refeições: {dieta.refeicoes.length}</p>
            </div>
            <button onClick={() => toggleDieta(i)}>
              {dietaAberta === i ? 'Fechar' : 'Ver refeições'}
            </button>
          </div>

          {dietaAberta === i && (
            <div className="refeicoes-bloco">
              {dieta.refeicoes.map((refeicao, j) => (
                <div key={j} className="subcard-dieta">
                  <div className="topo-subcard">
                    <div>
                      <strong>{refeicao.nomeRefeicao}</strong>
                      <p>Horário: {refeicao.horario}</p>
                      <p>Data: {new Date(refeicao.dataCriacao).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => toggleRefeicao(j)}>
                      {refeicaoAberta === j ? 'Fechar detalhes' : 'Ver detalhes'}
                    </button>
                  </div>

                  {refeicaoAberta === j && (
                    <div className="detalhes-dieta">
                      <table>
                        <thead>
                          <tr>
                            <th>Alimento</th>
                            <th>Qtd</th>
                            <th>Modo de Preparo</th>
                            <th>Carboidrato (g)</th>
                            <th>Proteína (g)</th>
                            <th>Gordura (g)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {refeicao.alimentos.map((item, k) => (
                            <tr key={k}>
                              <td>{item.nome}</td>
                              <td>{item.quantidade}</td>
                              <td>{item.modoDePreparo}</td>
                              <td>{item.carboidrato}</td>
                              <td>{item.proteina}</td>
                              <td>{item.gordura}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DietaAluno;
