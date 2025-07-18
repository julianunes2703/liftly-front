import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login/Login';
import AgendarAulas from '../pages/aluno/aulaAluno/aulaAluno';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

// Mock do useNavigate para interceptar a navegação
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Fluxo completo: Login + Agendamento de Aula + Cancelamento', () => {
  const mockToken = 'fake-jwt';
  const mockUser = {
    id: 1,
    name: 'Aluno Teste',
    email: 'aluno@teste.com',
    tipo: 'student'
  };

  const mockGymId = 1;
  const mockAula = {
    id: 101,
    name: 'Yoga',
    instructor: { name: 'Instrutora Teste' },
    availableSlots: 5,
    startTime: new Date().toISOString(),
    isFull: false
  };

  const mockAgendamento = {
    id: 555,
    classId: 101,
    status: 'agendado'
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Login e fluxo de agendamento/cancelamento de aula', async () => {
    // === LOGIN ===
    axios.post.mockResolvedValueOnce({ data: { user: mockUser, token: mockToken } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'aluno@teste.com' }
    });

    fireEvent.change(screen.getByPlaceholderText(/Senha/i), {
      target: { value: '123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/users/login',
        { email: 'aluno@teste.com', password: '123' }
      );

    });

    // === AGENDAMENTO ===
    // Sequência de respostas:
    axios.get
      .mockResolvedValueOnce({ data: { gymId: mockGymId } }) // /usergym/my-gym
      .mockResolvedValueOnce({ data: [mockAula] })           // /schedules/available-classes
      .mockResolvedValueOnce({ data: [] });                  // /schedules (vazio)

    render(<AgendarAulas />);

    expect(await screen.findByText(/Yoga/i)).toBeInTheDocument();
    const botaoAgendar = screen.getByRole('button', { name: /Agendar/i });

    axios.post.mockResolvedValueOnce({ data: { message: 'Aula agendada com sucesso' } });

    axios.get
      .mockResolvedValueOnce({ data: [mockAula] })          // aulas após agendar
      .mockResolvedValueOnce({ data: [mockAgendamento] });  // agendamentos com 1 item

    fireEvent.click(botaoAgendar);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/schedules/book',
        { classId: mockAula.id },
        expect.objectContaining({ headers: { Authorization: `Bearer ${mockToken}` } })
      );
    });

    expect(await screen.findByRole('button', { name: /Cancelar/i })).toBeInTheDocument();

    // === CANCELAMENTO ===
    axios.put.mockResolvedValueOnce({ data: { message: 'Agendamento cancelado com sucesso' } });

    axios.get
      .mockResolvedValueOnce({ data: [mockAula] }) // aulas
      .mockResolvedValueOnce({ data: [] });        // agendamentos vazios novamente

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:3001/schedules/cancel/${mockAgendamento.id}`,
        {},
        expect.objectContaining({ headers: { Authorization: `Bearer ${mockToken}` } })
      );
    });

    expect(await screen.findByRole('button', { name: /Agendar/i })).toBeInTheDocument();
  });
});
