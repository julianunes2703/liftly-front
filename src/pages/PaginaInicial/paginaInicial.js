import React from 'react';
import "./paginaInicial.css";
import { useNavigate } from "react-router-dom";
import Header from '../../components/header-pg/header-pg';



function PaginaInicial() {
 const navigate = useNavigate();
  
  return (
    <div>
     <div className='pagina-inicial'> 
        <Header/>    
       <section className="home-container">
        <div className="bloco-esquerda">
            <h2 className="slogan-pi">Seu eu do futuro agradece</h2>
            <div className="botao">
            <button onClick={() => navigate('/login')}>Aluno</button>
            <button onClick={() => navigate('/login')}>Academia</button>
            <button onClick={() => navigate('/login')}>Personal Trainer</button>
            <button onClick={() => navigate('/login')}>Nutricionista</button>
            </div>
        </div>

        <div className="bloco-direita">

            <div className="imagem-pg">
            <img src={require('./img-paginaInicial.png')} alt="fotoPaginaInicial" />
            </div>
        </div>

    </section>
    </div> 
</div>
  );
}

export default PaginaInicial;
