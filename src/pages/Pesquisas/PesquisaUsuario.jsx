import React, { Component } from 'react';
import { Form, Button, Alert,Table } from 'react-bootstrap';
import { get } from '../../services/ServicoCrud';
import SACEInput from '../../../src/components/inputs/SACEInput';
import { format } from '../../auxiliares/FormataData';

class PesquisaUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarioMatricula: "", escolha: "", matricula: "", siape: "", usuarioSiape: "", msgMatricula: "",msgSiape:"",alert:false,nome:"",msgNome:"",nomePesquisa:[]
        }
    }

    pesquisaMatricula() {
        if (this.state.matricula <= 0) {
            this.setState({ msgMatricula: "Você não digitou uma matrícula válida" })
            return
        }
        get(`usuarios/matricula/${this.state.matricula}`).then((r) => {
            if(r === ""){
                this.setState({alert:true})
            }
            this.setState({ usuarioMatricula: r,msgMatricula:"" })
        })
        setTimeout(() => {
            this.setState({alert:false})
        }, 3000);
    }
    pesquisaProfessorSiape() {
        if (this.state.siape <= 0) {
            this.setState({ msgSiape: "Você não digitou número do SIAPE do professor válido" })
            return
        }
        get(`usuarios/siape/${this.state.siape}`).then((r) => {
            if(r === ""){
                this.setState({alert:true})
            }
            this.setState({ usuarioSiape: r ,msgSiape:""})
        })
        setTimeout(() => {
            this.setState({alert:false})
        }, 3000);
    }
    pesquisaNome(){
        if (this.state.nome.trim() === "") {
            this.setState({ msgNome: "Você não digitou nome correto" })
            return
        }
        get(`usuarios/pesquisaNome/${this.state.nome}`).then((r) => {
            console.log(r);
            if(r.length === 0){
                this.setState({alert:true})
            }
            this.setState({ nomePesquisa: r ,msgNome:""})
        })
        setTimeout(() => {
            this.setState({alert:false})
        }, 3000);
    }

    limpar() {
        this.setState({ usuarioMatricula: "", usuarioSiape: "" ,msgMatricula:"",matricula:"",siape:"",msgSiape:"",nome:"",msgNome:"",nomePesquisa:""})
    }
    render() {
        return (<diV>
            <br /><br />
            < Form >
                <Form.Label><h3>Selecione tipo da pesquisa</h3></Form.Label>
                <Alert show={this.state.alert} variant={"danger"}>Usuário não encontrado</Alert>
                <Form.Control as="select" custom
                    id={this.state.escolha}
                    value={this.state.escolha}
                    onClick={()=>this.limpar()}
                    onChange={
                        (e) => {
                            this.setState({ escolha: e.target.value })
                        }} >
                    <option value={""}></option>
                    <option value={"matricula"}>Matrícula do aluno</option>
                    <option value={"siape"}>SIAPE do professor</option>
                    <option value={"nome"}>Nome do usuário</option>

                </Form.Control>
            </Form>

            {this.state.escolha === "matricula" && <>
                <br /><br />
                <label>Digite o número da matrícula : </label>&nbsp;&nbsp;&nbsp;
                <input value={this.state.matricula}onChange={(e) => {
                    this.setState({ matricula: e.target.value })
                }}></input>
                <Form.Text className="text-danger">{this.state.msgMatricula} </Form.Text>
                &nbsp;&nbsp;&nbsp;<><br /><br />
                    <Button onClick={() => this.pesquisaMatricula()}>Pesquisar</Button></>&nbsp;
                <Button variant={"danger"} onClick={() => this.limpar()}>Limpar</Button></>
            }
            {this.state.usuarioMatricula && <>
                <br /><br /><br />
                <u><h3 style={{ textAlign: "center" }}>Dados do Aluno</h3></u>
                <strong> ID da aluno :<span style={{ color: "red" }}>&nbsp;{this.state.usuarioMatricula.perfil.id}</span> </strong>
                <SACEInput
                    label={'Nome'}
                    value={this.state.usuarioMatricula.perfil.nome}
                    disabled={true}
                />
                <SACEInput
                    label={'Matrícula'}
                    value={this.state.usuarioMatricula.perfil.matricula}
                    disabled={true}
                />
                <SACEInput
                    label={'Data do Ingresso'}
                    value={format(this.state.usuarioMatricula && this.state.usuarioMatricula.perfil.dataIngresso)}
                    disabled={true}
                />
                <SACEInput
                    label={'Email'}
                    value={this.state.usuarioMatricula.email}
                    disabled={true}
                />
            </>}
            {this.state.escolha === "siape" && <>
                <br /><br />
                <label>Digite o número da SIAPE : </label>&nbsp;&nbsp;&nbsp;
                <input value={this.state.siape}onChange={(e) => {
                    this.setState({ siape: e.target.value })
                }}></input>
                <Form.Text className="text-danger">{this.state.msgSiape} </Form.Text>
                &nbsp;&nbsp;&nbsp;<br /><br />
                <Button onClick={() => this.pesquisaProfessorSiape()}>Pesquisar</Button>&nbsp;
                <Button variant={"danger"} onClick={() => this.limpar()}>Limpar</Button>
            </>
            }
            {this.state.usuarioSiape && <>
                <br /><br /><br />
                <u><h3 style={{ textAlign: "center" }}>Dados do Professor</h3></u>
                <strong> ID da professor :<span style={{ color: "red" }}>&nbsp;{this.state.usuarioSiape.perfil.id}</span> </strong>
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
            </>}
            {this.state.escolha === "nome" && <>
                <br /><br />
                <label>Digite o nome do usuário : </label>&nbsp;&nbsp;&nbsp;
                <input style={{width:500}} value={this.state.nome}onChange={(e) => {
                    this.setState({ nome: e.target.value })
                }}></input>
                <Form.Text className="text-danger">{this.state.msgNome} </Form.Text>
                &nbsp;&nbsp;&nbsp;<><br /><br />
                    <Button onClick={() => this.pesquisaNome()}>Pesquisar</Button></>&nbsp;
                <Button variant={"danger"} onClick={() => this.limpar()}>Limpar</Button></>
            }
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
        </diV>);
    }
}

export default PesquisaUsuario;