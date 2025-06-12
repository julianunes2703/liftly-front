import React, { useEffect, useState } from 'react';
import './listaNutri.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import Buscar from '../../../components/buscar/buscar'; // Componente de busca
import { useNavigate } from 'react-router-dom';
import { getMarketplaceServices } from '../../../services/marketplaceService'; // Importa a nova função de serviço

function ListaNutricionistas() {
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [profissionais, setProfissionais] = useState([]); // Todos os profissionais carregados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para carregar nutricionistas do back-end
    const carregarNutricionistas = async (searchText = '') => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                role: 'nutritionist', // Filtra por nutricionistas
                search: searchText // Passa o texto da busca para o back-end
            };
            const data = await getMarketplaceServices(filters);
            setProfissionais(data); // Armazena os dados filtrados
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
                                {/* Idade e Avaliação (nota) não estão no modelo MarketplaceService diretamente,
                                    mas poderiam vir do modelo User se forem adicionados lá, ou de um sistema de avaliação.
                                    Por enquanto, não exibo idade/nota aqui, mas você pode adicionar se seus modelos tiverem.
                                <p>{p.provider.idade} anos</p> 
                                <p>{p.nota || 'N/A'} <FaStar /></p> */}
                            </div>
                            {/* O botão "Ver mais" pode levar para uma página de detalhes do serviço ou do provedor */}
                            <button className="btn-vermais" onClick={() => navigate(`/paginaServico/${p.id}`)}>Ver mais</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListaNutricionistas;
