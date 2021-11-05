import React, { Component } from 'react';
import { baseURL } from '../../enviroment';
import { get, getId, put } from '../../services/ServicoCrud';
import SACEInput from '../../components/inputs/SACEInput';
import { Button, Form, Modal, Alert } from 'react-bootstrap'
import axios from 'axios';
import { validaEmail } from '../../auxiliares/validacoes'

class ListaProfessor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            professores: [],
            siape: "", siapeInvalido: false, nome: "",
            coordenador: "", email: "", emailInvalido: false,
            mostrarEditar: false, id: "", alert: false,
            msgAlert: "", show: false, variant: "", page: 0,
            last: false, modalShow2: false, msgModalCoordenador: "",
            first: true, total: 0, msgEmail: "", msgNome: "", msgSiape: "", cursoCoordenador: []
        }
    }

    async listaProfessor() {
        await get(`usuarios/pages?tipo=PROFESSOR&page=${this.state.page}&size=6`).then((retorno) => {
            console.log(retorno);
            if (retorno) this.setState({ professores: retorno, last: retorno.last, first: retorno.first, total: retorno.totalPages })
        })

    }
    async componentDidMount() {
        this.listaProfessor()
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
    async listarCoordenadorCurso(e) {
        await get(`cursos/coordenador/${e}`).then((retorno) => {
           if(retorno.length === 0){
               this.setState({msgModalCoordenador:"Não foi designado nenhum curso no momento ao professor",cursoCoordenador:[],modalShow2:true , mostrarEditar: false})
           }else{
               this.setState({ cursoCoordenador: retorno, modalShow2: true, mostrarEditar: false })
           }
            
        })
    }
    async deletarCoordenadorCurso(e) {
        axios.delete(`${baseURL}/usuarios/coordenador/` + e)
    }

    async editar(e) {

        if (this.state.nome.trim() === "" || this.state.nome === null ? this.setState({ nomeInvalido: true, msgNome: "Você não inseriu nome corretamente" }) : this.setState({ nomeInvalido: false })) { }
        if (this.state.siape === "" || this.state.siape === null || this.state.siape <= 0 ? this.setState({ siapeInvalido: true, msgSiape: "Você não inseriu SIAPE corretamente" }) : this.setState({ siapeInvalido: false })) { }
        if (this.state.email === "" || this.state.email === null || !validaEmail(this.state.email) ? this.setState({ emailInvalido: true, msgEmail: "Você não inseriu email corretamente" }) : this.setState({ emailInvalido: false })) { }
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
        if (this.state.nome.trim() === "" || this.state.nome === null || !validaEmail(this.state.email) || this.state.siape === "" || this.state.siape <= 0 || this.state.siape === null || this.state.email === "" || this.state.email == null) {
            return
        }
        if (!this.state.coordenador) {
            this.deletarCoordenadorCurso(e)
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
                this.listaProfessor()
                setTimeout(() => { this.setState({ show: false }) }, 3000);
            })
    }
    deletar() {
        axios.delete(`${baseURL}/usuarios/` + this.state.id).then((r) =>
            this.setState({ modalShow: false, show: true, variant: "danger", msgAlert: "Apagou com sucesso" }),
            this.listaProfessor()
        ).catch(() =>
            alert("Não pode apagar cadastro do professor ele possui requisição no sistema ou está designado a coordenador de curso"),
            this.setState({ modalShow: false })
            , setTimeout(() => {
                this.setState({ show: false })
            }, 3000),
            this.listaProfessor()
        )
    }
    control(e) {
        if (e.target.id === "+") {
            this.setState({ page: this.state.page + 1, mostrarEditar: false }, () => this.listaProfessor())
        } else {
            this.setState({ page: this.state.page - 1, mostrarEditar: false }, () => this.listaProfessor())
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
                                <td >{p.perfil.coordenador ? <Button variant={"link"} onClick={() => this.listarCoordenadorCurso(p.id)}>Sim</Button> :
                                    <Button variant={"link"}>Não</Button>}</td>
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
            <hr />
            {
                <>
                    {this.state.last || <button id="+" onClick={(e) => this.control(e)}>Próximo</button>}
                    &nbsp;&nbsp;
                    {this.state.first || <button id="-" onClick={(e) => this.control(e)}>Anterior</button>}

                    <span style={{ float: "right" }}>Página  {this.state.page + 1} / {this.state.total}</span>
                </>

            }<br /><br />
            {this.state.mostrarEditar && this.state.mostrarEditar === true ? <>

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
                <Form.Check type="switch" id="custom-switch" label="Coordenador" value={this.state.coordenador} checked={this.state.coordenador}
                    onChange={() => this.setState({ coordenador: !this.state.coordenador })} />
                <br />

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
            <Modal show={this.state.modalShow2} onHide={() => this.setState({ modalShow2: false, cursoCoordenador: [], msgModalCoordenador: "" })}>
                <Modal.Header closeButton>
                    <Modal.Title > Coordenador(a) nos cursos abaixo: </Modal.Title>
                </Modal.Header>
                {this.state.cursoCoordenador && this.state.cursoCoordenador.map((e) =>
                    <Modal.Body> Curso : {e.nome} </Modal.Body>
                )}
                <Modal.Body> <span style={{color:"red"}}> {this.state.msgModalCoordenador}  </span></Modal.Body>
                
                
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            
        </div>);
    }
}

export default ListaProfessor;
