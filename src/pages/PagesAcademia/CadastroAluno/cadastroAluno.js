import React, { useState, useEffect } from 'react';
import { BsTelephone } from "react-icons/bs";
import { FaUser } from 'react-icons/fa';
import { MdOutlineMailOutline } from "react-icons/md";
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import './cadastroAluno.css';
import axios from 'axios';

const CadastrarAluno = () => {
    // Inicialização dos estados com .trim() nos setters para garantir dados limpos desde o início
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [erro, setErro] = useState("");
    const [alunos, setAlunos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [busca, setBusca] = useState("");

    const handleCadastro = async (e) => {
        e.preventDefault();

        // Validação básica dos campos obrigatórios
        if (!nome || !email || !telefone) {
            setErro("Preencha todos os campos.");
            return;
        }

 
        const token = localStorage.getItem('tokenAcademia');
        if (!token) {
            setErro("Você precisa estar logado como Academia para cadastrar alunos.");
            return;
        }

        try {

            const resposta = await axios.post(
                `http://localhost:3001/gyms/register-user`, // URL do novo endpoint no gymRoutes.js
                {
                    name: nome, // nome já está 'trimado' via onChange
                    email: email, // email já está 'trimado' via onChange
                    telefone: telefone, // telefone já está 'trimado' via onChange
                    role: 'student', // Papel no sistema (para o modelo User)
                },
                {
                    // Envia o token de autorização nos headers
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setAlunos([...alunos, resposta.data.user]);
            setNome("");
            setEmail("");
            setTelefone("");
            setErro(""); // Limpa o erro em caso de sucesso
            alert('Aluno registrado e associado com sucesso!'); // Mensagem de sucesso
        } catch (erro) {
            // Melhora a exibição de erros do back-end
            const errorMessage = erro.response?.data?.error || erro.message || 'Erro desconhecido ao registrar aluno.';
            console.error("Erro no registro do aluno:", erro.response?.data || erro);
            setErro(errorMessage); // Exibe o erro na interface
            alert(`Erro ao registrar aluno: ${errorMessage}`); // Alerta mais informativo
        }
    };

    const handleRemoverAluno = async (alunoId, alunoName) => {
    const confirmacao = window.confirm(`Tem certeza que deseja desvincular o aluno ${alunoName} da sua academia?`);

    if (!confirmacao) {
        return;
    }

    const token = localStorage.getItem('tokenAcademia');
    if (!token) {
        setErro("Você precisa estar logado como Academia para desvincular alunos.");
        return;
    }

    try {
        await axios.delete(`http://localhost:3001/usergym/${alunoId}/unlink`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setAlunos(alunos.filter(aluno => aluno.id !== alunoId)); // Atualize seu estado de alunos aqui
        setErro("");
        alert(`Aluno ${alunoName} desvinculado com sucesso!`);
    } catch (erro) {
        const errorMessage = erro.response?.data?.error || erro.message || 'Erro desconhecido ao desvincular aluno.';
        console.error("Erro ao desvincular aluno:", erro.response?.data || erro);
        setErro(errorMessage);
        alert(`Erro ao desvincular aluno: ${errorMessage}`);
    }
};


    const fetchAlunos = async () => {
    console.log("🔍 Buscando alunos...");

    const token = localStorage.getItem('tokenAcademia');
    if (!token) {
        console.error("⚠️ Token da academia não encontrado");
        return;
    }

    try {
        const resposta = await axios.get('http://localhost:3001/gyms/students', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAlunos(resposta.data); // ← atualiza o estado com os alunos salvos no banco
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
    }
};


    useEffect(() => {
        fetchAlunos(); // ← carrega os alunos do backend
    }, []);


        const alunosFiltrados = alunos.filter(
            (a) => a?.name?.toLowerCase().includes(busca.toLowerCase())
        );


    return (
        <div>
            <Perfil />
            <Menu links={[
                { label: "Home", href: "/homeAcademia" },
                { label: "Cadastrar Aulas", href: "/cadastrarAulas" },
                { label: "Cadastrar Aluno", href: "/cadastroAluno" },
                { label: "Cadastrar Personal Trainer", href: "/cadastroPersonal" }
            ]} />

            <div className="cadastro-container">
                <form onSubmit={handleCadastro}>
                    <h1 className='cadastro'>Cadastrar Aluno</h1>
                    <div className='cadastro-card'>
                        <div className="input-field">
                            <FaUser className="icon" />
                            {/* Aplica .trim() no onChange para 'nome' */}
                            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value.trim())} />
                        </div>

                        <div className="input-field">
                            <MdOutlineMailOutline className="icon" />
                            {/* Aplica .trim() no onChange para 'email' */}
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value.trim())} />
                        </div>

                        <div className="input-field">
                            <BsTelephone className="icon" />
                            {/* Aplica .trim() no onChange para 'telefone' */}
                            <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value.trim())} />
                        </div>

                        {erro && <p className="error-message">{erro}</p>}

                        <button type="submit">Confirmar</button>
                        <button type="button" onClick={() => setMostrarModal(true)}>Visualizar Alunos</button>
                    </div>
                </form>
            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Alunos Cadastrados</h2>

                        <input
                            type="text"
                            placeholder="Buscar por nome"
                            className="busca-input"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />

                        {alunosFiltrados.length === 0 ? (
                            <p>Nenhum aluno encontrado.</p>
                        ) : (
                            alunosFiltrados.map((aluno) => (
                                <div key={aluno.id} className="aluno-item">
                                    <p><strong>Nome:</strong> {aluno.name}</p> {/* Usa 'aluno.name' */}
                                    <p><strong>Email:</strong> {aluno.email}</p>
                                    <p><strong>Telefone:</strong> {aluno.telefone}</p>
                                   <button onClick={() => handleRemoverAluno(aluno.id, aluno.name)}>
                                        Excluir
                                    </button>

                                </div>
                            ))
                        )}

                        <button className="fechar" onClick={() => setMostrarModal(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CadastrarAluno;
