import React, { Component } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import { get } from '../../services/ServicoCrud';
import SACEInput from '../../../src/components/inputs/SACEInput';
import { postCadastroUsuarioServidor, getPesquisaLogin } from '../../services/UsuarioService';

class CadastroPerfilProfessor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarioMatricula: "",
            escolha: "",
            matricula: "",
            siape: "",
            loginInvalido: false,
            usuarioSiape: "",
            msgMatricula: "",
            msgSiape:"",
            loginPesquisa: "",
            alert:false,
            nome:"",
            msgNome:"",
            msgLogin: "", msgError: "", msgNome: "", msgSiape: "", msgPassword: "", msgEmail: "",
            nomePesquisa:[]
        }
    }

    async verifica() {
        const teste = await getPesquisaLogin(`usuarios/pesquisa/${this.state.usuarioSiape.userName}`).then((retorno) => {
            this.setState({ loginPesquisa: retorno && retorno.username })
            return retorno
        });
        if (teste) {
            this.setState({ loginInvalido: true, msgLogin: "Login inválido, login já cadastrado" })
            console.log("b");
            return
        } 

        if (this.state.userName !== "" && this.state.email !== "" && this.state.siape !== "" && this.state.password !== ""
            && this.state.login !== "" && this.state.password === this.state.novaSenha) {
            if (this.state.nomeInvalido === true || this.state.siapeInvalido === true || this.state.emailInvalido === true || this.state.loginInvalido === true ||
                this.state.confirmaSenhaInvalida === true || this.state.senhaInvalida === true || this.state.msgError === "Você não inseriu o cargo corretamente") {
                return
            }
            postCadastroUsuarioServidor({
                password: this.state.usuarioSiape.password,
                userName: this.state.usuarioSiape.userName,
                email: this.state.usuarioSiape.email,
                isCoordenador: this.state.usuarioSiape.isCoordenador,
                nome: this.state.usuarioSiape.perfil.nome,
                permissao: this.state.usuarioSiape.permissao,
                siape: this.state.usuarioSiape.perfil.siape,
                cargo: this.state.usuarioSiape.permissao
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

    async pesquisaProfessorSiape() {

        const jaExiste = await getPesquisaLogin(`usuarios/pesquisa/${this.state.usuarioSiape.userName}`)
        .then((retorno) => {
            if(!retorno){
                this.setState({alert:true})
            }
            return retorno
        }).catch(e =>{
            this.setState({alert:true})
        })
    
        ;
        if (jaExiste) {
            this.setState({ msgSiape: "Professor já cadastrado!" })
            return
        }
        
        if (this.state.siape === "") {
            this.setState({ msgSiape: "Você não digitou número do SIAPE do professor válido" })
            return
        }

        await get(`usuarios/siapeLdap/${this.state.siape}`).then((r) => {
            console.log(r)
            if(!r){
                this.setState({alert:true})
            }
            this.setState({ usuarioSiape: r ,msgSiape:""})
        })
        setTimeout(() => {
            this.setState({alert:false})
        }, 3000);
    }

    limpar() {
        this.setState({ usuarioSiape: "" ,msgMatricula:"",matricula:"",siape:"",msgSiape:"",nome:"",msgNome:"",nomePesquisa:""})
    }
    render() {
        return (
        <Form.Group className="col-md-6 container">
        <diV>
            <br /><br />
            
                <label>Digite o número da SIAPE : </label>&nbsp;&nbsp;&nbsp;
                <input value={this.state.siape}onChange={(e) => {
                    this.setState({ siape: e.target.value })
                }}></input>
                <Form.Text className="text-danger">{this.state.msgSiape} </Form.Text>
                &nbsp;&nbsp;&nbsp;<br /><br />
                <Button onClick={() => this.pesquisaProfessorSiape()}>Pesquisar</Button>&nbsp;
                <Button variant={"danger"} onClick={() => this.limpar()}>Limpar</Button>
            

            {this.state.usuarioSiape && <>
                <br /><br /><br />
                <u><h3 style={{ textAlign: "center" }}>Dados do Professor</h3></u>
                
                <SACEInput
                    label={'Nome'}
                    value={this.state.usuarioSiape.perfil.nome}
                    disabled={true}
                />
                <SACEInput
                    label={'SIAPE'}
                    value={this.state.usuarioSiape.perfil.siape}
                    disabled={true}
                />

                <SACEInput
                    label={'Email'}
                    value={this.state.usuarioSiape.email}
                    disabled={true}
                />
                    <div className="row container" style={{ position: 'relative', left: '32%' }}>
                    <Button onClick={(e) => this.verifica(e)} variant="primary" className="btn btn-primary m-1">Salvar</Button>
                    <Button onClick={() => this.limpar()} variant="danger" className="btn btn-primary m-1" >Limpar</Button>
                    
                </div>
            </>}

            {this.state.nomePesquisa &&this.state.nomePesquisa.length >0 ? <>
            <br /><br />
            <h3 style={{textAlign:"center"}}>Lista de Usuários encontrados</h3><br />
             <Table id="imprimir"striped bordered hover >
             <thead>
               <tr>
                 <th>ID</th>
                 <th>Nome</th>
                 <th>Email</th>
                 <th>Perfil</th>
               </tr>
             </thead>
             <tbody>
               {this.state.nomePesquisa && this.state.nomePesquisa.map((u) =>
                 <tr>
                   <td>{u.perfil.id}</td>
                   <td>{u.perfil.nome}</td>
                   <td>{u.email}</td>
                   <td>{u.perfil.tipo}</td>
                 </tr>
               )}
             </tbody>
           </Table>
            </>:""}
        </diV>
        </Form.Group>
        );
    }
}
export default CadastroPerfilProfessor;