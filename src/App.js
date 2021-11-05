import React, {  useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Inicio from './pages/Inicio';
import NovaRequisicao from './pages/NovaRequisicao';
import MinhasRequisicoes from './pages/MinhasRequisicoes';
import RequisicoesCoordenadorCurso from './pages/Servidor/RequisicoesCoordenadorCurso';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import SACENavbar from './components/SACENavbar';
import CadastroPerfilAluno from './pages/cadastros/CadastroPerfilAluno';
import ListaCursos from './pages/Curso/ListaCurso';
import LoginForm from './components/forms/LoginForm'
import ListaDiscipinas from './Cursos/ListaDisciplina';
import CadastrarDisciplinas from './Cursos/CadastrarDisciplinas';
import CadastroPerfilServidor from './pages/cadastros/CadastroPerfilServidor';
import CadastroPerfilProfessor from './pages/cadastros/CadastroPerfilProfessor';
import ConfiguraDataSolicitacoes from './pages/ConfiguracaoSistema/ConfiguraDataSolicitacoes';
import ListaAlunos from '../src/Cursos/ListaAlunos';
import Parecer from '../src/components/inputs/Parecer';
import RequisicaoAluno from './pages/Aluno/RequisicaoAluno';
import DadosAluno from './pages/Aluno/DadosAluno';
import TelaTransicao from './pages/TelaTransicao';
import ListaProfessor from './pages/Professor/ListaProfessor';
import ListaServidor from './../src/pages/Servidor/ListaServidor';
import CadastroCurso from './pages/cadastros/CadastroCurso';
import EditarSenha from './pages/Professor/EditarSenha';
import RelatorioAproveitamento from './Relatorios/RelatorioAproveitamentoEstudos';
import RelatorioCertificacao from './Relatorios/RelatorioCertificacao';
import RelatorioFinal from './Relatorios/RelatorioFinal';
import PesquisaUsuario from '../src/pages/Pesquisas/PesquisaUsuario';
import './components/card.css';
import ImportadorCurso from './components/Importador/ImportadorCurso';
import ImportadorDisciplinas from './components/Importador/ImportadorDisciplinas';
import ImportadorProfessores from './components/Importador/ImportadorUsuarios';
require('dotenv').config();

function App() {
  const [userData, setUserData] = useState(null);

  const baseNAME = process.env.REACT_APP_BASE_NAME;
  
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props =>userData ? (<Component {...props} /> ): ( <Redirect to={{ pathname: "/login", state: { from: props.location } }} />)}
    />
  );
  return (
    <BrowserRouter basename={baseNAME}>
      {userData && <SACENavbar setUserData={setUserData} user={userData} />}
      <div className="container">
        <Switch>
          <Route exact path="/" component={Inicio} />
          <Route path="/login" render={({ history }) => <LoginForm history={history} setUserData={setUserData} />} />
          <Route path="/cadastro-aluno" component={CadastroPerfilAluno} />
          <PrivateRoute exact path="/tela-transicao/" component={TelaTransicao} />
          <PrivateRoute exact path="/minhas-requisicoes" component={MinhasRequisicoes} />
          <PrivateRoute exact path="/aluno-requisicoes/" component={RequisicaoAluno} />
          <PrivateRoute exact path="/nova-requisicao" component={()=><NovaRequisicao user={userData}/>} />
          <PrivateRoute exact path="/cadastrar-disciplina" component={CadastrarDisciplinas} />
          <PrivateRoute exact path="/cadastro-servidor" component={CadastroPerfilServidor} />
          <PrivateRoute exact path="/cadastro-professor" component={CadastroPerfilProfessor} />
          <PrivateRoute exact path="/cadastrar-curso" component={CadastroCurso} />
          <PrivateRoute exact path="/parecer/:id" component={Parecer} />
          <PrivateRoute exact path="/listar-curso" component={ListaCursos} />
          <PrivateRoute exact path="/lista-disciplina" component={ListaDiscipinas} />
          <PrivateRoute exact path="/lista-alunos" component={ListaAlunos} />
          <PrivateRoute exact path="/lista-professor" component={ListaProfessor} />
          <PrivateRoute exact path="/lista-servidor" component={ListaServidor} />
          <PrivateRoute exact path="/troca-senha" component={EditarSenha} />
          <PrivateRoute exact path="/relatorio-aproveitamento" component={RelatorioAproveitamento} />
          <PrivateRoute exact path="/relatorio-certificacao" component={RelatorioCertificacao} />
          <PrivateRoute exact path="/relatorio-final" component={RelatorioFinal} />
          <PrivateRoute exact path="/pesquisa-usuario" component={PesquisaUsuario} />
          <PrivateRoute exact path="/dados-aluno" component={DadosAluno} />
          <PrivateRoute exact path="/configuracao-data" component={ConfiguraDataSolicitacoes} />
          <PrivateRoute exact path="/requisicoes-coordenador" component={RequisicoesCoordenadorCurso} />
          <PrivateRoute exact path="/importador-cursos" component={ImportadorCurso} />
          <PrivateRoute exact path="/importador-disciplinas" component={ImportadorDisciplinas} />
          <PrivateRoute exact path="/importador-professores" component={ImportadorProfessores} />
          <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
