import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/marketplace'; // URL base para o seu MarketplaceService

// Função auxiliar para obter o token do aluno logado
const getToken = () => {
    // Suponha que o token do ALUNO esteja salvo em 'token' no localStorage
    // Certifique-se que seu login de aluno salva o token como 'localStorage.setItem("token", res.data.token);'
    return localStorage.getItem('token');
};

// Função para buscar serviços do marketplace com filtros
// Isso vai substituir as chamadas diretas para getNutritionists e getPersonals no front-end
export const getMarketplaceServices = async (filters = {}) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para ver o marketplace.");
        }

        // Constrói a URL com os filtros
        const params = new URLSearchParams();
        for (const key in filters) {
            if (filters[key]) {
                params.append(key, filters[key]);
            }
        }

        const response = await axios.get(`${API_BASE_URL}/services?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar serviços do marketplace:", error.response?.data || error);
        throw error; // Propaga o erro para o componente que chamou
    }
};

// Função para buscar um serviço específico por ID
export const getMarketplaceServiceById = async (serviceId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        const response = await axios.get(`${API_BASE_URL}/services/${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar serviço ${serviceId}:`, error.response?.data || error);
        throw error;
    }
};

// Funções para provedores (Personal Trainer / Nutricionista) gerenciarem seus anúncios
// Esta função é a 'createService' do back-end, mas no front-end ela gerencia o anúncio do provedor
export const manageProviderService = async (serviceData) => {
    try {
        const token = getToken(); // O token aqui é do provedor logado
        if (!token) {
            throw new Error("Provedor não autenticado. Faça login.");
        }

        // A rota de back-end createService no MarketplaceController agora faz findOrCreate
        // Então, ela serve tanto para criar o primeiro anúncio quanto para atualizá-lo
        const response = await axios.post(`${API_BASE_URL}/services`, serviceData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao gerenciar anúncio do provedor:", error.response?.data || error);
        throw error;
    }
};

// Função para provedores deletarem seus anúncios
export const deleteProviderService = async (serviceId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Provedor não autenticado.");
        }

        const response = await axios.delete(`${API_BASE_URL}/services/${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar serviço ${serviceId}:`, error.response?.data || error);
        throw error;
    }
};
