import React, { Component } from 'react';
import SACEInput from '../../../src//components/inputs/SACEInput';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import TituloPagina from '../../components/TituloPagina';
import { Form } from 'react-bootstrap';
import axios from 'axios';

class Parecer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requisicao: {
                dataRequisicao: "",
                parecer: "",
                deferido: "escolha",
                disciplinaSolicitada: "",
                usuario: "",
                anexos: [],
                formacaoAtividadeAnterior: "",
                criterioAvaliacao: "", tipo: ""
            }
        }
    }
    async componentDidMount() {
        await axios.get(`/api/requisicoes/${this.props.match.params.id}`).then((retorno) =>
            this.setState({ requisicao: retorno.data })
        )
        console.log(this.state.requisicao.deferido);
    }
 
    atualizar() {
        axios.put(`/api/requisicoes/${this.props.match.params.id}`, {
            tipo: "aproveitamento",
            deferido:this.state.deferido,
            parecer:this.state.parecer,
            usuario:{
                tipo:"servidor"
            }

        })
    }
    render() {
        return (<div>
            <Form.Group className="col-md-6 container">

                <TituloPagina titulo="Parecer do Aluno" />
                <SACEInput
                    label={'Nome'}
                    value={this.state.requisicao.usuario.nome}
                    disabled={true}

                />
                <SACEInput
                    label={'Data Requisição'}
                    value={this.state.requisicao.dataRequisicao}
                    disabled={true} />
                <SACEInput
                    label={'Nome da disciplina'}
                    value={this.state.requisicao.disciplinaSolicitada.nome}
                    disabled={true} />

                <div>Status </div>
                <br />
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio"
                        id="DEFERIDO" name="customRadioInline1" class="custom-control-input"
                        onChange={(e) => this.setState({ deferido: e.target.id })}
                        defaultChecked={false}
                        />
                    <label class="custom-control-label" for="DEFERIDO">Deferido</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="INDEFERIDO" name="customRadioInline1" class="custom-control-input"
                        onChange={(e) => this.setState({ deferido: e.target.id })}
                        defaultChecked={false}/>
                    <label class="custom-control-label" for="INDEFERIDO">Indeferido</label><br /><br />
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="AGUARDANDO DOCUMENTOS" name="customRadioInline1" class="custom-control-input"
                        onChange={(e) => this.setState({ deferido: e.target.id })}
                        defaultChecked={false}
                    />
                    <label class="custom-control-label" for="AGUARDANDO DOCUMENTOS">Aguardando documentos</label><br /><br />
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="EM ANÁLISE" name="customRadioInline1" class="custom-control-input"
                        onChange={(e) => this.setState({ deferido: e.target.id})}
                        defaultChecked={this.state.requisicao.deferido === "EM ANÁLISE" ? true : false}
                    />
                    <label class="custom-control-label" for="EM ANÁLISE">Em análise</label><br /><br />
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="escolha" name="customRadioInline" class="custom-control-input"
                     checked   />
                     <label class="custom-control-label" for="escolha" style={{display:"none"}}></label><br /><br />
                </div>
                <br />
                <ol>
                    {
                        this.state.requisicao.anexos.map((a) => {
                            return <li>
                                <a href={a.arquivo} download>{a.nome}</a>
                            </li>
                        })
                    }
                </ol>



                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Parecer</Form.Label>
                    <Form.Control as="textarea" rows="3"
                        id={this.state.parecer}
                        value={this.state.parecer}
                        onChange={(e) => this.setState({ parecer: e.target.value })}
                    />
                </Form.Group>
                
                <div className="row container" style={{ position: 'relative', left: '32%' }}>
                <Link to="/minhas-requisicoes"> <Button onClick={(e) => this.atualizar()} className="btn btn-dark" data-toggle="modal" data-target="#exampleModal" style={{ border: "5px solid white" }}>Enviar</Button></Link>
                    <Link to="/minhas-requisicoes"> <Button variant="primary" className="btn btn-primary m-1" >Voltar </Button></Link>
                </div>

            </Form.Group>


        </div>);
    }
}
export default Parecer;