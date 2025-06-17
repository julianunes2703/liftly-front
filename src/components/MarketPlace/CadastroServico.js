import React, { useState, useEffect } from 'react';
import './cadastroServico.css';
import { useNavigate } from 'react-router-dom'; // Para redirecionar
import AnuncioModal from './anuncioModal';

function CadastroServico() {
  const navigate = useNavigate();

  // Estados para os dados do formulário
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    available: true,
  });

  // Estados para mensagens (sucesso/erro) e carregamento
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false); // Loading para o envio do formulário

  const [showModal, setShowModal] = useState(false); // Controla a visibilidade do modal
  const [anuncioDoPersonal, setAnuncioDoPersonal] = useState(null); // Armazena o anúncio para o modal
  const [loadingAnuncio, setLoadingAnuncio] = useState(false); // Loading para buscar o anúncio
  const [anuncioError, setAnuncioError] = useState(''); // Erro ao buscar o anúncio


  // --- Funções para obter dados do localStorage ---
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUserData = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error("Erro ao parsear dados do usuário do localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const fetchAnuncioDoPersonal = async () => {
    setLoadingAnuncio(true);
    setAnuncioError('');
    const user = getUserData();
    const token = getToken();

    if (!token || !user || !user.id || (user.tipo !== 'teacher' && user.tipo !== 'nutritionist')) {
      setAnuncioError('Não autenticado ou sem permissão.');
      setLoadingAnuncio(false);
      // Redirecionar, se necessário, mas o useEffect principal já faz isso.
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/marketplace/service/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnuncioDoPersonal(data);
      } else if (response.status === 404) {
        setAnuncioDoPersonal(null); // Nenhum anúncio encontrado
        setAnuncioError('Nenhum anúncio cadastrado para o seu perfil.');
      } else {
        const errorData = await response.json();
        setAnuncioError(errorData.error || 'Erro ao buscar o anúncio.');
      }
    } catch (err) {
      console.error('Erro na requisição para buscar anúncio:', err);
      setAnuncioError('Não foi possível conectar ao servidor para buscar o anúncio.');
    } finally {
      setLoadingAnuncio(false);
    }
  };

  // NOVO: Função para abrir o modal
  const handleOpenModal = async () => {
    await fetchAnuncioDoPersonal(); // Tenta buscar o anúncio antes de abrir o modal
    setShowModal(true); // Abre o modal
  };

  // NOVO: Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setAnuncioDoPersonal(null); // Limpa o anúncio do estado ao fechar
    setAnuncioError(''); // Limpa erros
  };

  // NOVO: Função chamada pelo modal quando o anúncio é deletado com sucesso
  const handleAnuncioDeleted = () => {
    setAnuncioDoPersonal(null); // Atualiza o estado para refletir que não há mais anúncio
    setMensagem('Seu anúncio foi removido com sucesso!'); // Exibe uma mensagem de sucesso no formulário principal
    setShowModal(false); // Fecha o modal
    // Você pode chamar fetchAnuncioDoPersonal() novamente se quiser garantir o estado,
    // mas setando null já deve ser suficiente.
  };

  // ... (o restante do seu useEffect existente para verificação de autenticação)
  useEffect(() => {
    const user = getUserData();
    const token = getToken();

    if (!token || !user || !user.id || !user.tipo) {
      console.warn("Usuário não autenticado ou dados incompletos. Redirecionando para login.");
      navigate('/login');
      return;
    }

    if (user.tipo !== 'teacher' && user.tipo !== 'nutritionist') {
      console.warn("Acesso negado: Usuário não tem permissão para cadastrar serviços.", user.tipo);
      setErro('Você não tem permissão para cadastrar um serviço. Apenas Personal Trainers e Nutricionistas podem fazê-lo.');
    }
  }, [navigate]);

 


  // Efeito para verificar autenticação e permissão ao carregar o componente
  useEffect(() => {
    const user = getUserData();
    const token = getToken();

    // Se não há token ou dados do usuário, redireciona para o login
    if (!token || !user || !user.id || !user.tipo) {
      console.warn("Usuário não autenticado ou dados incompletos. Redirecionando para login.");
      navigate('/login');
      return; // Interrompe a execução para não tentar renderizar o formulário
    }

    // Validação de permissão: apenas 'teacher' ou 'nutritionist' podem cadastrar
    if (user.tipo !== 'teacher' && user.tipo !== 'nutritionist') {
      console.warn("Acesso negado: Usuário não tem permissão para cadastrar serviços.", user.tipo);
      setErro('Você não tem permissão para cadastrar um serviço. Apenas Personal Trainers e Nutricionistas podem fazê-lo.');
      // Opcional: Redirecionar para uma página de erro ou dashboard, em vez de mostrar o formulário
      // navigate('/dashboard');
    }

  }, [navigate]); // O array vazio [] assegura que o useEffect roda apenas uma vez ao montar

  // Função para lidar com a alteração dos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setMensagem(''); // Limpa mensagens anteriores
    setErro('');     // Limpa erros anteriores
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de carregamento
    setMensagem('');
    setErro('');

    const token = getToken();
    const user = getUserData();

    // Verificações finais antes de enviar
    if (!token || !user || !user.id || !user.tipo) {
      setErro('Sessão expirada ou dados do usuário ausentes. Por favor, faça login novamente.');
      setLoading(false);
      // Redireciona, caso ainda não tenha sido feito pelo useEffect
      navigate('/login');
      return;
    }

    const providerId = user.id;
    const userRole = user.tipo; // Seu back-end espera 'role', então mapeamos 'tipo' para 'role'

    // Validação de permissão (repetida aqui para garantir no momento do submit)
    if (userRole !== 'teacher' && userRole !== 'nutritionist') {
      setErro('Você não tem permissão para cadastrar um serviço. Apenas Personal Trainers e Nutricionistas podem fazê-lo.');
      setLoading(false);
      return;
    }

    try {
      // Ajuste a URL da sua API conforme o seu app.use() no back-end
      // Exemplo: http://localhost:3001/api/marketplace/SEU_PROVIDER_ID
     const response = await fetch(`http://localhost:3001/marketplace/${providerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Envia o token para o authMiddleware
        },
        body: JSON.stringify({
          ...form,
          role: userRole, // Envia o papel do usuário para o back-end
        }),
      });

      const data = await response.json();

      if (response.ok) { // Se o status HTTP for 2xx (ex: 200, 201)
        setMensagem('Serviço salvo com sucesso!');
        // Opcional: Limpar o formulário após o sucesso
        setForm({
          title: '',
          description: '',
          price: '',
          available: true,
        });
      } else {
        // Exibe erro do back-end ou mensagem genérica
        setErro(data.error || 'Erro ao salvar o serviço. Verifique os dados e tente novamente.');
        console.error('Erro retornado pelo servidor:', data);
      }
    } catch (error) {
      console.error('Erro na requisição (rede ou servidor indisponível):', error);
      setErro('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  // Lógica de renderização condicional (exibe o formulário SOMENTE se o usuário tiver permissão)
  const user = getUserData(); // Pega os dados do usuário novamente para a renderização
  if (!user || (user.tipo !== 'teacher' && user.tipo !== 'nutritionist')) {
      // Se não há usuário logado ou o tipo de usuário não permite cadastro de serviço,
      // exibe uma mensagem de acesso negado. O useEffect já deve ter redirecionado,
      // mas esta é uma segunda camada de segurança visual.
      return (
          <div className="pagina-cadastro-servico">
              <h2>Acesso Negado</h2>
              <p>Você precisa estar logado como Personal Trainer ou Nutricionista para cadastrar um serviço.</p>
              {/* Opcional: Botão para ir para a tela de login */}
              <button onClick={() => navigate('/login')}>Fazer Login</button>
          </div>
      );
  }

  // Se o usuário tem permissão, renderiza o formulário
  return (
    <div className="pagina-cadastro-servico">
      <form onSubmit={handleSubmit} className="form-servico">
        <h1>Cadastro de Anúncio</h1>
        <label>Título</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required disabled={loading} />
        <label>Descrição</label>
        <textarea name="description" value={form.description} onChange={handleChange} disabled={loading} />
        <label>Preço (R$)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required disabled={loading} />
        <label className="checkbox">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} disabled={loading} />
          Disponível para contratação
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Serviço'}
        </button>

        {mensagem && <p className="mensagem sucesso">{mensagem}</p>}
        {erro && <p className="mensagem erro">{erro}</p>}
      </form>

      
      {user && (user.tipo === 'teacher' || user.tipo === 'nutritionist') && (
        <button
          className="visualizar-anuncio-btn"
          onClick={handleOpenModal}
          disabled={loading || loadingAnuncio}
        >
          {loadingAnuncio ? 'Buscando Anúncio...' : 'Visualizar Meu Anúncio'}
        </button>
      )}

      {/* ... Modal rendering ... */}
      {showModal && (
        <AnuncioModal
          anuncio={anuncioDoPersonal}
          onClose={handleCloseModal}
          onDeleteSuccess={handleAnuncioDeleted}
        />
      )}
    </div>
  );
}

export default CadastroServico;