import React, { Component } from 'react';
import { get, getId, put } from '../../services/ServicoCrud';
import SACEInput from '../../components/inputs/SACEInput';
import { Button, Form, Modal, Alert } from 'react-bootstrap'
import axios from 'axios';

class ListaProfessor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            professores: [],
            siape: "", siapeInvalido: false, nome: "",
            coordenador: "", email: "", emailInvalido: false,
            mostrarEditar: false, id: "", alert: false,
            msgAlert: "", show: false, variant: "", page: 0,
            last: false,
            first: true,
            total: 0
        }
    }

    async componentDidMount() {
        get(`usuarios/pages?tipo=PROFESSOR&page=${this.state.page}&size=6`).then((retorno) => {
            if (retorno) this.setState({ professores: retorno, last: retorno.last, first: retorno.first, total: retorno.totalPages })
        }
        )
    }
    async  buscaPeloId(e) {
        this.limpar()
        getId("usuarios/", e).then((retorno) => {
            this.setState({
                id: retorno.id,
                nome: retorno.perfil.nome,
                email: retorno.email,
                siape: retorno.perfil.siape,
                coordenador: retorno.perfil.coordenador,
                mostrarEditar: true

            })
        })
    }
    limpar() {
        this.setState({
            nomeInvalido: false, siapeInvalido: false, emailInvalido: false
        })
    }
    async editar(e) {

        if (this.state.nome === "" || this.state.nome === null ? this.setState({ nomeInvalido: true }) : this.setState({ nomeInvalido: false })) { }
        if (this.state.siape === "" || this.state.siape === null || this.state.siape <= 0 ? this.setState({ siapeInvalido: true }) : this.setState({ siapeInvalido: false })) { }
        if (this.state.email === "" || this.state.email === null ? this.setState({ emailInvalido: true }) : this.setState({ emailInvalido: false })) { }
        if (this.state.nome === "" || this.state.nome === null || this.state.siape === "" || this.state.siape <= 0 || this.state.siape === null || this.state.email === "" || this.state.email == null) {
            return
        }
        put("usuarios", e,
            {
                email: this.state.email,
                perfil: {
                    nome: this.state.nome,
                    tipo: "PROFESSOR",
                    siape: this.state.siape,
                    coordenador: this.state.coordenador,
                }
            }).then(() => {
                this.setState({
                    mostrarEditar: false, nomeInvalido: false, siapeInvalido: false, emailInvalido: false, show: true,
                    variant: "success", msgAlert: "Atualizado com sucesso"
                })
                this.componentDidMount()
                setTimeout(() => { this.setState({ show: false }) }, 3000);
            })
    }
    deletar() {
        axios.delete("http://localhost:8080/api/usuarios/" + this.state.id).then((r) =>
            this.setState({ modalShow: false, show: true, variant: "danger", msgAlert: "Apagou com sucesso" }),
            this.componentDidMount()
        ).catch(() =>
            alert("Não pode apagar cadastro do professor ele possui requisição no sistema "),
            this.setState({ modalShow: false })
            , setTimeout(() => {
                this.setState({ show: false })
            }, 3000),
            this.componentDidMount()
        )
    }
    control(e) {
        if (e.target.id === "+") {
            this.setState({ page: this.state.page + 1 }, () => this.componentDidMount())
        } else {
            this.setState({ page: this.state.page - 1 }, () => this.componentDidMount())
        }
    }
    render() {
        return (<div>
            <br /><br />
            <Alert show={this.state.show} variant={this.state.variant}>{this.state.msgAlert}</Alert>
            <h3>Professores </h3>
            <table className="table">
                <thead className="p-3 mb-2 bg-primary text-white">
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">SIAPE</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Coordenador</th>
                        <th scope="col">Apagar</th>
                        <th scope="col">Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.professores.content &&
                        this.state.professores.content.map((p) =>

                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.perfil.nome}</td>
                                <td>{p.perfil.siape}</td>
                                <td>{p.email}</td>
                                <td style={{ textAlign: "center" }}>{p.perfil.coordenador ? "SIM" : "Não"}</td>
                                <td> {p.perfil.nome === "" ? "" : <Button
                                    variant="primary"
                                    className="btn btn-danger m-1"
                                    onClick={() => this.setState({ modalShow: true, id: p.id, mostrarEditar: false, nome: p.perfil.nome })}
                                > Apagar </Button>}
                                </td>
                                <td> {p.perfil.nome === "" ? "" : <Button
                                    variant="primary"
                                    className="btn btn-success m-1"
                                    onClick={() => this.buscaPeloId(p.id)}
                                > Editar </Button>}
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
            {this.state.mostrarEditar && this.state.mostrarEditar === true ? <>
                <hr /><br /><br />

                <h3 style={{ textAlign: 'center' }}>Formulário de Edição</h3>
                <p >ID : <span style={{
                    color: 'red'
                }}>{this.state.id}</span></p>
                <SACEInput
                    autoFocus={true}
                    label={'Nome'}
                    value={this.state.nome}
                    placeholder={'Informe o seu nome. '}
                    onChange={(e) => this.setState({ nome: e.target.value })}
                    onError={this.state.nomeInvalido}
                    onErrorMessage={'Você não inseriu o seu nome corretamente!'}
                />
                <SACEInput
                    tipo={"number"}
                    min="0"
                    label={'SIAPE'}
                    value={this.state.siape}
                    placeholder={'Informe a sua siape. '}
                    onChange={(e) => this.setState({ siape: e.target.value })}
                    onError={this.state.siapeInvalido}
                    onErrorMessage={'Você não inseriu a seu siape corretamente!'}
                />
                <SACEInput
                    label={'E-mail'}
                    value={this.state.email}
                    placeholder={'Informe o seu nome. '}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    onError={this.state.emailInvalido}
                    onErrorMessage={'Você não inseriu o seu nome corretamente!'}
                />
                <Form.Check type="switch" id="custom-switch" label="Coordenador" value={this.state.coordenador} checked={this.state.coordenador}
                    onChange={() => this.setState({ coordenador: !this.state.coordenador })} />
                <br />

                <Button
                    variant="primary"
                    className="btn btn-primary m-1"
                    onClick={() => this.editar(this.state.id)}
                > Salvar </Button>

            </> : ""}
            {console.log(this.state.id)}

            <Modal show={this.state.modalShow} onHide={() => this.setState({ modalShow: false })} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title > Confirmar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apagar cadastro do professor/professora? </Modal.Body>
                <Modal.Body>ID: &nbsp;{this.state.id} </Modal.Body>
                <Modal.Body>Nome :&nbsp;{this.state.nome} </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary"
                        className="btn btn-danger m-1"
                        onClick={(e) => this.deletar()}
                    > Apagar </Button>

                </Modal.Footer>
            </Modal>
            {
                <>
                    {this.state.first || <button id="-" onClick={(e) => this.control(e)}>Anterior</button>}
                    &nbsp;&nbsp;
                            {this.state.last || <button id="+" onClick={(e) => this.control(e)}>Próximo</button>}

                    <span style={{ float: "right" }}>Página  {this.state.page + 1} / {this.state.total}</span>
                </>

            }
        </div>);
    }
}

export default ListaProfessor;
