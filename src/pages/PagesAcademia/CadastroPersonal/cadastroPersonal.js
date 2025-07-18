import React, { useState, useEffect } from 'react'; 

import { BsTelephone } from "react-icons/bs"; 
import { FaUser } from 'react-icons/fa'; 
import { MdOutlineMailOutline } from "react-icons/md"; 
import Menu from '../../../components/menu-lateral/menu-lateral'; 
import Perfil from '../../../components/perfil/perfil'; 
import './cadastroPersonal.css'; 
import axios from 'axios'; 

const CadastrarPersonal = () => { 
    const [nome, setNome] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [telefone, setTelefone] = useState(""); 
    const [erro, setErro] = useState(""); 
    const [personais, setPersonais] = useState([]); 
    const [mostrarModal, setMostrarModal] = useState(false); 
    const [busca, setBusca] = useState(""); 

    useEffect(() => { 
        fetchPersonais(); 
    }, []); 

    const handleCadastro = async (e) => { 
        e.preventDefault(); 

        if (!nome || !email || !telefone) { 
            setErro("Preencha todos os campos."); 
            return; 
        } 

        const token = localStorage.getItem('tokenAcademia');  
        if (!token) { 
            setErro("Você precisa estar logado como Academia para cadastrar personal trainers."); 
            return; 
        } 

        try { 
            const resposta = await axios.post( 
                'http://localhost:3001/gyms/register-user', // URL do novo endpoint no gymRoutes.js 
                { 
                    name: nome, 
                    email: email, 
                    telefone: telefone, 
                    role: 'teacher', 
                }, 
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    } 
                } 
            ); 
            setPersonais([...personais, resposta.data.user]);  
            setNome(""); 
            setEmail(""); 
            setTelefone(""); 
            setErro(""); 
            alert('Personal Trainer registrado e associado com sucesso!'); 
        } catch (erro) { 
            const errorMessage = erro.response?.data?.error || erro.message || 'Erro desconhecido ao registrar personal trainer.'; 
            console.error("Erro no registro do personal trainer:", erro.response?.data || erro); 
            setErro(errorMessage); 
            alert(`Erro ao registrar personal trainer: ${errorMessage}`); 
        } 
    }; 

    // --- INÍCIO DA FUNÇÃO handleRemoverPersonal AJUSTADA ---
    const handleRemoverPersonal = async (personalId, personalName) => { 
        // 1. Confirmação do usuário para evitar exclusões acidentais
        const confirmacao = window.confirm(`Tem certeza que deseja desvincular o personal ${personalName} da sua academia?`);

        if (!confirmacao) {
            return; // Se o usuário cancelar, a operação é abortada
        }

        const token = localStorage.getItem('tokenAcademia'); 
        if (!token) { 
            setErro("Você precisa estar logado como Academia para desvincular personal trainers."); 
            return; 
        } 

        try { 
            // 2. Faz a requisição DELETE para o backend para desvincular o usuário
            await axios.delete(`http://localhost:3001/usergym/${personalId}/unlink`, { 
                headers: { 
                    'Authorization': `Bearer ${token}` // Envia o token de autenticação
                } 
            }); 

            // 3. Se a requisição for bem-sucedida, atualiza o estado local para remover o personal da lista
            setPersonais(personais.filter(personal => personal.id !== personalId)); 
            setErro(""); // Limpa qualquer mensagem de erro anterior
            alert(`Personal ${personalName} desvinculado com sucesso!`); // Feedback de sucesso
        } catch (erro) { 
            // 4. Em caso de erro na requisição, exibe uma mensagem de erro
            const errorMessage = erro.response?.data?.error || erro.message || 'Erro desconhecido ao desvincular personal trainer.'; 
            console.error("Erro ao desvincular personal trainer:", erro.response?.data || erro); 
            setErro(errorMessage); 
            alert(`Erro ao desvincular personal trainer: ${errorMessage}`); 
        } 
    }; 
    // --- FIM DA FUNÇÃO handleRemoverPersonal AJUSTADA ---

    const fetchPersonais = async () => { 
        console.log("🔍 Buscando personais..."); 

        const token = localStorage.getItem('tokenAcademia'); 
        if (!token) {
            setErro("Token de autenticação não encontrado. Faça login novamente.");
            return;
        }

        try { 
            const response = await axios.get('http://localhost:3001/gyms/trainers', { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            }); 
             
            setPersonais(response.data); 

        } catch (err) { 
            const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido ao buscar personais.';
            console.error("Erro ao buscar personais:", err.response?.data || err); 
            setErro(errorMessage);
        } 
    }; 

    // Filtra a lista de personais para exibição no modal 
    const personaisFiltrados = personais.filter((p) => 
        p.name.toLowerCase().includes(busca.toLowerCase()) // Usa 'p.name' pois o objeto 'user' do back-end tem 'name' 
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
                    <h1 className='cadastro'>Cadastrar Personal Trainer</h1> 
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
                        <button type="button" onClick={() => { 
                            fetchPersonais();           
                            setMostrarModal(true); 
                        }}> 
                            Visualizar Personais Trainers 
                        </button> 

                    </div> 
                </form> 
            </div> 

            {mostrarModal && ( 
                <div className="modal-overlay"> 
                    <div className="modal-content"> 
                        <h2>Personais Trainers Cadastrados</h2> 

                        <input 
                            type="text" 
                            placeholder="Buscar por nome" 
                            className="busca-input" 
                            value={busca} 
                            onChange={(e) => setBusca(e.target.value)} 
                        /> 

                        {personaisFiltrados.length === 0 ? ( 
                            <p>Nenhum personal trainer encontrado.</p> 
                        ) : ( 
                            personaisFiltrados.map((personal) => ( 
                                <div key={personal.id} className="aluno-item"> 
                                    <p><strong>Nome:</strong> {personal.name}</p> 
                                    <p><strong>Email:</strong> {personal.email}</p> 
                                    <p><strong>Telefone:</strong> {personal.telefone}</p> 
                                    {/* --- AJUSTE AQUI: Passa o ID e o nome para a função de remover --- */}
                                    <button 
                                        className="apagar" 
                                        onClick={() => handleRemoverPersonal(personal.id, personal.name)}
                                    >
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

export default CadastrarPersonal;
