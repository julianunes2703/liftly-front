import React, { useState, useEffect } from 'react';
import Menu from "../../../components/menu-lateral/menu-lateral";
import Perfil from "../../../components/perfil/perfil";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import './marketPersonal-ficha.css';

function MarketPersonalFicha() {
  const [treinos, setTreinos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [modo, setModo] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [nomeFicha, setNomeFicha] = useState('');
  const [alunoId, setAlunoId] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [fichaSelecionadaIndex, setFichaSelecionadaIndex] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const buscarAluno = async () => {
    try {
      const res = await fetch(`http://localhost:3001/gymWorkoutPlan/email/${encodeURIComponent(emailAluno)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.error || 'Erro ao buscar ficha.');
      }

      const data = await res.json();

      if (!data || !data.fichas || data.fichas.length === 0) {
        alert("Nenhuma ficha encontrada para este aluno.");
        setFichas([]);
        setTreinos([]);
        setNomeFicha('');
        setAlunoId(null);
        setFichaSelecionadaIndex(null);
        return;
      }

      setFichas(data.fichas);
      setFichaSelecionadaIndex(0); // começa com a primeira ficha
      setAlunoId(data.userId);
    } catch (err) {
      console.error("Erro ao buscar aluno:", err);
      alert("Erro ao buscar aluno.");
    }
  };

  useEffect(() => {
    if (fichaSelecionadaIndex !== null && fichas[fichaSelecionadaIndex]) {
      const ficha = fichas[fichaSelecionadaIndex];
      setNomeFicha(ficha.nomeFicha || '');
      setTreinos(
        ficha.exercicios.map((ex, index) => ({
          id: index + 1,
          exercicio: ex.nome,
          serie: ex.series,
          repeticoes: ex.repeticoes,
          carga: ex.carga,
          descanso: ex.descanso,
          obs: ex.observacoes
        }))
      );
    }
  }, [fichaSelecionadaIndex, fichas]);

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
      carga: '',
      descanso: '',
      obs: ''
    });
    setModo('novo');
    setEditando(true);
  };

  const salvarLocal = () => {
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

  const deletarFicha = async () => {
  if (fichaSelecionadaIndex === null || alunoId === null) {
    alert("Nenhuma ficha selecionada.");
    return;
  }

  const confirmar = window.confirm("Tem certeza que deseja apagar esta ficha?");
  if (!confirmar) return;

  try {
    const response = await fetch(
      `http://localhost:3001/gymWorkoutPlan/${alunoId}/${fichaSelecionadaIndex}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.error || "Erro ao apagar ficha.");
    }

    // Atualiza a lista local de fichas
    const novasFichas = fichas.filter((_, index) => index !== fichaSelecionadaIndex);
    setFichas(novasFichas);
    setFichaSelecionadaIndex(novasFichas.length > 0 ? 0 : null);
    setTreinos([]);
    alert("Ficha apagada com sucesso!");
  } catch (err) {
    console.error("Erro ao apagar ficha:", err);
    alert("Erro ao apagar ficha.");
  }
};


  const salvar = async () => {
    if (!emailAluno || !nomeFicha || treinos.length === 0) {
      alert("Preencha o e-mail, o nome da ficha e os exercícios.");
      return;
    }

    const payload = {
      studentEmail: emailAluno,
      trainerId: user.id,
      nomeFicha: nomeFicha,
      exercises: treinos.map((t) => ({
        nome: t.exercicio,
        series: parseInt(t.serie, 10),
        repeticoes: parseInt(t.repeticoes, 10),
        carga: t.carga || '',
        descanso: t.descanso,
        observacoes: t.obs
      })),
    };

    try {
      const response = await fetch("http://localhost:3001/gymWorkoutPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.error || "Erro ao salvar treino.");
      }

      alert("Ficha de treino salva com sucesso!");
      setTreinos([]);
      setEmailAluno('');
      setNomeFicha('');
      setFichaSelecionadaIndex(null);
      setFichas([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar treino: " + err.message);
    }
  };

  return (
    <div className="market-treino">
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homePersonal" },
          { label: "Criar ficha", href: "/marketPersonalFicha" },
          { label: "Cadastrar Anúncio", href: "/cadastroServicoPersonal" },
        ]}
      />

      <h1>Liftly Market</h1>

      <div className="buscar-aluno">
        <label>Ficha de treino para:</label>
        <input
          type="email"
          placeholder="Digite o e-mail do aluno"
          value={emailAluno}
          onChange={(e) => setEmailAluno(e.target.value)}
        />
        <button onClick={buscarAluno}><HiOutlineMagnifyingGlass size={18} /></button>
      </div>

      {fichas.length > 0 && (
        <div className="buscar-aluno">
          <label>Selecionar ficha:</label>
          <select
            value={fichaSelecionadaIndex}
            onChange={(e) => setFichaSelecionadaIndex(Number(e.target.value))}
          >
            {fichas.map((ficha, index) => (
              <option key={index} value={index}>
                {ficha.nomeFicha || `Ficha ${index + 1}`}
              </option>
            ))}
          </select>
          <button onClick={deletarFicha} style={{ marginLeft: '10px', background: 'red', color: 'white' }}>
            Apagar Ficha
          </button>
        </div>
      )}

      

      <div className="buscar-aluno">
        <label>Nome da ficha:</label>
        <input
          type="text"
          placeholder="Ex: Peito e Tríceps"
          value={nomeFicha}
          onChange={(e) => setNomeFicha(e.target.value)}
        />
      </div>

      <div className="treino-card">
        <div className="header">
          <button className="btn-add" onClick={abrirNovo}>+</button>
        </div>

        <div className="linha titulo">
          <div className="coluna">Exercício</div>
          <div className="coluna">Série</div>
          <div className="coluna">Repetições</div>
          <div className="coluna">Carga</div>
          <div className="coluna">Descanso</div>
          <div className="coluna">Obs</div>
          <div className="coluna">Ações</div>
        </div>

        {treinos.map((t) => (
          <div className="linha" key={t.id}>
            <div className="coluna">{t.exercicio}</div>
            <div className="coluna">{t.serie}</div>
            <div className="coluna">{t.repeticoes}</div>
            <div className="coluna">{t.carga}</div>
            <div className="coluna">{t.descanso}</div>
            <div className="coluna">{t.obs}</div>
            <div className="coluna acoes">
              <button onClick={() => abrirEdicao(t)}>editar</button>
              <button onClick={() => deletar(t.id)}>apagar</button>
            </div>
          </div>
        ))}

        <div className="acoes">
          <button onClick={salvar} className="enviar-treino-btn">
            Enviar ficha para o aluno
          </button>
        </div>

        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modo === 'editar' ? 'Editar Treino' : 'Novo Exercício'}</h3>
              {["exercicio", "serie", "repeticoes", "carga", "descanso", "obs"].map((campo) => (
                <input
                  key={campo}
                  name={campo}
                  value={form[campo]}
                  onChange={handleChange}
                  placeholder={campo}
                />
              ))}
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

export default MarketPersonalFicha;
