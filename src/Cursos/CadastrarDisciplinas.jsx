import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import SACEInput from '../components/inputs/SACEInput';
import Alert from 'react-bootstrap/Alert'
import { delDisciplinaCurso, post, get } from '../services/ServicoCrud';

class CadastrarDisciplinas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cursos: [],
            idcurso: "",
            textodisciplina: "",
            textocargahoraria: "",
            disciplinas: [],
            modal: "",
            nome: "",
            msgError: "",
            msgNomeDisciplina: "",
            msgCargaHoraria:""
        }
    }
    async listarCurso() {
        const cursos = await get("cursos/");
        this.setState({ cursos });
    }

    async  listarDisciplinas() {
        await get(`cursos/${this.state.idcurso}disciplinas/`).then((retorno) => {
            this.setState({ disciplinas: retorno })
        });
    }
    async valida() {
        if (this.state.idcurso === null || this.state.idcurso === "" ? this.setState({ msgError: "Campo select obrigatório" }) : this.setState({ msgError: "" })) { }
        if (this.state.nome.trim() === "" ? this.setState({ textodisciplina: true, msgNomeDisciplina: "Campo nome é obrigatório" }) : this.setState({ textodisciplina: false })) { return }
        if (typeof this.state.cargaHoraria === "undefined" || this.state.cargaHoraria === "" || this.state.cargaHoraria < 15 ? this.setState({ textocargahoraria: true ,msgCargaHoraria:"Carga horária não pode ser inferior a 15h"}) : this.setState({ textocargahoraria: false })) { return }
            if (this.state.nome.length > 40) {
                this.setState({ textodisciplina: true, msgNomeDisciplina: "Limite máximo para cadastro de 40 caracteres" })
                return
            }
        if(this.state.cargaHoraria > 300){this.setState({textocargahoraria:true,msgCargaHoraria:"Carga não pode ser superior 300h"})}
        if (this.state.idcurso !== "" && this.state.nome !== "" && this.state.cargaHoraria !== "") {
            if (this.state.nome.trim() !== "" && this.state.cargaHoraria > 14 && this.state.idcurso !== "") {
                await post(`cursos/${this.state.idcurso}/disciplinas/`, {
                    nome: this.state.nome,
                    cargaHoraria: this.state.cargaHoraria
                }).then(() => {
                    this.setState({ modal: true, disabled: true })
                    setTimeout(() => {
                        this.setState({ modal: false})
                    }, 3000)
                    this.listarDisciplinas();
                    this.limparDados()
                }
                )
            }
        }

    }
    async apagar(e) {
        await delDisciplinaCurso(`cursos/${this.state.idcurso}disciplinas/${e}`).then(() => {
            this.listarDisciplinas()
        })
    }
    async componentDidMount() {
        this.listarCurso();
    }

    limpar() {
        this.setState({
            textodisciplina: "",
            textocargahoraria: "",
            nome: "", cargaHoraria: "", msgError: ""
        })
    }
    limparDados() {
        this.setState({ nome: "", cargaHoraria: "", textocargahoraria: "", textodisciplina: "" })
    }


    render() {

        return (<div >
            <br /><br />
            <Alert key={"idx"} variant={"success"} show={this.state.modal}>
                Cadastrado com sucesso</Alert>
            <h2>Cadastrar Disciplina</h2><br />
            <label >Selecione o curso</label>
            <select className="browser-default custom-select" disabled={this.state.disabled}
                id={this.state.idcurso}
                value={this.state.idcurso}
                onChange={(e) =>
                    this.setState({
                        idcurso: e.target.value,

                    })
                }>
                <option id={"e"} selected></option>
                {this.state.cursos.map((curso) =>
                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                )}
            </select>
            <Form.Text className="text-danger">{this.state.msgError} </Form.Text>
            <SACEInput
                placeholder={'Digite o nome Disciplina'}
                value={this.state.nome}
                label={'Nome Disciplina'}
                onChange={(e) => this.setState({ nome: e.target.value })}
                onError={this.state.textodisciplina}
                onErrorMessage={this.state.msgNomeDisciplina}
            />

            <b />
            <SACEInput type="number" id="quantity" name="cargaHoraria" min="15" max=""
                placeholder={'Digite a carga horária da disciplina'}
                label="Carga Horária"
                onChange={(e) => this.setState({ cargaHoraria: e.target.value })}
                onError={this.state.textocargahoraria}
                onErrorMessage={this.state.msgCargaHoraria}
                value={this.state.cargaHoraria}
            />
            <Button style={{ position: 'relative', left: '80%' }} variant="primary" className="btn btn-primary m-1" onClick={(e) => this.valida()}>
                Salvar
                </Button>
            <Button style={{ position: 'relative', left: '80%' }} variant="danger" className="btn btn-primary m-1" onClick={(e) => this.limpar()}>
                Limpar
                </Button>
            <br />

        </div>
        );
    }
}


export default CadastrarDisciplinas;