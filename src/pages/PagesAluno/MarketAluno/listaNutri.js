import React, { useEffect, useState } from 'react';
import './listaNutri.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import Buscar from '../../../components/buscar/buscar'; // Componente de busca
import { useNavigate } from 'react-router-dom';
import { getNutritionists } from '../../../services/marketplaceService';


function ListaNutricionistas() {
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [profissionais, setProfissionais] = useState([]); // Todos os profissionais carregados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarNutricionistas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNutritionists(); // chamada direta
            console.log(data)
            setProfissionais(data);
        } catch (err) {
            console.error("Erro ao buscar nutricionistas:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar nutricionistas.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect para carregar os nutricionistas quando o componente monta
    // E recarrega quando a 'busca' (texto do input de busca) muda para filtrar pelo backend
    useEffect(() => {
        carregarNutricionistas(busca);
    }, [busca]); // A dependência 'busca' fará a busca ser disparada novamente quando o texto do input mudar

    // Função para lidar com a mudança no input de busca
    const handleBusca = (e) => {
        setBusca(e.target.value.trim()); // Aplica trim() e atualiza o estado de busca
        // O useEffect acima se encarregará de chamar carregarNutricionistas novamente
    };

    // Função para lidar com o clique no botão "Entrar em contato" e enviar o número para a API do WhatsApp
    const handleContact = (telefone) => {
        // Montar o número com o código do país (Exemplo: +55 para Brasil)
        const phone = `+55${telefone}`;
        // Mensagem opcional para enviar automaticamente na conversa
        const message = 'Olá, gostaria de saber mais sobre seus serviços!';

        // Criar o link para o WhatsApp
        const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Abrir o WhatsApp
        window.open(whatsappLink, '_blank');
    };

    if (loading) return <div className="loading-message">Carregando nutricionistas...</div>;
    if (error) return <div className="error-message">Erro: {error}</div>;

    return (
        <div className="pagina-busca">
            <Perfil />
            <Menu
                links={[
                    { label: "Home", href: '/homeAluno' },
                    { label: "Dietas", href: '/listaNutricionistas' },
                    { label: "Treinos", href: '/listaProfissionais' }
                ]}
            />

            <h1>Liftly Market – Nutricionistas</h1>

            <Buscar onChange={handleBusca} value={busca} /> {/* Componente de busca */}

            <div className="cards-container">
                {profissionais.length === 0 ? (
                    <p className="no-results-message">Nenhum nutricionista encontrado.</p>
                ) : (
                    profissionais.map((p) => (
                        <div key={p.id} className="card-profissional"> {/* Usa p.id */}
                            <div className="imagem-profissional"><LuUser /></div>
                            <div className="info-profissional">
                                <strong>{p.provider.name}</strong> {/* O nome do provedor vem de p.provider.name */}
                                <p>{p.description || "Sem descrição."}</p> {/* Usa a descrição do serviço */}
                                <p>Preço: R$ {p.price ? p.price.toFixed(2) : 'N/A'}</p> {/* Exibe o preço */}
                            </div>
                            {/* O botão "Ver mais" pode levar para uma página de detalhes do serviço ou do provedor */}
                            <button className="btn-vermais" onClick={() => handleContact(p.provider.telefone)}>Entrar em contato</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListaNutricionistas;
