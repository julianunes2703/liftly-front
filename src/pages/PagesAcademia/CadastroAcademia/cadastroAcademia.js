import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";


import LogoLiftly from '../../../components/liftly/liftly';
import './cadastroAcademia.css';

export default function CadastroAcademia() {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [endereco, setEndereco]           = useState('');
  const [ocupacaoMaxima, setOcupacaoMaxima] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        endereco: endereco.trim(),
        ocupacaoMaxima: Number(ocupacaoMaxima)
      };
      const { data } = await axios.post('http://localhost:3001/gyms', body);
      alert('Academia cadastrada com sucesso!');
      // redireciona para login da academia
      navigate('/login-academia');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erro ao cadastrar academia');
    }
  };

  return (
    <div>
     <LogoLiftly/>
    <div className='cadastro-academia-container'>
            <form onSubmit={handleSubmit}>
            <h1 className='cadastro'>Cadastro de Academia</h1>
            <div className='cadastro-academia-card'>
              <div className="input-field">
                <FaUser className="icon" />
            <input
                placeholder="Nome da Academia"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            </div>
            <div className="input-field">
              <MdEmail className="icon" />
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            </div>
            <div className="input-field">
              <FaLock className="icon" />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            </div>
            <div className='input-field'>
              <FaMapMarkerAlt className='icon'/>
            <input
                placeholder="Endereço"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                required
            />
            </div>
            <div className='input-field'>
              <IoPeopleSharp className='icon'/>
            <input
                type="number"
                placeholder="Ocupação Máxima"
                value={ocupacaoMaxima}
                onChange={e => setOcupacaoMaxima(e.target.value)}
                required
            />
            </div>
            <button type="submit">Cadastrar Academia</button>
            </div>
            </form>
   </div>
 </div>
  );
}
