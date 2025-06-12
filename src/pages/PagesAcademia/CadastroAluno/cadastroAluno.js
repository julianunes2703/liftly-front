import React, { useState } from 'react';
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

        // Obtém o token da academia logada do localStorage
        // É essencial que a academia tenha feito login e seu token esteja salvo aqui.
        const token = localStorage.getItem('tokenAcademia');
        if (!token) {
            setErro("Você precisa estar logado como Academia para cadastrar alunos.");
            // Você pode redirecionar para a página de login da academia aqui
            // navigate('/loginAcademia');
            return;
        }

        try {
            // Os dados do body já estão 'trimados' pelos onChange dos inputs
            // O gymId não precisa ser enviado aqui, pois o back-end irá obtê-lo do token.
            const resposta = await axios.post(
                `http://localhost:3001/gyms/register-user`, // URL do novo endpoint no gymRoutes.js
                {
                    name: nome, // nome já está 'trimado' via onChange
                    email: email, // email já está 'trimado' via onChange
                    telefone: telefone, // telefone já está 'trimado' via onChange
                    role: 'student', // Papel no sistema (para o modelo User)
                    // Não há campo de senha no formulário, o back-end vai gerar uma temporária.
                    // Se houver campos como peso/altura para o aluno no cadastro da academia, adicione-os aqui:
                    // peso: peso,
                    // altura: altura,
                },
                {
                    // Envia o token de autorização nos headers
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Atualiza a lista local de alunos com o usuário retornado pelo back-end
            // O back-end retorna 'user' dentro de 'resposta.data'
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

    // Função para excluir aluno (lógica local, futuro: interagir com backend)
    const handleRemoverAluno = async (id) => {
        // Lógica para remover do estado local (front-end)
        setAlunos(alunos.filter(aluno => aluno.id !== id));

        // TODO: Futuro: Implementar a exclusão no backend
        // try {
        //     const token = localStorage.getItem('tokenAcademia');
        //     await axios.delete(`http://localhost:3001/gyms/${gymId}/users/${id}`, {
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     });
        //     alert('Aluno removido do sistema da academia!');
        // } catch (error) {
        //     console.error("Erro ao remover aluno do backend:", error);
        //     alert('Erro ao remover aluno do sistema da academia.');
        // }
    };

    // Filtra a lista de alunos para exibição no modal
    const alunosFiltrados = alunos.filter((a) =>
        a.name.toLowerCase().includes(busca.toLowerCase()) // Usa 'a.name' pois o objeto 'user' do back-end tem 'name'
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
                                    <button className="apagar" onClick={() => handleRemoverAluno(aluno.id)}>Excluir</button>
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
