import React, { useEffect, useState } from 'react';
import './listaPersonal.css'; // Assume que você tem um CSS específico para Personal Trainers
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import { LuUser } from "react-icons/lu";
import Buscar from '../../../components/buscar/buscar';
import { useNavigate } from 'react-router-dom';
import { getPersonals } from '../../../services/marketplaceService'

function ListaProfissionais() { 
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [profissionais, setProfissionais] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarPersonalTrainers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPersonals(); // Agora chama direto a nova rota
            setProfissionais(data);
        } catch (err) {
            console.error("Erro ao buscar personal trainers:", err.response?.data || err);
            setError(err.response?.data?.error || "Erro ao carregar personal trainers.");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        carregarPersonalTrainers(busca);
    }, [busca]);
    const handleBusca = (e) => {
        setBusca(e.target.value.trim()); // Aplica trim() e atualiza o estado de busca
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
                            </div>
                            {/* O botão "Ver mais" pode levar para uma página de detalhes do serviço ou do provedor */}
                            <button className="btn-vermais" onClick={() => navigate(`/detalhePersonal/${p.id}`)}>Entrar em contato</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListaProfissionais;
