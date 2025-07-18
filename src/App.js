import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicial from "./pages/PaginaInicial/paginaInicial";
import Login from './pages/Login/login';
import Cadastro from './pages/Cadastro/cadastro';
import EsqueceuSenha from './pages/EsqueceuSenha/esqueceuSenha';
import PerfilGlobal from './pages/PerfilGlobal/perfilGlobal';


import HomeAluno from './pages/PagesAluno/HomeAluno/homeAluno';
import AgendarAulas from './pages/PagesAluno/AulaAluno/aulaAluno';
import TreinoAluno from './pages/PagesAluno/TreinoAluno/treinoAluno';
import DietaAluno from './pages/PagesAluno/DietaAluno/dietaAluno';
import ListaProfissionais from './pages/PagesAluno/MarketAluno/listaPersonal';
import ListaNutricionistas from './pages/PagesAluno/MarketAluno/listaNutri';


import HomeAcademia from './pages/PagesAcademia/HomeAcademia/homeAcademia';
import CadastrarAluno from './pages/PagesAcademia/CadastroAluno/cadastroAluno';
import CadastrarAulas from './pages/PagesAcademia/CadastrarAulas/cadastrarAulas';
import CadastrarPersonal from './pages/PagesAcademia/CadastroPersonal/cadastroPersonal';
import LoginAcademia from './pages/PagesAcademia/LoginAcademia/loginAcademia';
import CadastroAcademia from './pages/PagesAcademia/CadastroAcademia/cadastroAcademia';

import HomeNutricionista from './pages/PagesNutricionista/HomeNutricionista/homeNutricionista';
import HomePersonal from './pages/PagesPersonal/HomePersonal/homePersonal';
import MarketPersonalFicha from './pages/PagesPersonal/MarketPersonal/marketPersonal-ficha';
import MarketNutricionistaDieta from './pages/PagesNutricionista/MarketNutricionista/marketNutricionista-dieta';
import CadastroServicoNutri from './pages/PagesNutricionista/MarketNutricionista/CadastrarServico/cadastroServicoNutri';
import CadastroServicoPersonal from './pages/PagesPersonal/MarketPersonal/CadastroServico/cadasatroServicoPersonal';
import ListaAlunoPersonal from './pages/PagesPersonal/ListaAlunosPersonal/listaAlunosPersonal';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/cadastro' element={<Cadastro/>} />
        <Route path='/esqueceuSenha' element={<EsqueceuSenha/>} />
        <Route path='/editarPerfil' element={<PerfilGlobal/>}/>

        
        <Route path='/homeAluno' element={<HomeAluno/>} />
        <Route path='/aulaAluno' element={<AgendarAulas/>} />
        <Route path='/treinoAluno' element={<TreinoAluno/>} />
        <Route path='/dietaAluno' element={<DietaAluno/>} />
        <Route path='/listaProfissionais' element={<ListaProfissionais/>} />
        <Route path="/listaNutricionistas" element={<ListaNutricionistas />} />
  


        <Route path='/homeAcademia' element={<HomeAcademia/>} />
        <Route path='/cadastroAluno' element={<CadastrarAluno/>} />
        <Route path='/cadastrarAulas' element={<CadastrarAulas/>} />
        <Route path='/cadastroPersonal' element={<CadastrarPersonal/>} />
        <Route path='/loginAcademia' element={<LoginAcademia/>} />
        <Route path='/cadastroAcademia' element={<CadastroAcademia/>} />

        <Route path='/homeNutricionista' element={<HomeNutricionista/>} />
        <Route path='/marketNutricionistaDieta' element={<MarketNutricionistaDieta/>} />
        <Route path='/cadastroServicoNutri' element={<CadastroServicoNutri/>} />

        <Route path='/homePersonal' element={<HomePersonal/>} />
        <Route path='/marketPersonalFicha' element={<MarketPersonalFicha/>} />
        <Route path='/cadastroServicoPersonal' element={<CadastroServicoPersonal/>} />
        <Route path='/listaAlunosPersonal' element={<ListaAlunoPersonal/>}/>

        
      </Routes>
    </Router>
  );
}

export default App;
