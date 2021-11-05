import React, { Component } from 'react';
import TituloPagina from '../components/TituloPagina';
import TabelaAproveitamentos from '../components/TabelaAproveitamentos';
import TabelaCertificacoes from '../components/TabelaCertificacoes';
import { get, post } from '../services/ServicoCrud'
import { Form, Button, Alert, Container, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import SACEInput from '../components/inputs/SACEInput';
import { format } from '../auxiliares/FormataData';
import CardAproveitamento from '../components/CardAproveitamento';
import CardCertificacao from '../components/CardCertificacao';

class MinhasRequisicoes extends Component {
  constructor(props) {
    super();
    this.state = {
      requisicoes: "", escolha: "", id: "", user: "", alunos: [], pesquisa: false, selecionaPesquisa: "", dataInicio: "",
      dataFinal: "", dataInicioInvalida: false, dataFinalInvalida: false, msgErrorPesquisaNome: "", status: null, msgErrorStatus: "", cursos: [], idCurso: "", msgErrorCurso: "",
      alert: false, last: "", first: "", total: "", page: 0, pararPesquisaData: false, mostraBotao: false, listaRequisicaoCoordenador:[],listaRequisicaoCoordenadorAproveitamento:[],
       posicao: "row", tipoRequisicao: "", requisicoesPesquisa: [], tipoRequisicaoEscolha: "", mostraPesquisa: true, mostraBotaoVoltar: false, alertPesquisa: false
    }
  }

  async componentDidMount() {
    this.listaAth()
    this.carregaAlunos()
    this.carregaCursos()
    this.listarDisciplinas()
  
  }
  async listaAth() {
    await get("usuarios/auth/").then((retorno) => {
      this.setState({ user: retorno })
    })
    
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

  async alunoPeloId(e) {
    await get(`usuarios/${e}`).then((retorno) => {
      this.setState({ user: retorno })
    })
  }
  async listarDisciplinas() {
    await get(`cursos/${this.state.idCurso}disciplinas/`).then((retorno) => {
      if (retorno) this.setState({ disciplinas: retorno })
    });
  }

  
  async todasRequisicoes() {
    this.setState({ dataInicioInvalida: "", dataFinalInvalida: "" })
    if (!this.state.user.id) {
      this.setState({ msgErrorPesquisaNome: "Selecione nome do aluno", requisicoesAluno: "", user: "", mostraBotao: false })
      return
    }

    await get(`requisicoes/alunos/${this.state.user.id}?page=${this.state.page}&size=6`).then((retorno) => {
      this.setState({ requisicoesAluno: retorno && retorno.content, msgErrorPesquisaNome: "", last: retorno.last, first: retorno.first, total: retorno.totalPages, mostraBotao: true })
      if (this.state.requisicoesAluno && this.state.requisicoesAluno.length === 0) {
        this.setState({ alert: true, mostraBotao: false })
        setTimeout(() => {
          this.setState({ alert: false })
        }, 3000)
      }
    })
  }
  limpar() {
    this.setState({
      requisicoes: "", selecionaPesquisa: "", requisicoesAluno: "", msgErrorPesquisaNome: "", msgErrorStatus: "", requisicoesStatus: "", msgErrorCurso: "",
      page: "", pararPesquisaData: false, mostraBotao: false,idDisciplina:"",id:"",idCurso:""
    })
  }
  
  async filtro() {
    if (!this.state.tipoRequisicao) {
      this.setState({ tipoRequisicaoEscolha: "Campo tipo de requisição é obrigatório" })
      return
    }
    this.setState({ mostraPesquisa: false, mostraBotaoVoltar: true })
    await post("requisicoes/filtro/", {
      tipoRequisicao: this.state.tipoRequisicao,
      dataInicio: this.state.dataInicio && format(this.state.dataInicio),
      dataFinal: this.state.dataFinal && format(this.state.dataFinal),
      idCurso: this.state.idCurso,
      idDisciplina: this.state.idDisciplina,
      statusRequisicao: this.state.status,
      idAluno: this.state.id
    }).then((r) => {
      console.log(r.data.length);

      if (r && r.data.length === 0) {
        this.setState({ alertPesquisa: true, mostraPesquisa: true, mostraBotaoVoltar: false })
        setTimeout(() => {
          this.setState({ alertPesquisa: false })
        }, 4000);
      } else {
        this.setState({ requisicoesPesquisa: r && r.data, tipoRequisicaoEscolha: "" })
      }
    })
    this.limpar()

  }



  render() {
    return (
      <><br />
        <Alert show={this.state.alertPesquisa} variant={"danger"}>Não foram encontradas requisições</Alert>
        <TituloPagina titulo={'Visualizar Requisições'} />
        <div style={{ display: "flex", flexDirection: this.state.posicao }}>
          {this.state.pesquisa === true ? "" : <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="aproveitamento" name="customRadioInline1" className="custom-control-input"
              onChange={(e) => this.setState({ requisicoes: e.target.id, pesquisa: false })} />
            <label id="mudarCor" className="custom-control-label" htmlFor="aproveitamento">Aproveitamento de estudos</label>
          </div>}
          {this.state.pesquisa === true ? "" : <> <div className="custom-control custom-radio custom-control-inline">
            <input type="radio" id="certificacao" name="customRadioInline1" className="custom-control-input"
              onChange={(e) => this.setState({ requisicoes: e.target.id, pesquisa: false }) } />
            <label id="mudarCor" className="custom-control-label" htmlFor="certificacao">Certificação de conhecimentos</label>
          </div>
            <div className="custom-control custom-radio ">
              <input type="radio" id="pesquisar" name="customRadioInline1" className="custom-control-input"
                onChange={(e) => this.setState({ pesquisa: true, requisicoes: "", user: "", posicao: "column" })} />
              <label id="mudarCor" className="custom-control-label" htmlFor="pesquisar">Pesquisar</label>&nbsp;&nbsp;&nbsp;&nbsp;
        </div></>}
          {this.state.pesquisa === false ? "" : <><div style={{ display: "flex" }}>
            <div className="custom-control custom-radio ">
              <input type="radio" id="certificaoPesquisa" name="customRadioInline1" className="custom-control-input"
                onChange={(e) => this.setState({ tipoRequisicao: "requisicoes_certificacao", requisicoesPesquisa: "", mostraPesquisa: true, mostraBotaoVoltar: false })} />
              <label id="mudarCor" className="custom-control-label" htmlFor="certificaoPesquisa">Certificação de Conhecimento</label>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
            <div className="custom-control custom-radio ">
              <input type="radio" id="aproveitamentoPesquisa" name="customRadioInline1" className="custom-control-input"
                onChange={(e) => this.setState({ tipoRequisicao: "requisicoes_aproveitamento", requisicoesPesquisa: "", mostraPesquisa: true, mostraBotaoVoltar: false })} />
              <label id="mudarCor" className="custom-control-label" htmlFor="aproveitamentoPesquisa">Aproveitamento de Estudos</label>&nbsp;&nbsp;&nbsp;&nbsp;
        </div></div>
            {this.state.mostraPesquisa && <>
              <Form.Text className="text-danger">{this.state.tipoRequisicaoEscolha} </Form.Text>
              <Form.Group controlId="exampleForm.SelectCustom">
                <br />
                <Form.Label>Selecione curso para sua pesquisa</Form.Label>
                <Form.Control as="select" custom
                  onClick={() => this.listarDisciplinas()}
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
                      this.setState({ idDisciplina: e.target.value })
                    }} >
                  <option key={0} value={""}></option>
                  {this.state.disciplinas && this.state.disciplinas.map((d) =>

                    <option key={d.id} value={d.id}>{d.nome}</option>)}
                </Form.Control>
                <Form.Text className="text-danger">{this.state.msgErrorCurso} </Form.Text>
              </Form.Group>

              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label>Selecione nome do aluno </Form.Label>
                <Form.Control as="select" custom
                  id={this.state.id}
                  value={this.state.id}
                  onChange={
                    (e) => {
                      this.alunoPeloId(e.target.value);
                      this.setState({ id: e.target.value })
                    }}
                >
                  <option key={0} value={""}></option>
                  {this.state.alunos.map((a) =>
                    <option key={a.id} value={a.id} >{a.perfil.nome}</option>
                  )}
                </Form.Control>
                <Form.Text className="text-danger">{this.state.msgErrorPesquisaNome} </Form.Text>
              </Form.Group>

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

              < Form >
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
                <Button onClick={() => this.filtro()}>Pesquisar</Button>&nbsp;&nbsp;&nbsp;
          <Link to="/tela-transicao" onClick={() => this.setState({ pesquisa: false, id: "" })}><Button variant={"danger"}>Voltar</Button></Link>
              </Form></>

            }

          </>
          }
        </div>

        <Alert variant={"danger"} show={this.state.alert}>Não existem requisições para essa pesquisa </Alert>


        <br />
        {
          this.state.requisicoes === "aproveitamento" ? <TabelaAproveitamentos user={this.state.user} verifica={this.state.mostraRequisicaoCoordenador}  /> : this.state.requisicoes === "certificacao" ?
            <TabelaCertificacoes user={this.state.user} verifica={this.state.mostraRequisicaoCoordenador} /> : ""} <br /><br />
        {this.state.mostraBotao && <h3> Requisições encontradas</h3>}<br />
        {
          <Container>
            <Row>
              {

                this.state.requisicoesPesquisa && this.state.requisicoesPesquisa.map((requisicao) => {
                  const requisicaoEnviar = {
                    id: requisicao.id,
                    dataRequisicao: format(requisicao.data),
                    usuario: {
                      perfil: {
                        nome: requisicao.nomeUsuario
                      }
                    },
                    disciplinaSolicitada: {
                      nome: requisicao.nomeDisciplina
                    },
                    deferido: requisicao.status,
                    professor: {
                      perfil: {
                        nome: requisicao.professor
                      }
                    }
                  }
                  if (this.state.tipoRequisicao === "requisicoes_aproveitamento") {
                    return <CardAproveitamento requisicao={requisicaoEnviar} />
                  } else {
                    return <CardCertificacao requisicao={requisicaoEnviar} />
                  }


                })}

            </Row>
            {this.state.mostraBotaoVoltar && <Button variant={"danger"} onClick={() =>
              this.setState({ mostraPesquisa: true, mostraBotaoVoltar: false, dataInicio: null, dataFinal: null, idCurso: null, idDisciplina: null, status: null, requisicoesPesquisa: "" })}>Voltar para pesquisa</Button>
            }
          </Container>

        }
    
      </>);

  }
}
export default MinhasRequisicoes;


