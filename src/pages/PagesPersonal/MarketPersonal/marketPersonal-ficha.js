import React, { useState, useEffect } from 'react';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

import './marketPersonal-ficha.css';


function MarketPersonalFicha() {
  const [treinos, setTreinos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [modo, setModo] = useState(''); // 'editar' ou 'novo'
  const [emailAluno, setEmailAluno] = useState('');
    
  const buscarAluno = () => {
     // Aqui você pode buscar dados no back-end se quiser.
      console.log("Buscando ficha para:", emailAluno);
    };

  useEffect(() => {
    const dados = localStorage.getItem('treinos');
    if (dados) {
      setTreinos(JSON.parse(dados));
    } else {
      setTreinos([{
        id: 1,
        exercicio: 'Supino',
        serie: '4',
        repeticoes: '10-15',
        descanso: '5 min',
        obs: 'Ir até a falha'
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('treinos', JSON.stringify(treinos));
  }, [treinos]);

  const abrirEdicao = (treino) => {
    setForm(treino);
    setModo('editar');
    setEditando(true);
  };

  const abrirNovo = () => {
    setForm({
      id: Date.now(),
      exercicio: '',
      serie: '',
      repeticoes: '',
      descanso: '',
      obs: ''
    });
    setModo('novo');
    setEditando(true);
  };

  const salvar = () => {
    if (modo === 'editar') {
      setTreinos(prev => prev.map(t => (t.id === form.id ? form : t)));
    } else {
      setTreinos(prev => [...prev, form]);
    }
    setEditando(false);
  };

  const deletar = (id) => {
    setTreinos(prev => prev.filter(t => t.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="market-treino">
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homePersonal" },
          {label: "Criar ficha", href:"/marketPersonalFicha"},
          { label: "Meus Alunos", href: "/marketPersonalAlunos" }
        ]}
      />
      <h1>Liftly Market</h1>
        <div className="buscar-aluno">
          <label htmlFor="email">Ficha de treino para:</label>
          <input
            id="email"
            type="email"
            placeholder="Digite o e-mail do aluno"
            value={emailAluno}
            onChange={(e) => setEmailAluno(e.target.value)}
          />
          <button onClick={buscarAluno}>
            <HiOutlineMagnifyingGlass size={18} />
          </button>
        </div>



      <div className="treino-card">

        <div className="header">
          <button className="btn-add" onClick={abrirNovo}>+</button>
        </div>

        <div className="linha titulo">
          <div className="coluna">Exercício</div>
          <div className="coluna">Série</div>
          <div className="coluna">Repetições</div>
          <div className="coluna">Descanso</div>
          <div className="coluna">Obs</div>
          <div className="coluna">Ações</div>
        </div>

        {treinos.map((t) => (
          <div className="linha" key={t.id}>
            <div className="coluna">{t.exercicio}</div>
            <div className="coluna">{t.serie}</div>
            <div className="coluna">{t.repeticoes}</div>
            <div className="coluna">{t.descanso}</div>
            <div className="coluna">{t.obs}</div>
            <div className="coluna acoes">
              <button onClick={() => abrirEdicao(t)}>editar</button>
              <button onClick={() => deletar(t.id)}>apagar</button>
            </div>
          </div>
        ))}

        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modo === 'editar' ? 'Editar Treino' : 'Novo Exercicio'}</h3>
              {["exercicio", "serie", "repeticoes", "descanso", "obs"].map((campo) => (
                <input
                  key={campo}
                  name={campo}
                  value={form[campo]}
                  onChange={handleChange}
                  placeholder={campo}
                />
              ))}
              <div className="acoes">
                <button onClick={salvar}>Salvar</button>
                <button onClick={() => setEditando(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MarketPersonalFicha;
