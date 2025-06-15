import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CadastroAcademia() {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [endereco, setEndereco]           = useState('');
  const [telefone, setTelefone]           = useState('');
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
        telefone: telefone.trim(),
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
            <form onSubmit={handleSubmit}>
            <h2>Cadastro de Academia</h2>
            <input
                placeholder="Nome da Academia"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                placeholder="Endereço"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Ocupação Máxima"
                value={ocupacaoMaxima}
                onChange={e => setOcupacaoMaxima(e.target.value)}
                required
            />
            <button type="submit">Cadastrar Academia</button>
            </form>
  );
}
