import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";
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

  const role = localStorage.getItem('role'); // 'student', 'teacher', 'nutritionist', 'owner'

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!usuario || !senha || !nome) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const body = {
      name: nome,
      email: usuario,
      password: senha,
      telefone,
    };

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

    // Aqui você chamaria a API com axios.put ou axios.patch
    console.log("Enviando dados:", body);

    alert("Perfil atualizado!");
    navigate("/login");
  };

  return (
    <div>
      <Perfil />
      <Menu
        links={[
          { label: "Home", href: "/homeAluno" },
          { label: "Aulas", href: "/aulaAluno" },
          { label: "Treino", href: "/treinoAluno" },
          { label: "Dieta", href: "/dietaAluno" }
        ]}
      />

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
              <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>

            {erro && <p className="error-message">{erro}</p>}
            <button type="submit">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilGlobal;
