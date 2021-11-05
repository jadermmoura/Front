import React, { Component } from 'react';
import SACEInput from '../../components/inputs/SACEInput';
import { Button, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import TituloPagina from '../../components/TituloPagina';
import { Form, Modal } from 'react-bootstrap';
import { postCadastroUsuario } from '../../services/AlunoService';
import { getPesquisaLogin } from '../../services/UsuarioService';
import { get } from '../../services/ServicoCrud';
import {validaEmail} from '../../auxiliares/validacoes'

class CadastroPerfilAluno extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userNameInvalido: false,
            password: "",
            passwordInvalido: false,
            nome: "",
            nomeInvalido: false,
            email: "",
            emailInvalido: false,
            matricula: "",
            matriculaInvalida: false,
            dataIngresso: "",
            dataIngressoInvalido: false,
            verificaSenha: "",
            verificaSenhaInvalido: false,
            modalShow: false,
            alert: false,
            msgSenhaNaoConfere: false,
            msgNome: "", msgPassword: "",
            msgAlert: "", variantAlert: ""

        }
    }
  
    limpar() {
        this.setState({
            userName: "",
            password: "",
            nome: "",
            email: "",
            matricula: "",
            dataIngresso: "",
            userNameInvalido: "",
            passwordInvalido: "",
            verificaSenha: "",
            nomeInvalido: false,
            emailInvalido: false,
            matriculaInvalida: false,
            dataIngressoInvalido: false,
            verificaSenhaInvalido: false,
            msgLogin: "",
            msgMatricula: "", msgEmail: ""
        })

    }
    pesquisaMatricula() {
        get(`usuarios/matricula/${this.state.matricula}`).then((r) => {
            this.setState({ usuarioMatricula: r })
        })
      
    }


    async verifica() {
       
        await getPesquisaLogin(`usuarios/pesquisa/${this.state.userName}`).then((retorno) => {
            this.setState({ loginPesquisa: retorno && retorno.username })
        });
        this.comparaData()
        if (this.state.userName === "") {
            this.setState({ userNameInvalido: true, msgLogin: "Você não inseriu login corretamente" })
            return
        } else if (this.state.loginPesquisa === this.state.userName) {
            this.setState({ userNameInvalido: true, msgLogin: "Login inválido, login já cadastrado" })
            return
        } else if (this.state.userName.length < 6 || this.state.userName.length > 10) {
            this.setState({ userNameInvalido: true, msgLogin: "Escolha login entre 6 e 10 caracteres" })
            return
        }
        
     
        if (this.state.verificaSenhaInvalido !== "") { this.setState({ msgLogin: "" }) }
        if (this.state.nome === "" ? this.setState({ nomeInvalido: true, msgNome: "Você não inseriu o seu nome corretamente!" }) : this.setState({ nomeInvalido: false })) { }
        if (this.state.email === "" || !validaEmail(this.state.email) ? this.setState({ emailInvalido: true, msgEmail: "Você não inseriu email válido" }) : this.setState({ emailInvalido: false })) { }
        if (this.state.matricula === "" || this.state.matricula <= 0 ? this.setState({ matriculaInvalida: true, msgMatricula: "Campo matrícula é campo obrigatório " }) : this.setState({ matriculaInvalida: false })) { }
        if (this.state.dataIngresso === "" || this.comparaData() === false ? this.setState({ dataIngressoInvalido: true }) : this.setState({ dataIngressoInvalido: false })) { }
        if (this.state.password === "" ? this.setState({ passwordInvalido: true, msgPassword: "Campo senha não pode ficar em branco" }) : this.setState({ passwordInvalido: false })) { }
        if (this.state.password !== this.state.verificaSenha) {
            this.setState({ verificaSenhaInvalido: true })
        } else if (this.state.verificaSenha === "") {
            this.setState({ verificaSenhaInvalido: true })
        } else { this.setState({ verificaSenhaInvalido: false }) }
        if (this.state.userName && this.state.userName) {
            if (this.state.userName.length < 6 || this.state.userName.length > 10) { return }
        }
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
        if (this.state.password.length > 15) {
            this.setState({ passwordInvalido: true, msgPassword: "Limite máximo de cadastro de 15 caracteres" })
            return
        }
        if (this.state.nome !== "" && this.state.email !== "" && validaEmail(this.state.email)  && this.state.dataIngresso !== "" && this.state.userName !== "" &&
            this.state.password !== "" && this.state.verificaSenha !== "" && this.state.matricula > 0 && this.state.verificaSenha === this.state.password && this.comparaData()) { this.setState({ modalShow: true }) } else { return }

    }
    async  enviarCadastro() {
        postCadastroUsuario({
            password: this.state.password,
            userName: this.state.userName,
            nome: this.state.nome,
            permissao: "ALUNO",
            matricula: this.state.matricula,
            email: this.state.email,
            dataIngresso: this.state.dataIngresso
        }).then((e) => {
            if (e.status === 400) {
                this.setState({ modalShow: false, alert: true, variantAlert: "danger", msgAlert: e.data.message })
                return
            } else {
                this.setState({ modalShow: false, alert: true, variantAlert: "success", msgAlert: "Cadastrado com sucesso" })
                setTimeout(() => {
                    this.setState({ alert: false })
                }, 5000,
                    window.location.href = ("/")
                )
                this.limpar()

            }

        })
    }


    comparaData() {
        let dataHoje = new Date();
        this.setState({ dataIngresso: new Date(this.state.dataIngresso) });
        return this.state.dataIngresso > dataHoje ? false : true;
    }


    render() {

        return (
            <div>
                <Form.Group className="col-md-6 container">
                    <TituloPagina autoFocus titulo="Cadastro de Alunos" />
                    <Alert key={"idx"} variant={this.state.variantAlert} show={this.state.alert}>
                        {this.state.msgAlert}</Alert>
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
                        label={'Email'}
                        type={"email"}
                        value={this.state.email}
                        placeholder={'Informe o seu email. '}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        onError={this.state.emailInvalido}
                        onErrorMessage={this.state.msgEmail}
                    />

                    <SACEInput
                        label={'Matricula'}
                        value={this.state.matricula}
                        placeholder={'Informe a sua matrícula. '}
                        onChange={(e) => this.setState({ matricula: e.target.value })}
                        onError={this.state.matriculaInvalida}
                        onErrorMessage={this.state.msgMatricula}
                    />

                    <SACEInput
                        type={"date"}
                        label={'Data de Ingresso'}
                        value={this.state.dataIngresso}
                        placeholder={'Informe a data de Ingresso. '}
                        onChange={(e) => this.setState({ dataIngresso: e.target.value })}
                        onError={this.state.dataIngressoInvalido}
                        onErrorMessage={'Você não inseriu uma data válida!'}
                    />
                    <SACEInput
                        label={'Login'}
                        value={this.state.userName}
                        placeholder={'Informe um login entre 6 e 10 caracteres '}
                        onChange={(e) => this.setState({ userName: e.target.value })}
                        onError={this.state.userNameInvalido}
                        onErrorMessage={this.state.msgLogin}
                    />
                    <SACEInput
                        label={'Senha'}
                        value={this.state.password}
                        placeholder={'Informe uma senha. '}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        onError={this.state.passwordInvalido}
                        onErrorMessage={this.state.msgPassword}
                        type={"password"}
                    />

                    <SACEInput
                        label={'Confirme a sua senha'}
                        value={this.state.verificaSenha}
                        placeholder={'Informe a mesma senha que a anterior. '}
                        onChange={(e) => this.setState({ verificaSenha: e.target.value })}
                        onError={this.state.verificaSenhaInvalido}
                        onErrorMessage={'Campo senha não pode ficar em branco ou senha não confere!'}
                        type={"password"}
                    />

                    <div className="row container" style={{ position: 'relative', left: '32%' }}>

                        <Button type="submit" variant="primary" className="btn btn-primary m-1" onClick={() => this.verifica()}> Enviar </Button>
                        <Modal show={this.state.modalShow} onHide={() => this.setState({ modalShow: false })} animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title > Confirmar</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Confira seus dados! Você não poderá alterá-los depois de salvar</Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => this.enviarCadastro()} className="btn btn-primary m-1" >Salvar</Button>
                            </Modal.Footer>
                        </Modal>
                        <Link to="/login"> <Button variant="danger" className="btn btn-primary m-1" >Voltar </Button></Link>
                        <Button onClick={() => this.limpar()} className="btn btn-danger m-1" >Limpar</Button>
                    </div>
                </Form.Group>
            </div>
        );
    }
}

export default CadastroPerfilAluno;


