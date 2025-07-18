import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./listaAlunosPersonal.css";
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";

function ListaAlunoPersonal() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const trainerId = localStorage.getItem("trainerId");

  useEffect(() => {
    if (!trainerId) return;

    fetch(`http://localhost:3001/gymWorkoutPlan/alunos/trainer/${trainerId}`)

      .then((res) => res.json())
      .then((data) => {
        setAlunos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar alunos:", err);
        setLoading(false);
      });
  }, [trainerId]);

  const handleEditar = (email) => {
    navigate(`/personal/treino/${email}`);
  };

  return (
    <div className="pagina-market-personal">
      <Menu />
      <div className="conteudo">
        <Perfil />
        <h2>Meus Alunos</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : alunos.length === 0 ? (
          <p>Nenhum aluno encontrado.</p>
        ) : (
          <table className="tabela-alunos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, index) => (
                <tr key={index}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleEditar(aluno.email)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ListaAlunoPersonal;
