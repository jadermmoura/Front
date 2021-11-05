import React, { Component } from 'react';
import { get ,post} from '../services/ServicoCrud';
import { format2,format } from '../auxiliares/FormataData';
import { Form, Button , Table,Alert} from 'react-bootstrap';
import SACEInput from '../components/inputs/SACEInput';


class RelatorioCertificacao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "", alunos: [], dataInicio: null, listaFiltro:[],mostraPesquisa:false, tipoRequisicao: "requisicoes_certificacao",idDisciplina:null,alert:false,mostraSelecao:true,
      dataFinal: null, dataInicioInvalida: false, dataFinalInvalida: false, msgErrorPesquisaNome: "", status: null, msgErrorStatus: "", cursos: [], idCurso: null, msgErrorCurso: "",
      requisicoesDisciplina: []
    }
  }

  componentDidMount() {
    this.carregaAlunos()
    this.carregaCursos()
  }

  async carregaAlunos() {
    await get("usuarios/alunos/").then((retorno) => {
      this.setState({ alunos: retorno })
    })
  }
  async carregaCursos() {
    await get("cursos/").then((retorno) => {
      this.setState({ cursos: retorno })
    })
  }
  
  async listarDisciplinas() {
    console.log(this.state.idCurso);
    await get(`cursos/${this.state.idCurso}disciplinas/`).then((retorno) => {
      console.log(retorno);
      if (retorno) this.setState({ disciplinas: retorno })
    });
  }

  async filtro() {
this.setState({mostraSelecao:false})
    await post("requisicoes/filtro/", {
      tipoRequisicao: this.state.tipoRequisicao,
      dataInicio: this.state.dataInicio && format(this.state.dataInicio),
      dataFinal: this.state.dataFinal && format(this.state.dataFinal),
      idCurso: this.state.idCurso,
      idDisciplina: this.state.idDisciplina,
      statusRequisicao:this.state.status
    }).then((r) => {
      if (r && r.data.length === 0) {
        this.setState({ alert:true,mostraPesquisa:false,mostraSelecao:true})
        this.limpar()
        setTimeout(() => {
          this.setState({alert:false})
        }, 3000);
      }else{
        this.setState({ listaFiltro: r.data, mostraPesquisa: true })
      }
    })
  }
  limpar() {
    this.setState({ mostraPesquisa: false ,mostraSelecao:true,dataInicio:"",dataFinal:"",idDisciplina:""  })
  }
  render() {
    return (
      <div>   <br /><br />
      {this.state.mostraSelecao&& 
      <>
 <h3>Solicitações de Certificação de Conhecimentos</h3>
        <Alert variant={"danger"} show={this.state.alert}>Não foram encontradas solicitações para pesquisa</Alert>
        < Form >
          <Form.Group controlId="exampleForm.SelectCustom">
            <br />
            <Form.Label>Selecione curso para sua pesquisa</Form.Label>
            <Form.Control as="select" custom
              id={this.state.idcurso}
              value={this.state.idcurso}
              onClick={() => this.listarDisciplinas(this.state.idcurso)}
              onChange={
                (e) => {
                  this.setState({ idCurso: e.target.value })
                }} >
              <option key={0} value={""}></option>
              {this.state.cursos && this.state.cursos.map((c) =>
                <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Form.Control>
            <Form.Text className="text-danger">{this.state.msgErrorCurso} </Form.Text>
          </Form.Group>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Selecione disciplina do curso</Form.Label>
            <Form.Control as="select" custom
             id={this.state.idDisciplina}
             value={this.state.idDisciplina}
              onChange={
                (e) => {
                  this.setState({idDisciplina:e.target.value})
                }} >
              <option key={0} value={""}></option>
              {this.state.disciplinas && this.state.disciplinas.map((d) =>
                <option key={d.id} value={d.id}>{d.nome}</option>)}
            </Form.Control>
            <Form.Text className="text-danger">{this.state.msgErrorCurso} </Form.Text>
          </Form.Group>
          < Form >


            <Form.Group controlId="exampleForm.SelectCustom">

              <Form.Label>Selecione status da requisição</Form.Label>
              <Form.Control as="select" custom
                onChange={
                  (e) => {
                    this.setState({ status: e.target.value })
                  }} >
                <option key={0} value={""}></option>
                <option >DEFERIDO</option>
                <option >EM ANÁLISE</option>
                <option >INDEFERIDO</option>

              </Form.Control>
              <Form.Text className="text-danger">{this.state.msgErrorStatus} </Form.Text>
            </Form.Group>

          </Form>
        </Form>
        <SACEInput
          type={"date"}
          label={'Apartir do dia '}
          value={this.state.dataInicio}
          disabled={this.state.pararPesquisaData}
          placeholder={'pesquisa por data. '}
          onChange={(e) => this.setState({ dataInicio: e.target.value })}
          onError={this.state.dataInicioInvalida}
          onErrorMessage={'Você não inseriu uma data válida!'}
        />

        <SACEInput
          type={"date"}
          label={'Até o dia '}
          value={this.state.dataFinal}
          disabled={this.state.pararPesquisaData}
          placeholder={'pesquisa por data. '}
          onChange={(e) => this.setState({ dataFinal: e.target.value })}
          onError={this.state.dataFinalInvalida}
          onErrorMessage={'Você não inseriu uma data válida!'}
        />
        <Button onClick={() => this.filtro()}>Pesquisar</Button></>
      }
       
        {this.state.mostraPesquisa &&
          <>
            <br /><br />
            <h1 style={{ textAlign: "center" }}>Relatório de Requisições de Certificação de Conhecimentos</h1><br />
            <Table id="imprimir" striped bordered hover >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Solicitação</th>
                  <th>Data da Solicitação</th>
                  <th>Disciplina Solicitada</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {this.state.listaFiltro && this.state.listaFiltro.map((r) =>
                  <tr>
                    <td>{r.nomeUsuario}</td>
                    <td>{r.matriculaUsuario}</td>
                    <td>{"Certificação de Conhecimentos"}</td>
                    <td>{format2(r.data)}</td>
                    <td>{r.nomeDisciplina}</td>
                    <td>{r.status}</td>
                  </tr>
                )}
              </tbody>
            </Table><br />
            <Button onClick={() => window.print() +
              this.setState({ mostraPesquisa: true })
            }>Imprimir</Button>&nbsp;&nbsp;
            <Button variant={"danger"} onClick={() => this.limpar()}>Voltar</Button>
          </>}
      </div>
    );
  }
}

export default RelatorioCertificacao;