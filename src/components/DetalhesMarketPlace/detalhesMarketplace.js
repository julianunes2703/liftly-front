// src/components/ServiceDetailsPage/ServiceDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Adicione Link se quiser navegação interna
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import { getMarketplaceServiceById } from '../../services/marketplaceService'; // Ajuste o caminho se necessário

import './detalhesMarketplace.css'; // O CSS para este componente

// Este componente é focado apenas nos detalhes do serviço.
// O Menu e o Perfil podem ser adicionados no layout da página pai (onde este componente será usado).
function DetalheMarketPlace() {
  const { id } = useParams(); // Pega o 'id' da URL
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMarketplaceServiceById(id);
        setServiceDetails(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do serviço:", err.response?.data || err);
        setError(err.response?.data?.error || "Erro ao carregar detalhes do serviço.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    } else {
      setError("ID do serviço não fornecido.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="service-details-message loading-message">Carregando detalhes do serviço...</div>;
  if (error) return <div className="service-details-message error-message">Erro: {error}</div>;
  if (!serviceDetails) return <div className="service-details-message no-data-message">Serviço não encontrado.</div>;

  // Assumindo que o objeto 'serviceDetails' tem a mesma estrutura que 'profissional' no exemplo anterior
  // ou seja, { id, description, price, type, provider: { id, name, age }, rating }
  const providerName = serviceDetails.provider?.name || 'Provedor Desconhecido';
  const providerAge = serviceDetails.provider?.age;
  const serviceDescription = serviceDetails.description || "Nenhuma descrição detalhada disponível.";
  const servicePrice = serviceDetails.price ? serviceDetails.price.toFixed(2) : 'N/A';
  const serviceType = serviceDetails.type || 'Não especificado';
  const serviceRating = serviceDetails.rating;

  return (
    <div className="service-details-container">
      <h1 className="service-details-title">Detalhes do Serviço: {serviceType}</h1>

      <div className="service-details-header">
        <div className="service-details-info">
          <div className="service-details-avatar"><LuUser /></div>
          <div className="service-details-data">
            <strong>{providerName}</strong>
            {providerAge && <p>{providerAge} anos</p>}
            {serviceRating && (
              <p className="service-details-rating">
                {serviceRating} <FaStar />
              </p>
            )}
          </div>
        </div>
        <button className="service-details-contact-btn">Entrar em contato</button>
      </div>

      <hr className="service-details-divider" />

      <div className="service-details-section">
        <h3>Descrição:</h3>
        <p>{serviceDescription}</p>
      </div>

      <div className="service-details-section">
        <h3>Preço:</h3>
        <p>R$ {servicePrice}</p>
      </div>

      {/* Adicione mais seções com outros detalhes se sua API fornecer, exemplo: */}
      {/*
      <div className="service-details-section">
        <h3>Especialidade:</h3>
        <p>{serviceDetails.specialty || 'Não informada'}</p>
      </div>
      */}

      {/* Botão para voltar à lista, se desejar */}
      <Link to="/listaNutricionistas" className="service-details-back-link">Voltar à lista de Nutricionistas</Link>
      {/* Ou, se a rota puder ser dinâmica: */}
      {/* <button onClick={() => window.history.back()} className="service-details-back-link">Voltar</button> */}
    </div>
  );
}

export default DetalheMarketPlace;