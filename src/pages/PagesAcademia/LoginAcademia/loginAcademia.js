import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

import './loginAcademia.css';
import LogoLiftly from '../../../components/liftly/liftly';

export default function LoginAcademia() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:3001/gyms/login',
        { email: email.trim(), password: password.trim() }
      );

        const { user, token } = data;
       localStorage.setItem('tokenAcademia', token);
      localStorage.setItem('userAcademia', JSON.stringify(user));

      // salva token e dados da academia
      localStorage.setItem('tokenGym', data.token);
      localStorage.setItem('gymId',   data.gymId);
      localStorage.setItem('token', token);

      localStorage.setItem('gymName', data.gymName);
      navigate('/homeAcademia');
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro no login da academia');
    }
  };

   return (
     <div>
       <LogoLiftly/>
       <div className="login-container">
         <form onSubmit={handleSubmit}>
           <h1 className='login'>Login Academia</h1>
 
             <div className='login-card'>
                     <div className="input-field">
                       <FaUser className="icon" />
                       <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                     </div>
 
                     <div className="input-field">
                       <FaLock className="icon" />
                       <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                 <button type="button" className="register-btn" onClick={() => navigate("/cadastroAcademia")}>Cadastre-se</button>
             </form>
         </div>
     </div>
   );
}
