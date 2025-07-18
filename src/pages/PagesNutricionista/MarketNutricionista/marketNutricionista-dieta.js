// Arquivo: MarketNutricionistaDieta.js
import React, { useState, useEffect } from 'react';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import './marketNutricionista-dieta.css';

function MarketNutricionistaDieta() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [modo, setModo] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [nomeDieta, setNomeDieta] = useState('');
  const [alunoId, setAlunoId] = useState(null);
  const [dietas, setDietas] = useState([]);
  const [dietaSelecionadaIndex, setDietaSelecionadaIndex] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const buscarAluno = async () => {
    try {
      const res = await fetch(`http://localhost:3001/dietPlan/email/${encodeURIComponent(emailAluno)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao buscar dietas.');
      }

      const data = await res.json();

      if (!data || !data.dietas || data.dietas.length === 0) {
        alert("Nenhuma dieta encontrada para este aluno.");
        setDietas([]);
        setRefeicoes([]);
        setNomeDieta('');
        setAlunoId(null);
        setDietaSelecionadaIndex(null);
        return;
      }

      setDietas(data.dietas);
      setDietaSelecionadaIndex(0);
      setAlunoId(data.userId);
    } catch (err) {
      console.error("Erro ao buscar aluno:", err);
      alert("Erro ao buscar aluno.");
    }
  };

  useEffect(() => {
    if (dietaSelecionadaIndex !== null && dietas[dietaSelecionadaIndex]) {
      const dieta = dietas[dietaSelecionadaIndex];
      setNomeDieta(dieta.nomeDieta || '');
      setRefeicoes(
        dieta.refeicoes.map((r, index) => ({
          id: index + 1,
          refeicao: r.nomeRefeicao,
          horario: r.horario,
          alimentos: r.alimentos
        }))
      );
    }
  }, [dietaSelecionadaIndex, dietas]);

  const abrirEdicao = (refeicao) => {
    setForm(refeicao);
    setModo('editar');
    setEditando(true);
  };

  const abrirNovo = () => {
    setForm({
      id: Date.now(),
      refeicao: '',
      horario: '',
      alimentos: [{
        nome: '',
        quantidade: '',
        modoDePreparo: '',
        carboidrato: '',
        proteina: '',
        gordura: ''
      }]
    });
    setModo('novo');
    setEditando(true);
  };

  const salvarLocal = () => {
    if (modo === 'editar') {
      setRefeicoes(prev => prev.map(r => (r.id === form.id ? form : r)));
    } else {
      setRefeicoes(prev => [...prev, form]);
    }
    setEditando(false);
  };

  const deletar = (id) => {
    setRefeicoes(prev => prev.filter(r => r.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAlimentoChange = (index, e) => {
    const { name, value } = e.target;
    const novosAlimentos = [...form.alimentos];
    novosAlimentos[index][name] = value;
    setForm({ ...form, alimentos: novosAlimentos });
  };

  const adicionarAlimento = () => {
    setForm(prev => ({
      ...prev,
      alimentos: [...prev.alimentos, {
        nome: '', quantidade: '', modoDePreparo: '', carboidrato: '', proteina: '', gordura: ''
      }]
    }));
  };

  const removerAlimento = (index) => {
    const novos = [...form.alimentos];
    novos.splice(index, 1);
    setForm({ ...form, alimentos: novos });
  };

  const deletarDieta = async () => {
    if (dietaSelecionadaIndex === null || alunoId === null) {
      alert("Nenhuma dieta selecionada.");
      return;
    }

    if (!window.confirm("Deseja realmente apagar esta dieta?")) return;

    try {
      const res = await fetch(`http://localhost:3001/dietPlan/${alunoId}/${dietaSelecionadaIndex}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao apagar dieta.");

      const novas = dietas.filter((_, i) => i !== dietaSelecionadaIndex);
      setDietas(novas);
      setDietaSelecionadaIndex(novas.length > 0 ? 0 : null);
      setRefeicoes([]);
      alert("Dieta apagada com sucesso!");
    } catch (err) {
      console.error("Erro ao apagar dieta:", err);
      alert("Erro ao apagar dieta.");
    }
  };

  const salvar = async () => {
    if (!emailAluno || !nomeDieta || refeicoes.length === 0) {
      alert("Preencha o e-mail, o nome da dieta e as refeições.");
      return;
    }

    const payload = {
      studentEmail: emailAluno,
      nutritionistId: user.id,
      nomeDieta,
      refeicoes: refeicoes.map(r => ({
        nomeRefeicao: r.refeicao,
        horario: r.horario,
        alimentos: r.alimentos.map(a => ({
          nome: a.nome,
          quantidade: parseFloat(a.quantidade),
          modoDePreparo: a.modoDePreparo,
          carboidrato: parseFloat(a.carboidrato),
          proteina: parseFloat(a.proteina),
          gordura: parseFloat(a.gordura)
        }))
      }))
    };

    try {
      const res = await fetch("http://localhost:3001/dietPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar dieta.");

      alert("Dieta enviada com sucesso!");
      setRefeicoes([]);
      setEmailAluno('');
      setNomeDieta('');
      setDietaSelecionadaIndex(null);
      setDietas([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar dieta: " + err.message);
    }
  };

  return (
    <div className="market-dieta">
      <Perfil />
       <Menu
            links={[
                {label: "Home", href: "/homeNutricionista"},
                {label: "Criar Dieta", href:"/marketNutricionistaDieta"},
                {label: "Cadastrar Anúncio", href:"/cadastroServicoNutri"}
            ]}/>
      <h1>Liftly Market</h1>

      <div className="buscar-aluno">
        <label>Dieta para:</label>
        <input type="email" value={emailAluno} onChange={(e) => setEmailAluno(e.target.value)} placeholder="Digite o e-mail do aluno" />
        <button onClick={buscarAluno}><HiOutlineMagnifyingGlass size={18} /></button>
      </div>

      {dietas.length > 0 && (
        <div className="buscar-aluno">
          <label>Selecionar dieta:</label>
          <select value={dietaSelecionadaIndex} onChange={(e) => setDietaSelecionadaIndex(Number(e.target.value))}>
            {dietas.map((d, i) => <option key={i} value={i}>{d.nomeDieta || `Dieta ${i + 1}`}</option>)}
          </select>
          <button onClick={deletarDieta} style={{ marginLeft: '10px', background: 'red', color: 'white' }}>
            Apagar Dieta
          </button>
        </div>
      )}

      <div className="buscar-aluno">
        <label>Nome da dieta:</label>
        <input type="text" value={nomeDieta} onChange={(e) => setNomeDieta(e.target.value)} placeholder="Ex: Cutting, Bulking..." />
      </div>

      <div className="dieta-card">
        <div className="header">
          <button className="btn-add" onClick={abrirNovo}>+</button>
        </div>

        <div className="linha titulo">
          <div className="coluna">Refeição</div>
          <div className="coluna">Horário</div>
          <div className="coluna">Qtd Alimentos</div>
          <div className="coluna">Ações</div>
        </div>

        {refeicoes.map(r => (
          <div className="linha" key={r.id}>
            <div className="coluna">{r.refeicao}</div>
            <div className="coluna">{r.horario}</div>
            <div className="coluna">{r.alimentos.length}</div>
            <div className="coluna acoes">
              <button onClick={() => abrirEdicao(r)}>editar</button>
              <button onClick={() => deletar(r.id)}>apagar</button>
            </div>
          </div>
        ))}

        <div className="acoes">
          <button onClick={salvar} className="enviar-treino-btn">Enviar dieta para o aluno</button>
        </div>

        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modo === 'editar' ? 'Editar Refeição' : 'Nova Refeição'}</h3>
              <input name="refeicao" value={form.refeicao} onChange={handleChange} placeholder="Refeição" />
              <input name="horario" value={form.horario} onChange={handleChange} placeholder="Horário" />
              <h4>Alimentos</h4>
              {form.alimentos.map((a, i) => (
                <div key={i} className="alimento-form">
                  <input name="nome" value={a.nome} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Alimento" />
                  <input name="quantidade" value={a.quantidade} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Qtd" />
                  <input name="modoDePreparo" value={a.modoDePreparo} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Modo de Preparo" />
                  <input name="carboidrato" value={a.carboidrato} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Carboidrato" />
                  <input name="proteina" value={a.proteina} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Proteína" />
                  <input name="gordura" value={a.gordura} onChange={(e) => handleAlimentoChange(i, e)} placeholder="Gordura" />
                  <button onClick={() => removerAlimento(i)}>Remover</button>
                </div>
              ))}
              <button onClick={adicionarAlimento}>+ Adicionar Alimento</button>
              <div className="acoes">
                <button onClick={salvarLocal}>Salvar</button>
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