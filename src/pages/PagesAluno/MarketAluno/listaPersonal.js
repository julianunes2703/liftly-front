import React, { useEffect, useState } from 'react';
import './listaPersonal.css'; // Assume que você tem um CSS específico para Personal Trainers
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import Buscar from '../../../components/buscar/buscar';
import { useNavigate } from 'react-router-dom';
import { getMarketplaceServices } from '../../../services/marketplaceService'; // Importa a função de serviço unificada

function ListaProfissionais() { // Renomeado de ListaProfissionais para ListaPersonalTrainers no nome da função se desejar mais clareza, mas mantido como está no export.
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [profissionais, setProfissionais] = useState([]); // Todos os profissionais carregados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para carregar personal trainers do back-end
    const carregarPersonalTrainers = async (searchText = '') => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                role: 'teacher', // Filtra por personal trainers (role 'teacher' no back-end)
                search: searchText // Passa o texto da busca para o back-end
            };
            const data = await getMarketplaceServices(filters);
            setProfissionais(data); // Armazena os dados filtrados
        } catch (err) {
            console.error("Erro ao buscar personal trainers:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar personal trainers.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect para carregar os personal trainers quando o componente monta
    // E recarrega quando a 'busca' (texto do input de busca) muda para filtrar pelo backend
    useEffect(() => {
        carregarPersonalTrainers(busca);
    }, [busca]); // A dependência 'busca' fará a busca ser disparada novamente quando o texto do input mudar

    // Função para lidar com a mudança no input de busca
    const handleBusca = (e) => {
        setBusca(e.target.value.trim()); // Aplica trim() e atualiza o estado de busca
        // O useEffect acima se encarregará de chamar carregarPersonalTrainers novamente
    };

    if (loading) return <div className="loading-message">Carregando personal trainers...</div>;
    if (error) return <div className="error-message">Erro: {error}</div>;

    return (
        <div className="pagina-busca">
            <Perfil />
            <Menu
                links={[
                    { label: "Home", href: '/homeAluno' },
                    { label: "Dietas", href: '/listaNutricionistas' },
                    { label: "Treinos", href: '/listaProfissionais' } // Este link leva para este próprio componente
                ]}
            />

            <h1>Liftly Market - Personal Trainers</h1> {/* Título atualizado */}

            <Buscar onChange={handleBusca} value={busca} /> {/* Componente de busca */}

            <div className="cards-container">
                {profissionais.length === 0 ? (
                    <p className="no-results-message">Nenhum personal trainer encontrado.</p>
                ) : (
                    profissionais.map((p) => (
                        <div key={p.id} className="card-profissional"> {/* Usa p.id do MarketplaceService */}
                            <div className="imagem-profissional"><LuUser /></div>
                            <div className="info-profissional">
                                <strong>{p.provider.name}</strong> {/* O nome do provedor vem de p.provider.name */}
                                <p>{p.description || "Sem descrição de serviço."}</p> {/* Usa a descrição do serviço */}
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

export default ListaProfissionais;
