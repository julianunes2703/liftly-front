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
    // Aplicação de .trim() nos setters para garantir que o estado já armazene valores limpos
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
    const [role, setRole] = useState(null); // role é um objeto do Select, não precisa de trim

    const navigate = useNavigate();

    const options = [
        { value: 'student', label: 'Aluno' },
        { value: 'teacher', label: 'Personal Trainer' },
        { value: 'owner', label: 'Academia' },
        { value: 'nutritionist', label: 'Nutricionista' }
    ];

    const handleCadastro = async (e) => {
        e.preventDefault();

        // As validações podem ser feitas com os estados, que já estarão 'trimados'
        if (!usuario || !senha || !nome || !role) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        // Os valores do 'body' agora vêm diretamente dos estados, que já foram 'trimados' pelos onChange
        const body = {
            name: nome, // nome já está 'trimado'
            email: usuario, // usuario já está 'trimado'
            password: senha, // senha já está 'trimada'
            role: role.value,
            telefone: telefone, // telefone já está 'trimado' (se for sempre visível)
        };


        if (role.value === 'student') {
            body.peso = peso; // peso não é string, não precisa de trim
            body.altura = altura; // altura não é string, não precisa de trim
        }

        if (['teacher', 'nutritionist'].includes(role.value)) {
            body.idade = idade; // idade não é string, não precisa de trim
            body.descricao = descricao.trim(); // descricao é string, pode ter trim aqui
        }

        if (role.value === 'owner') {
            body.endereco = endereco.trim(); // endereco é string
            body.ocupacaoMaxima = ocupacaoMaxima; // ocupacaoMaxima não é string
        }

        try {
            const res = await axios.post(`http://localhost:3001/users/cadastro/${role.value}`, body);
            alert("Cadastro realizado com sucesso!");
            localStorage.setItem("token", res.data.token);
            navigate("/login");
        } catch (err) {
            // O erro 'User.telefone cannot be null' pode ter sido causado por 'telefone'
            // não sendo preenchido no input quando você esperava que ele fosse.
            // A nova estrutura do JSX abaixo deve garantir que ele seja sempre visível e trimado.
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
                            {/* Aplica .trim() no onChange para 'nome' */}
                            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value.trim())} />
                        </div>

                        <div className="input-field">
                            <MdEmail className="icon" />
                            {/* Aplica .trim() no onChange para 'usuario' (email) */}
                            <input type="text" placeholder="Email" value={usuario} onChange={(e) => setUsuario(e.target.value.trim())} />
                        </div>

                        <div className="input-field">
                            <FaLock className="icon" />
                            {/* Aplica .trim() no onChange para 'senha' */}
                            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value.trim())} />
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

                        {/* Telefone: Agora visível para teacher, owner, nutritionist E student */}
                        {/* Se ele deve ser visível para TODOS, a condição deve ser removida ou simplificada */}
                        {role && (role.value === 'teacher' || role.value === 'owner' || role.value === 'nutritionist' || role.value === 'student') && (
                            <div className="input-field">
                                <FaPhoneAlt className="icon" />
                                {/* Aplica .trim() no onChange para 'telefone' */}
                                <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value.trim())} />
                            </div>
                        )}

                        {role && role.value === 'student' && (
                            <>
                                <div className="input-field">
                                    <GiBodyHeight className="icon" />
                                    {/* Altura e Peso são números, não precisam de trim, mas pode-se converter para Number */}
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
                                    <TbNumbers className='icon' />
                                    {/* Idade é número, não precisa de trim */}
                                    <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
                                </div>

                                <div className="input-field">
                                    {/* Aplica .trim() no onChange para 'descricao' */}
                                    <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value.trim())} />
                                </div>
                            </>
                        )}

                        {role && role.value === 'owner' && (
                            <>
                                <div className="input-field">
                                    <FaMapMarkerAlt className='icon' />
                                    {/* Aplica .trim() no onChange para 'endereco' */}
                                    <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value.trim())} />
                                </div>

                                <div className="input-field">
                                    <IoPeopleSharp className='icon' />
                                    {/* Ocupação Máxima é número, não precisa de trim */}
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