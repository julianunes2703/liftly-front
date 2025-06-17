// src/components/MarketPlace/AnuncioModal.js
import React, { useState, useEffect } from 'react';
import './anuncioModal.css'; 

function AnuncioModal({ anuncio, onClose, onDeleteSuccess }) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  // Funções para obter dados do localStorage (copiadas de CadastroServico.js)
  const getToken = () => localStorage.getItem('token');
  const getUserData = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try { return JSON.parse(userString); }
      catch (e) { console.error("Erro ao parsear dados do usuário do localStorage:", e); return null; }
    }
    return null;
  };

  // Função para apagar o anúncio
  const handleDelete = async () => {
    if (!anuncio || !window.confirm('Tem certeza que deseja apagar este anúncio?')) {
      return;
    }

    setLoadingDelete(true);
    setError('');
    setDeleteMessage('');

    const token = getToken();
    const user = getUserData();

    if (!token || !user || !user.id) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      setLoadingDelete(false);
      // Poderia chamar onClose() aqui para fechar o modal e talvez redirecionar
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/marketplace/${anuncio.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDeleteMessage('Anúncio apagado com sucesso!');
        // Chama a função de callback passada pelo pai para notificá-lo
        onDeleteSuccess();
        setTimeout(onClose, 1500); // Fecha o modal após 1.5s para exibir a mensagem
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao apagar o anúncio.');
      }
    } catch (err) {
      console.error('Erro na requisição para apagar anúncio:', err);
      setError('Não foi possível conectar ao servidor para apagar o anúncio.');
    } finally {
      setLoadingDelete(false);
    }
  };

  // Se o anúncio não for passado ou for nulo (após deletar), não renderiza o conteúdo
  if (!anuncio) {
    return null;
  }

  return (
    <div className="modal-backdrop"> {/* Fundo escuro do modal */}
      <div className="modal-content"> {/* Conteúdo principal do modal */}
        <button className="btn" onClick={onClose}>X</button>
        <h1>Detalhes do Seu Anúncio</h1>

        {deleteMessage && <p className="mensagem sucesso">{deleteMessage}</p>}
        {error && <p className="mensagem erro">{error}</p>}

        <div className="anuncio-details">
          <h2>{anuncio.title}</h2>
          <p><strong>Descrição:</strong> {anuncio.description}</p>
          <p><strong>Preço:</strong> R$ {parseFloat(anuncio.price).toFixed(2)}</p>
          <p><strong>Disponível:</strong> {anuncio.available ? 'Sim' : 'Não'}</p>
          <p><strong>Cadastrado por:</strong> {anuncio.provider ? anuncio.provider.name : 'Desconhecido'}</p>
        </div>

        <button onClick={handleDelete} disabled={loadingDelete} className="btn">
          {loadingDelete ? 'Apagando...' : 'Apagar Anúncio'}
        </button>
        <button onClick={onClose} disabled={loadingDelete} className='btn'>Fechar</button>
      </div>
    </div>
  );
}

export default AnuncioModal;