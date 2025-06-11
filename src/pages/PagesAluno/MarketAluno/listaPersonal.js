import React, { useEffect, useState } from 'react';
import './listaPersonal.css';
import Menu from '../../../components/menu-lateral/menu-lateral';
import Perfil from '../../../components/perfil/perfil';
import { FaStar } from "react-icons/fa";
import { LuUser } from "react-icons/lu";
import Buscar from '../../../components/buscar/buscar';
import { useNavigate } from 'react-router-dom';
import { getPersonals } from '../../../services/marketplaceService';

function ListaProfissionais() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [profissionais, setProfissionais] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await getPersonals();
        setProfissionais(data);
        setResultados(data);
      } catch (err) {
        console.error("Erro ao buscar profissionais:", err);
      }
    };

    carregar();
  }, []);

  const handleBusca = (e) => {
    const texto = e.target.value.toLowerCase();
    setBusca(texto);
    const filtrados = profissionais.filter((p) =>
      p.nome.toLowerCase().includes(texto)
    );
    setResultados(filtrados);
  };

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

      <h1>Liftly Market- Personais Trainers</h1>

      <Buscar onChange={handleBusca} value={busca} />

      <div className="cards-container">
        {resultados.map((p) => (
          <div key={p._id} className="card-profissional">
            <div className="imagem-profissional"><LuUser /></div>
            <div className="info-profissional">
              <strong>{p.nome}</strong>
              <p>{p.idade} anos</p>
              <p>{p.nota || 'N/A'} <FaStar /></p>
            </div>
            <button className="btn-vermais" onClick={() => navigate(`/paginaProfissional/${p._id}`)}>Ver mais</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaProfissionais;
