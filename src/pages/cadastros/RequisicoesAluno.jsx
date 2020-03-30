import React, { Component } from 'react';
import TituloPagina from '../components/TituloPagina';
import TabelaAproveitamentos from '../components/TabelaAproveitamentos';
import TabelaCertificacoes from '../components/TabelaCertificacoes';
import { Button } from 'react-bootstrap';
import SACEInput from '../components/inputs/SACEInput';
import axios from 'axios';
import { Link } from "react-router-dom";

class MinhasRequisicoes extends Component {
  constructor(props) {
    super();
    this.state = {
      id: "",
      dataRequisicao: "",
      requisições: "", escolha: "",
      pesquisaRequisicoes: [],
      texto: false,
      disciplinaSolicitada: [
        this.state = {
          nome: ""
        }
      ],
      deferido: "",
      cont: "",
      parecer: "",
      usuario: [
        this.state = {
          momeUsuario: "",
          nomeAluno: ""
        }],
       
    }
  }

  listarRequisicoesNome() {

    if (typeof this.state.nomeDisciplina === "undefined" || this.state.nomeDisciplina.length === 0
    ) {
      this.setState({ texto: true })
    }
    axios.get(`/api/requisicoes/nome/${this.state.nomeDisciplina}`).then((retorno) => {
      this.setState({
        pesquisaRequisicoes: retorno.data,
      })
      if (this.state.pesquisaRequisicoes.length === 0) {
        this.setState({ texto: true })
      }
      if (this.state.pesquisaRequisicoes.length !== 0) {
        this.setState({ texto: false })
      }
      if (this.state.pesquisaRequisicoes.length !== 0) {
        this.setState({
          cont: "1",
        })
      } else { this.setState({ cont: "" }) }
    });
  }

  limpar() {
    this.setState({
      cont: "", texto: false, nomeDisciplina: "",
      parecer: "", nomeAluno: ""
    })
  }

  render() {

    return (
      <div>
        <TituloPagina titulo={'Visualizar Requisições'} />
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="aproveitamento" name="customRadioInline1" class="custom-control-input"
            onChange={(e) => this.setState({ requisições: e.target.id, cont: "" })}
           
          />
          <label class="custom-control-label" for="aproveitamento">Aproveitamento de estudos</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="certificacao" name="customRadioInline1" class="custom-control-input"
            onChange={(e) => this.setState({ requisições: e.target.id, cont: "" })} />
          <label id="mudarCor" class="custom-control-label" for="certificacao">Certificação de conhecimentos</label>
        </div>

        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="pesquisas" name="customRadioInline1" class="custom-control-input"
            onChange={(e) => this.setState({ requisições: e.target.id, cont: "" })} />
          <label class="custom-control-label" for="pesquisas" >Outros tipos de pesquisas</label>
        </div>
        <br /><br />
        {console.log(this.state.requisições)}
        

        {this.state.requisições === "pesquisas" ? <div class="form-group" id="pesquisas">
          <label for="exampleFormControlSelect2">Escolha o tipo de pesquisa </label>
          <select multiple class="form-control" id={""}
            onChange={(e) => this.setState({ id: e.target.value })}>
            <option id={this.nomeDisciplina}>Nome disciplina</option>
            <option id={this.nomeAluno}>Nome Aluno</option>
            <option id={this.parecer}>Indeferido</option>
          </select>
          {this.state.id === "" ? <SACEInput
            disabled={true}
            placeholder={'Selecione tipo de pesquisa no campo acima'}
            onError={this.state.texto}
          /> : this.state.id === "Nome disciplina" ? <SACEInput
            placeholder={'Digite aqui sua pesquisa'}
            value={this.state.nomeDisciplina}
            onChange={(e) => this.setState({ nomeDisciplina: e.target.value })}
            onError={this.state.texto}
            onErrorMessage={'Não encontrado'}
          /> : this.state.id === "Nome Aluno" ? <SACEInput
            placeholder={'Digite aqui sua pesquisa'}
            value={this.state.nomeAluno}
            onChange={(e) => this.setState({ nomeAluno: e.target.value })}
            onError={this.state.texto}
            onErrorMessage={'Não encontrado'}
          /> : <SACEInput
                  placeholder={'Digite aqui sua pesquisa'}
                  value={this.state.parecer}
                  onChange={(e) => this.setState({ parecer: e.target.value })}
                  onError={this.state.texto}
                  onErrorMessage={'Não encontrado'}
                />}

          {this.state.id === "nomeDisciplina" ? <Button style={{ position: 'relative' }} variant="primary" className="btn btn-primary m-1" onClick={(e) => this.listarRequisicoesNome()}>
            Enviar
          </Button> : <Button style={{ position: 'relative' }} variant="primary" className="btn btn-primary m-1" onClick={(e) => this.listarRequisicoesNome()}>
              Enviar</Button>}
          <Button style={{ position: 'relative' }} variant="danger" className="btn btn-primary m-1"
            onClick={(e) => this.limpar()}
          > Limpar </Button>
        </div> : ""}
        {this.state.cont === "" ? "" : <div id="FormPesquisaNome" Style={{ display: "none" }}><br /><br /><br />
          <h3>Lista de Todas as Requisições por nome da disciplina </h3>
          <table class="table" >
            <thead class="p-3 mb-2 bg-primary text-white">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Data</th>
                <th scope="col">Solicitante</th>
                <th scope="col">Disciplina</th>
                <th scope="col">Deferido</th>
              </tr>
            </thead>
            <tbody>
              {this.state.pesquisaRequisicoes &&
                this.state.pesquisaRequisicoes.map((requisicao) =>
                  <tr>
                    <td>{requisicao.id}</td>
                    <td>{requisicao.dataRequisicao}</td>
                     <Link to={`/parecer/${requisicao.id}`}><td>{requisicao.usuario.nome+""}</td></Link>
                    <td>{requisicao.disciplinaSolicitada.nome}</td>
                    <td>{requisicao.deferido+""}</td>
                  </tr>
                )}
            </tbody>
          </table></div>}
        {this.state.requisições === "aproveitamento" ? <div className="col-6"><br /> <br />
          <TabelaAproveitamentos /> </div> : this.state.requisições === "certificacao" ? <div className="col-6"><br /> <br />
            <TabelaCertificacoes /></div> : ""}</div>
    );
  }
}
export default MinhasRequisicoes;

