import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

import './login.css';
import LogoLiftly from '../../components/liftly/liftly';

const Login = ({ tipoUsuario }) => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

     const trimmedUsuario = usuario.trim();
      const trimmedSenha = senha.trim();

    if (!usuario || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      console.log('Tentando logar com', { trimmedUsuario, trimmedSenha });


      const res = await axios.post('http://localhost:3001/users/login', {
        email: usuario,
        password: senha
      });

      console.log('RES.DATA:', res.data);
      console.log('USER RECEBIDO:', res.data.user);


      const { user, token } = res.data;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Bem-vindo, ${user.name}!`);

     // Depois de armazenar token e user…
      console.log('→ Navegando com tipo:', user.tipo);

      switch (user.tipo) {
        case "student":
          return navigate("/homeAluno");   
        case "teacher":
          return navigate("/homePersonal");
        case "nutritionist":
          return navigate("/homeNutricionista");
        default:
          return (() => {                   
            alert("Tipo de usuário inválido!");
            navigate("/login");
          })();
      }



    } catch (err) {
      setErro(err.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <div>
      <LogoLiftly/>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h1 className='login'> Login</h1>

            <div className='login-card'>
                    <div className="input-field">
                      <FaUser className="icon" />
                      <input type="text" placeholder="Email" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                    </div>

                    <div className="input-field">
                      <FaLock className="icon" />
                      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    {erro && <p className="error-message">{erro}</p>}
                    <div className="recall-forget">
                      <a href="#" onClick={() => navigate("/esqueceuSenha")}>Esqueceu a senha?</a>
                    </div>
                    <button type="submit">Entrar</button>
              </div>
                <div className="register-txt">
                  <p className="register-text">Ainda não possui cadastro?</p>
                </div>
                <button type="button" className="register-btn" onClick={() => navigate("/cadastro")}>Cadastre-se</button>
            </form>
        </div>
    </div>
  );
};

export default Login;
