import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
import axios from 'axios';
import Menu from '../../components/menu-lateral/menu-lateral';
import Perfil from '../../components/perfil/perfil';
import './perfilGlobal.css'; 

const PerfilGlobal = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [idade, setIdade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [ocupacaoMaxima, setOcupacaoMaxima] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId'); // você precisa garantir que isso foi salvo no login
  const token = localStorage.getItem('tokenAcademia') || localStorage.getItem('tokenAluno') || localStorage.getItem('token');

  useEffect(() => {
    // Opcional: Buscar dados atuais do usuário
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const u = res.data;
        setNome(u.name || "");
        setUsuario(u.email || "");
        setTelefone(u.telefone || "");
        setAltura(u.altura || "");
        setPeso(u.peso || "");
        setIdade(u.idade || "");
        setDescricao(u.descricao || "");
        setEndereco(u.endereco || "");
        setOcupacaoMaxima(u.ocupacaoMaxima || "");
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar dados do perfil.");
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!usuario || !nome) {
      alert("Preencha os campos obrigatórios (nome e email)!");
      return;
    }

    const body = {
      name: nome,
      email: usuario,
      telefone,
    };

    if (senha) {
      body.password = senha; // só atualiza se o usuário preencher
    }

    if (role === 'student') {
      body.altura = altura;
      body.peso = peso;
    }

    if (role === 'teacher' || role === 'nutritionist') {
      body.idade = idade;
      body.descricao = descricao;
    }

    if (role === 'owner') {
      body.endereco = endereco;
      body.ocupacaoMaxima = ocupacaoMaxima;
    }

    try {
      await axios.put(`http://localhost:3001/users/${userId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Perfil atualizado com sucesso!");
      navigate("/login"); // ou outro local mais apropriado, ex: /homeAluno
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar perfil.";
      console.error(err);
      setErro(msg);
    }
  };

  const handleDeleteAccount = async () => {
  const confirmacao = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.");

  if (!confirmacao) return;

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    alert("Usuário não autenticado.");
    return;
  }

  try {
    await axios.delete(`http://localhost:3001/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Limpa localStorage e redireciona
    localStorage.clear();
    alert("Conta excluída com sucesso.");
    navigate("/login");

  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    alert("Erro ao excluir conta.");
  }
};


  return (
    <div>
      <Perfil />
      <div className="perfilEditar-container">
        <form onSubmit={handleUpdate}>
          <h1 className='editarPerfil'>Editar Perfil</h1>

          <div className='editar-card'>
            <div className="input-field">
              <FaUser className="icon" />
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="input-field">
              <MdOutlineMailOutline className="icon" />
              <input type="text" placeholder="Email" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            </div>

            <div className="input-field">
              <BsTelephone className="icon" />
              <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>

            {role === 'student' && (
              <>
                <div className="input-field">
                  <input type="text" placeholder="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} />
                </div>
                <div className="input-field">
                  <input type="text" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
                </div>
              </>
            )}

            {(role === 'teacher' || role === 'nutritionist') && (
              <>
                <div className="input-field">
                  <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
                </div>
                <div className="input-field">
                  <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </div>
              </>
            )}

            {role === 'owner' && (
              <>
                <div className="input-field">
                  <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                </div>
                <div className="input-field">
                  <input type="number" placeholder="Ocupação Máxima" value={ocupacaoMaxima} onChange={(e) => setOcupacaoMaxima(e.target.value)} />
                </div>
              </>
            )}

            <div className="input-field">
              <FaLock className="icon" />
              <input type="password" placeholder="Nova Senha (opcional)" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>

            {erro && <p className="error-message">{erro}</p>}
            <button type="submit">Confirmar</button>
            <button type="button" className="btn-excluir" onClick={handleDeleteAccount}>Excluir Conta</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilGlobal;
