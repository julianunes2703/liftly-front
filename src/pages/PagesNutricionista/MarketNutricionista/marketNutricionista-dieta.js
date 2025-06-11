import React, { useState, useEffect } from 'react';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

import './marketNutricionista-dieta.css';

function MarketNutricionistaDieta() {
  const [dietas, setDietas] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [modo, setModo] = useState('');
   const [emailAluno, setEmailAluno] = useState('');
      
    const buscarAluno = () => {
       // Aqui você pode buscar dados no back-end se quiser.
        console.log("Buscando ficha para:", emailAluno);
      };

  useEffect(() => {
    const dados = localStorage.getItem('dietas');
    if (dados) {
      setDietas(JSON.parse(dados));
    } else {
      setDietas([{
        id: 1,
        refeicao: 'Café da manhã',
        horario: '07:30',
        alimentos: 'Ovos, pão integral, banana',
        quantidade: '2 ovos, 1 fatia, 1 banana',
        obs: 'Evitar açúcar'
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dietas', JSON.stringify(dietas));
  }, [dietas]);

  const abrirEdicao = (dieta) => {
    setForm(dieta);
    setModo('editar');
    setEditando(true);
  };

  const abrirNovo = () => {
    setForm({
      id: Date.now(),
      refeicao: '',
      horario: '',
      alimentos: '',
      quantidade: '',
      obs: ''
    });
    setModo('novo');
    setEditando(true);
  };

  const salvar = () => {
    if (modo === 'editar') {
      setDietas(prev => prev.map(d => (d.id === form.id ? form : d)));
    } else {
      setDietas(prev => [...prev, form]);
    }
    setEditando(false);
  };

  const deletar = (id) => {
    setDietas(prev => prev.filter(d => d.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="market-dieta">
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homeNutricionista" },
          {label: "Criar Dieta", href: "/homeNutricionistaDieta"},
          { label: "Meus Alunos", href: "/marketNutricionistaAlunos" }
        ]}
      />
      <h1>Liftly Market</h1>

              <div className="buscar-aluno">
                <label htmlFor="email">Dieta para:</label>
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

      <div className="dieta-card">
        <div className="header">
          <button className="btn-add" onClick={abrirNovo}>+</button>
        </div>

        <div className="linha titulo">
          <div className="coluna">Refeição</div>
          <div className="coluna">Horário</div>
          <div className="coluna">Alimentos</div>
          <div className="coluna">Quantidade</div>
          <div className="coluna">Obs</div>
          <div className="coluna">Ações</div>
        </div>

        {dietas.map((d) => (
          <div className="linha" key={d.id}>
            <div className="coluna">{d.refeicao}</div>
            <div className="coluna">{d.horario}</div>
            <div className="coluna">{d.alimentos}</div>
            <div className="coluna">{d.quantidade}</div>
            <div className="coluna">{d.obs}</div>
            <div className="coluna acoes">
              <button onClick={() => abrirEdicao(d)}>editar</button>
              <button onClick={() => deletar(d.id)}>apagar</button>
            </div>
          </div>
        ))}

        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modo === 'editar' ? 'Editar Dieta' : 'Nova Dieta'}</h3>
              {["refeicao", "horario", "alimentos", "quantidade", "obs"].map((campo) => (
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

export default MarketNutricionistaDieta;
