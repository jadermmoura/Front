import React, { Component } from 'react';
import { get, getId, put, del } from './../../services/ServicoCrud'
import { Button, Modal, Alert } from 'react-bootstrap'
import SACEInput from '../../components/inputs/SACEInput';
import {validaEmail} from '../../auxiliares/validacoes'

class ListaServidor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servidores: [],
            siape: "", id: "", email: "",
            mostrarEditar: false, modalShow: false, alert: false,
            emailInvalido: false, siapeInvalido: false, nomeInvalido: false,
            variant: "", msgAlert: "", page: 0,
            last: false,
            first: true,
            total: 0, msgEmail: "", msgNome: "", msgSiape: ""

        }
    }

    async listaServidor() {
        await get(`usuarios/pages?tipo=SERVIDOR&page=${this.state.page}&size=6`).then((retorno) => {
            this.setState({ servidores: retorno, last: retorno.last, first: retorno.first, total: retorno.totalPages })
        })
    }

    async componentDidMount() {
        this.listaServidor()
    }
    
    async buscaPeloId(e) {
        this.limpar()
        const usuario = await getId("usuarios/", e)
        this.setState({
            id: usuario.id,
            nome: usuario.perfil.nome,
            siape: usuario.perfil.siape,
            email: usuario.email,
            mostrarEditar: true
        })
    }
    control(e) {
        if (e.target.id === "+") {
            this.setState({ page: this.state.page + 1, mostrarEditar: false }, () => this.listaServidor())
        } else {
            this.setState({ page: this.state.page - 1, mostrarEditar: false }, () => this.listaServidor())
        }
    }
    editar(e) {

        if (this.nome === null || this.state.nome.trim() === "" ? this.setState({ nomeInvalido: true, msgNome: "Você não inseriu nome corretamente" }) : this.setState({ nomeInvalido: false })) { }
        if (this.siape === null || this.state.siape === "" || this.state.siape <= 0 ? this.setState({ siapeInvalido: true, msgSiape: "Você não inseriu SIAPE corretamente" }) : this.setState({ siapeInvalido: false })) { }
        if (this.email === null || this.state.email === "" || !validaEmail(this.state.email)? this.setState({ emailInvalido: true, msgEmail: "Você não inseriu email válido" }) : this.setState({ emailInvalido: false })) { }
        if (this.state.nome.length > 40) {
            this.setState({ nomeInvalido: true, msgNome: "Limite máximo de cadastro de 40 caracteres" })
            return
        } if (this.state.email.length > 40) {
            this.setState({ emailInvalido: true, msgEmail: "Limite máximo de cadastro de 40 caracteres" })
            return
        }
        if (this.state.siape > 99999999) {
            this.setState({ siapeInvalido: true, msgSiape: "Não pode ser cadastrado número superior a 99999999" })
            return
        }
        if (this.email === null || this.state.email === "" || !validaEmail(this.state.email) || this.siape === null || this.state.siape <= 0 || this.state.siape === "" || this.nome === null || this.state.nome.trim() === "") { return }
        put("usuarios", e,
            {
                email: this.state.email,
                perfil: {
                    nome: this.state.nome,
                    tipo: "SERVIDOR",
                    siape: this.state.siape,
                }
            }).then(() => {
                this.setState({ mostrarEditar: false, alert: true, variant: "success", msgAlert: "Atualizado com sucesso" });
                this.listaServidor()
            }, this.setState({ alert: true }), setTimeout(() => {
                this.setState({ alert: false })
            }, 3000))
    }
    deletar(e) {
        del("usuarios", e).then(() => {
            this.setState({ modalShow: false, mostrarEditar: false, variant: "danger", msgAlert: "Apagou com sucesso" })
            this.listaServidor()
        }).then(() =>
            this.setState({ alert: true }), setTimeout(() => {
                this.setState({ alert: false })
            }, 2000)
        )
    }
    limpar() {
        this.setState({
            nomeInvalido: false, siapeInvalido: false, emailInvalido: false
        })
    }
    render() {
        return (<div>
            <br /><br />
            <Alert variant={this.state.variant} show={this.state.alert}>{this.state.msgAlert}</Alert>
            <h3>Servidores </h3>
            <table className="table">
                <thead className="s-3 mb-2 bg-primary text-white">
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome</th>
                        <th scope="col">SIAPE</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Apagar</th>
                        <th scope="col">Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.servidores.content &&
                        this.state.servidores.content.map((s) =>

                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.perfil.nome}</td>
                                <td>{s.perfil.siape}</td>
                                <td>{s.email}</td>
                                <td> {s.perfil.nome === "" ? "" : <Button
                                    variant="primary"
                                    className="btn btn-danger m-1"
                                    onClick={() => this.setState({ modalShow: true, id: s.id, mostrarEditar: false, nome: s.perfil.nome }, this.limpar())}
                                > Apagar </Button>}
                                </td>
                                <td> {s.perfil.nome === "" ? "" : <a href="#top"><Button
                                    variant="primary"
                                    className="btn btn-success m-1"
                                    onClick={() => this.buscaPeloId(s.id)}
                                > Editar </Button></a>}
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
            {
                <>
                    {this.state.last || <button id="+" onClick={(e) => this.control(e)}>Próximo</button>}
                    &nbsp;&nbsp;
                    {this.state.first || <button id="-" onClick={(e) => this.control(e)}>Anterior</button>}

                    <span style={{ float: "right" }}>Página  {this.state.page + 1} / {this.state.total}</span>
                </>

            }
            {this.state.mostrarEditar && this.state.mostrarEditar === true ? <>
                <hr /><br /><br />

                <h3 id="top" style={{ textAlign: 'center' }}>Formulário de Edição</h3>
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
                    onErrorMessage={this.state.msgNome}
                />
                <SACEInput
                    label={'SIAPE'}
                    value={this.state.siape}
                    placeholder={'Informe o seu siape. '}
                    onChange={(e) => this.setState({ siape: e.target.value })}
                    onError={this.state.siapeInvalido}
                    onErrorMessage={this.state.msgSiape}
                />
                <SACEInput
                    type={"email"}
                    label={'E-mail'}
                    value={this.state.email}
                    placeholder={'Informe o seu nome. '}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    onError={this.state.emailInvalido}
                    onErrorMessage={this.state.msgEmail}
                />
                <Button
                    variant="primary"
                    className="btn btn-primary m-1"
                    onClick={() => this.editar(this.state.id)}
                > Salvar </Button>

            </> : ""}

            <Modal show={this.state.modalShow} onHide={() => this.setState({ modalShow: false })} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title > Confirmar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apagar cadastro do servidor/servidora? </Modal.Body>
                <Modal.Body>ID :&nbsp;{this.state.id} </Modal.Body>
                <Modal.Body>Nome :&nbsp;{this.state.nome} </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        className="btn btn-danger m-1"
                        onClick={() => this.deletar(this.state.id)}
                    > Apagar </Button>
                </Modal.Footer>
            </Modal>

        </div>);
    }
}

export default ListaServidor;
