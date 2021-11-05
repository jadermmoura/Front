import React, { Component } from 'react'
import { baseURL } from '../enviroment';
import { get, getId } from './../services/ServicoCrud'
import { Button, Modal, Alert } from 'react-bootstrap'
import { putAluno } from '../services/AlunoService';
import axios from 'axios';
import SACEInput from '../components/inputs/SACEInput';
import { format } from '../auxiliares/FormataData';
import {validaEmail} from '../auxiliares/validacoes'

class ListaAlunos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alunos: [],
            mostraEditar: false,
            nome: "",
            matricula: "",
            dataIngresso: "",
            email: "",
            username: "",
            id: "", alert: false, page: 0,
            last: false,
            first: true,
            total: 0,
            msgAlert: "",
            showAlert: false,
            variantAlert: "", msgNome: "", msgMatricula: "", msgEmail: ""
        }

    }
    listarAlunos() {
        get(`usuarios/pages?tipo=ALUNO&page=${this.state.page}&size=6`).then((retorno) => {
            console.log(retorno);
            if (retorno) this.setState({ alunos: retorno.content, last: retorno.last, first: retorno.first, total: retorno.totalPages })
            this.setState({ alunos: retorno })
        })
    }
    async buscaPeloId(e) {
        this.limpar()
        getId("usuarios/", e).then((retorno) => {
            this.setState({
                id: retorno.id,
                nome: retorno.perfil.nome,
                dataIngresso: retorno.perfil.dataIngresso,
                matricula: retorno.perfil.matricula,
                email: retorno.email,
                mostraEditar: true
            })

        })
    }
    control(e) {
        if (e.target.id === "+") {
            this.setState({ page: this.state.page + 1, mostraEditar: false }, () => this.listarAlunos(), this.limpar())
        } else {
            this.setState({ page: this.state.page - 1, mostraEditar: false }, () => this.listarAlunos(), this.limpar())
        }
    }

    componentDidMount() {
        this.listarAlunos()
    }
    editar(e) {

        if (this.state.nome.trim() === "" || this.state.nome === null ? this.setState({ nomeInvalido: true, msgNome: "Você não inseriu o seu nome corretamente!" }) : this.setState({ nomeInvalido: false })) { }
        if (this.state.matricula === "" || this.state.matricula === null || this.state.matricula <= 0 ? this.setState({ matriculaInvalida: true, msgMatricula: "Você não inseriu matrícula corretamente" }) : this.setState({ matriculaInvalida: false })) { }
        if (this.state.email === "" || this.state.email === null || !validaEmail(this.state.email) ? this.setState({ emailInvalido: true, msgEmail: "Você não inseriu email corretamente" }) : this.setState({ emailInvalido: false })) { }
        if (this.state.nome.length > 40) {
            this.setState({ nomeInvalido: true, msgNome: "Limite máximo de cadastro de 40 caracteres" })
            return
        } if (this.state.email.length > 40) {
            this.setState({ emailInvalido: true, msgEmail: "Limite máximo de cadastro de 40 caracteres" })
            return
        }
        if (this.state.matricula > 99999999) {
            this.setState({ matriculaInvalida: true, msgMatricula: "Não pode ser cadastrado número superior a 99999999" })
            return
        }
        if (this.state.nome === null || !validaEmail(this.state.email) || this.state.nome.trim() === "" || this.state.email === "" || this.state.email === null || this.state.matricula === null || this.state.siape === null || this.state.matricula === "" || this.state.siape === "" || this.state.matricula <= 0) {
            return
        }
        putAluno("usuarios", e,
            {
                email: this.state.email,
                perfil: {
                    nome: this.state.nome,
                    tipo: "ALUNO",
                    dataIngresso: this.state.dataIngresso,
                    matricula: this.state.matricula,
                    email: this.state.email
                }
            }).then(() => {
                this.setState({
                    mostraEditar: false, showAlert: true,
                    variantAlert: "success",
                    msgAlert: "Atualizado com sucesso"
                })
                setTimeout(() => {
                    this.setState({ showAlert: false })
                }, 3000)
                this.listarAlunos()
                this.limpar()
            })
    }
    limpar() {
        this.setState({ nomeInvalido: false, matriculaInvalida: false, emailInvalido: false })
    }
    render() {

        return (
            <div>
                <br /><br />
                <Alert variant={this.state.variantAlert} show={this.state.showAlert} >{this.state.msgAlert}</Alert>
                <h3 >Alunos </h3>
                <table className="table">
                    <thead className="p-3 mb-2 bg-primary text-white">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Data de Ingresso</th>
                            <th scope="col">Matrícula</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Apagar</th>
                            <th scope="col">Editar</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.alunos.content &&
                            this.state.alunos.content.map((aluno) =>
                                <tr key={aluno.id}>
                                    <td>{aluno.id}</td>
                                    <td>{aluno.perfil.nome}</td>
                                    <td>{format(aluno.perfil.dataIngresso)}</td>
                                    <td>{aluno.perfil.matricula}</td>
                                    <td>{aluno.email}</td>
                                    <td> {aluno.perfil.nome === "" ? "" : <Button
                                        variant="primary"
                                        className="btn btn-danger m-1"
                                        onClick={(e) => this.setState({ modalShow: true, id: aluno.id, nome: aluno.perfil.nome, mostraEditar: false }, this.limpar())
                                        }
                                    > Apagar </Button>}
                                    </td>
                                    <td> {aluno.perfil.nome === "" ? "" : <a href={"#top"}> <Button
                                        variant="primary"
                                        className="btn btn-success m-1"
                                        onClick={() => this.buscaPeloId(aluno.id)
                                        }
                                    > Editar </Button></a>}
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
                {this.state.mostraEditar && this.state.mostraEditar === true ? <>

                    <h3 id={"top"} style={{ textAlign: 'center' }}>Formulário de Edição</h3>
                    <p >ID : <span style={{
                        color: 'red'
                    }}>{this.state.id}</span></p>
                    <SACEInput
                        autoFocus
                        label={'Nome'}
                        value={this.state.nome}
                        placeholder={'Informe o seu nome. '}
                        onChange={(e) => this.setState({ nome: e.target.value })}
                        onError={this.state.nomeInvalido}
                        onErrorMessage={this.state.msgNome}
                    />
                    <SACEInput
                        label={'Data de Ingresso'}
                        value={this.state.dataIngresso}
                        placeholder={'Informe a data de Ingresso. '}
                        onChange={(e) => this.setState({ dataIngresso: e.target.value })}
                        onError={this.state.dataIngressoInvalido}
                        onErrorMessage={'Você não inseriu uma data válida!'}
                        type={"date"}
                    />
                    <SACEInput
                        label={'Matrícula'}
                        value={this.state.matricula}
                        placeholder={'Informe a sua matrícula. '}
                        onChange={(e) => this.setState({ matricula: e.target.value })}
                        onError={this.state.matriculaInvalida}
                        onErrorMessage={this.state.msgMatricula}
                    />
                    <SACEInput
                        type={"email"}
                        label={'E-mail'}
                        value={this.state.email}
                        placeholder={'Informe o seu email. '}
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
                    <Modal.Body>Apagar cadastro do aluno/aluna? </Modal.Body>
                    <Modal.Body>ID :&nbsp;{this.state.id} </Modal.Body>
                    <Modal.Body>Nome :&nbsp;{this.state.nome} </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary"
                            className="btn btn-danger m-1"
                            onClick={(e) => axios.delete(`${baseURL}/usuarios/` + this.state.id).then((r) =>
                                this.setState({ modalShow: false, showAlert: true, variantAlert: "danger", msgAlert: "Apagou com sucesso" }, this.listarAlunos())
                            ).catch(() =>
                                alert("Não pode apagar cadastro do aluno devido ele ter requisição no sistema"),
                                this.setState({ modalShow: false })
                                , setTimeout(() => {
                                    this.setState({ showAlert: false })
                                }, 3000)
                            )}
                        > Apagar </Button>
                    </Modal.Footer>
                </Modal>


            </div>
        );
    }
}

export default ListaAlunos;