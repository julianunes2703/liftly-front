import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaUser, FaLock } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiBodyHeight } from "react-icons/gi";
import { FaWeightScale } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { TbNumbers } from "react-icons/tb";

import Select from 'react-select';
import axios from 'axios';

import './cadastro.css';
import LogoLiftly from '../../components/liftly/liftly';

const Cadastro = () => {
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
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

    const options = [
        { value: 'student', label: 'Aluno' },
        { value: 'teacher', label: 'Personal Trainer' },
        { value: 'owner', label: 'Academia' },
        { value: 'nutritionist', label: 'Nutricionista' }
    ];

    const handleCadastro = async (e) => {
        e.preventDefault();

        if (!usuario || !senha || !nome || !role) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        const body = {
            name: nome,
            email: usuario,
            password: senha,
            role: role.value
        };

        if (['teacher', 'owner', 'nutritionist'].includes(role.value)) {
            body.telefone = telefone;
        }

        if (role.value === 'student') {
            body.peso = peso;
            body.altura = altura;
        }

        if (['teacher', 'nutritionist'].includes(role.value)) {
            body.idade = idade;
            body.descricao = descricao;
        }

        if (role.value === 'owner') {
            body.endereco = endereco;
            body.ocupacaoMaxima = ocupacaoMaxima;
        }

        try {
            const res = await axios.post(`http://localhost:3001/cadastro/${role.value}`, body);
            alert("Cadastro realizado com sucesso!");
            localStorage.setItem("token", res.data.token);
            navigate("/login");
        } catch (err) {
            setErro(err.response?.data?.error || 'Erro ao cadastrar');
        }
    };

    return (
        <div>
            <LogoLiftly />
            <div className="cadastro-container">
                <form onSubmit={handleCadastro}>
                    <h1 className='cadastro'>Cadastro</h1>
                    <div className='cadastro-card'>

                        <div className="input-field">
                            <FaUser className="icon" />
                            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>

                        <div className="input-field">
                            <MdEmail className="icon" />
                            <input type="text" placeholder="Email" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </div>

                        <div className="input-field">
                            <FaLock className="icon" />
                            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>

                        <div className="input-field">
                            <Select
                                options={options}
                                value={role}
                                onChange={setRole}
                                placeholder="Selecione o tipo de usuário"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>

                        {role && (role.value === 'teacher' || role.value === 'owner' || role.value === 'nutritionist') && (
                            <div className="input-field">
                                <FaPhoneAlt className="icon" />
                                <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                            </div>
                        )}

                        {role && role.value === 'student' && (
                            <>
                                <div className="input-field">
                                    <GiBodyHeight className="icon" />
                                    <input type="text" placeholder="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} />
                                </div>

                                <div className="input-field">
                                    <FaWeightScale className="icon" />
                                    <input type="text" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
                                </div>
                            </>
                        )}

                        {role && (role.value === 'teacher' || role.value === 'nutritionist') && (
                            <>
                                <div className="input-field">
                                    <TbNumbers  className='icon'/>
                                    <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
                                </div>

                                <div className="input-field">
                                    <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                </div>
                            </>
                        )}

                        {role && role.value === 'owner' && (
                            <>
                                <div className="input-field">
                                    <FaMapMarkerAlt className='icon' />
                                    <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                                </div>

                                <div className="input-field">
                                    <IoPeopleSharp  className='icon'/>
                                    <input type="number" placeholder="Ocupação Máxima" value={ocupacaoMaxima} onChange={(e) => setOcupacaoMaxima(e.target.value)} />
                                </div>
                            </>
                        )}

                        {erro && <p className="error-message">{erro}</p>}
                        <button type="submit">Cadastre-se</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Cadastro;
