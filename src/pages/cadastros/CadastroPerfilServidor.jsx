import React, { Component } from "react";
import SACEInput from '../../components/inputs/SACEInput';
import { Button, Alert } from 'react-bootstrap';
import TituloPagina from '../../components/TituloPagina';
import { Form } from 'react-bootstrap';
import { postCadastroUsuarioServidor, getPesquisaLogin } from '../../services/UsuarioService';
import {validaEmail} from '../../auxiliares/validacoes'

class CadastroPerfilServidor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: "",
            userName: "",
            password: "",
            novaSenha: "",
            siape: "",
            email: "",
            cargo: "",
            permissao: "SERVIDOR",
            isCoordenador: false,
            loginInvalido: false,
            confirmaSenhaInvalida: false,
            loginPesquisa: "",
            senhaInvalida: false,
            siapeInvalido: false,
            emailInvalido: false,
            cargoInvalido: false,
            nomeInvalido: false,
            modal: false,
            msgLogin: "", msgError: "", msgNome: "", msgSiape: "", msgPassword: "", msgEmail: ""

        }
    }

    async verifica() {
        await getPesquisaLogin(`usuarios/pesquisa/${this.state.userName}`).then((retorno) => {
            this.setState({ loginPesquisa: retorno && retorno.username })

        });
        if (this.state.userName.trim() === "") {
            this.setState({ loginInvalido: true, msgLogin: "Você não inseriu login corretamente" })
            console.log("a");

            return
        } else if (this.state.loginPesquisa === this.state.userName) {
            this.setState({ loginInvalido: true, msgLogin: "Login inválido, login já cadastrado" })
            console.log("b");
            return
        } else if (this.state.userName.length < 6 || this.state.userName.length > 10) {
            this.setState({ loginInvalido: true, msgLogin: "Escolha login entre 6 e 10 caracteres" })
            console.log("c");
            return
        }
        if (this.state.loginInvalido !== "") { this.setState({ msgLogin: "", loginInvalido: false }) }
        if (this.state.cargo === null || this.state.cargo === "" ? this.setState({ msgError: "Você não inseriu o cargo corretamente" }) : this.setState({ msgError: "" })) { }
        if (this.state.nome.trim() === "" ? this.setState({ nomeInvalido: true, msgNome: "Você não inseriu nome corretamente" }) : this.setState({ nomeInvalido: false })) { }
        if (this.state.cargo === "" ? this.setState({ cargoInvalido: true }) : this.setState({ cargoInvalido: false })) { }
        if (this.state.siape === "" ? this.setState({ siapeInvalido: true, msgSiape: "Você não inseriu SIAPE corretamente" }) : this.setState({ siapeInvalido: false })) { }
        if (this.state.email === "" || !validaEmail(this.state.email) ? this.setState({ emailInvalido: true, msgEmail: "Você não inseriu email válido" }) : this.setState({ emailInvalido: false })) { }
        if (this.state.password.trim() === "" ? this.setState({ senhaInvalida: true, msgPassword: "Você não inseriu senha corretamente" }) : this.setState({ senhaInvalida: false })) { }
        if (this.state.novaSenha.trim() === "" ? this.setState({ confirmaSenhaInvalida: true }) : this.setState({ confirmaSenhaInvalida: false })) { }
        if (this.state.password !== this.state.novaSenha) { this.setState({ confirmaSenhaInvalida: true }) }
        if (this.state.nome.length > 40) {
            this.setState({ nomeInvalido: true, msgNome: "Limite máximo para cadastro de 40 caracteres" })
            return
        }
        if (this.state.email.length > 40) {
            this.setState({ emailInvalido: true, msgEmail: "Limite máximo para cadastro de 40 caracteres" })
            return
        }
        if (this.state.siape > 99999999) {
            this.setState({ siapeInvalido: true, msgSiape: "SIAPE não pode ter número superior a 999999999" })
            return
        }
        if (this.state.password.length > 30) {
            this.setState({ senhaInvalida: true, msgPassword: "Limite máximo de cadastro de 30 caracteres" })
            return
        }
        if (this.state.userName !== "" && this.state.email !== "" && this.state.siape !== "" && this.state.password !== ""&&validaEmail(this.state.email)
            && this.state.login !== "" && this.state.password === this.state.novaSenha) {
            if (this.state.loginPesquisa === this.state.userName.toUpperCase()) { this.setState({ loginInvalido: true }); return }
            if (this.state.nomeInvalido === true || this.state.siapeInvalido === true || this.state.emailInvalido === true || this.state.loginInvalido === true ||
                this.state.confirmaSenhaInvalida === true || this.state.senhaInvalida === true || this.state.msgError === "Você não inseriu o cargo corretamente") {
                return
            }
            postCadastroUsuarioServidor({
                password: this.state.password,
                userName: this.state.userName,
                email: this.state.email,
                isCoordenador: this.state.isCoordenador,
                nome: this.state.nome,
                permissao: this.state.permissao,
                siape: this.state.siape,
                cargo: this.state.cargo
            }).then(() => {
                this.setState({ modal: true })
                setTimeout(() => {
                    this.setState({ modal: false })
                }, 3000)
                this.limpar()

            })

            return
        }
    }

    limpar() {
        this.setState({
            msgError: "",
            confirmaSenha: "",
            nomeInvalido: false,
            siapeInvalido: false,
            emailInvalido: false,
            loginInvalido: false,
            senhaInvalida: false,
            isCoordenador: false,
            confirmaSenhaInvalida: false,
            nome: "",
            siape: "",
            email: "",
            userName: "",
            password: "",
            novaSenha: "",
            cargo: ""
        })
    }

    render() {
        return (
            <Form.Group className="col-md-6 container">
                <TituloPagina titulo="Cadastrar Servidor" />
                <Alert key={"idx"} variant={"success"} show={this.state.modal}>Cadastrado com Sucesso</Alert>
                <SACEInput
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
                    label={'E-mail'}
                    value={this.state.email}
                    placeholder={'Informe o seu E-mail. '}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    onError={this.state.emailInvalido}
                    onErrorMessage={this.state.msgEmail}
                />
                <label >Cargo</label>
                <select class="custom-select" value={this.state.cargo}
                    onChange={(e) => {
                        this.setState({
                            cargo: e.target.value,
                            permissao: e.target.value
                        })
                    }
                    }
                >
                    <option ></option>
                    <option value="SERVIDOR" selected={true}>Servidor</option>
                    <option value="PROFESSOR">Professor</option>
                </select>
                <Form.Text className="text-danger">{this.state.msgError} </Form.Text>
                <br />
                <br />
                {this.state.cargo === "PROFESSOR" &&
                    <Form.Check type="switch" id="custom-switch" label="Cordenador" value={this.state.isCoordenador}
                        onChange={() => this.setState({ isCoordenador: !this.state.isCoordenador })} />}
                <SACEInput
                    label={'Login'}
                    value={this.state.userName}
                    placeholder={'Informe um login. '}
                    onChange={(e) => this.setState({ userName: e.target.value })}
                    onError={this.state.loginInvalido}
                    onErrorMessage={this.state.msgLogin}
                />
                <SACEInput
                    label={'Senha'}
                    value={this.state.password}
                    placeholder={'Informe uma senha. '}
                    onChange={(e) => this.setState({ password: e.target.value })}
                    onError={this.state.senhaInvalida}
                    onErrorMessage={this.state.msgPassword}
                    type={"password"}
                />
                <SACEInput
                    label={'Confirme a sua senha'}
                    value={this.state.novaSenha}
                    placeholder={'Informe a mesma senha que a anterior. '}
                    onChange={(e) => this.setState({ novaSenha: e.target.value })}
                    onError={this.state.confirmaSenhaInvalida}
                    onErrorMessage={'As senhas não conferem! Favor inserir a mesma senha!'}
                    type={"password"}
                />
                <div className="row container" style={{ position: 'relative', left: '32%' }}>
                    <Button onClick={(e) => this.verifica(e)} variant="primary" className="btn btn-primary m-1">Salvar</Button>
                    <Button onClick={() => this.limpar()} variant="danger" className="btn btn-primary m-1" >Limpar</Button>
                </div>
            </Form.Group>

        );
    }
}

export default CadastroPerfilServidor;