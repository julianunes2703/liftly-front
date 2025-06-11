import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

import './esqueceuSenha.css'
import LogoLiftly from '../../components/liftly/liftly';

const EsqueceuSenha = ({ tipoUsuario }) => {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const handleNovaSenha = (e) => {
        e.preventDefault();
    
        if (usuario.trim() === "" || senha.trim() === "") {
          alert("Preencha todos os campos!");
          return;
        }
    
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.usuario === usuario && u.senha === senha);
    
        if (user) {
          alert(`Login bem-sucedido para ${user.tipo}!`);
          localStorage.setItem("userType", user.tipo);
    
      };
    }

    return(
    <div>
       <LogoLiftly/> 
            <div className="esqueceu-container">
                <form onSubmit={handleNovaSenha}>
                    <h1 className='esqueceu'>Nova Senha</h1>

                <div className='esqueceu-card'>

                    <div className="input-field">
                    <FaUser className="icon" />
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    </div>
        
                    <div className="input-field">
                    <FaLock className="icon" />
                    <input
                        type="password"
                        placeholder="Nova Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className="input-field">
                    <FaLock className="icon" />
                    <input
                        type="password"
                        placeholder=" Digite Novamente Nova Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                    {erro && <p className="error-message">{erro}</p>}
                
                    <button type="submit">Confirmar</button>
                </div>
    
     </form>
    </div>
    </div>
    )

}

export default EsqueceuSenha;