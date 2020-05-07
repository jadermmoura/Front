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
            option: "",
            textodisciplina: "",
            textocargahoraria: "",
            disciplinas: [],
            modal: "",
            nome: "",
            tituloCurso: "",
            disabled: false, msgError: ""
        }
    }
    async listarCurso() {
        const cursos = await get("cursos/");
        this.setState({ cursos });
    }

    async  listarDisciplinas() {
        await get(`cursos/${this.state.idcurso}/disciplinas/`).then((retorno) => {
            this.setState({ disciplinas: retorno })
        });
    }
    async valida() {
        if (this.state.idcurso === null || this.state.idcurso === "" ? this.setState({ msgError: "Campo select obrigatório" }) : this.setState({ msgError: "" })) { }
        if (this.state.nome === "" ? this.setState({ textodisciplina: true }) : this.setState({ textodisciplina: false })) { }
        if (typeof this.state.cargaHoraria === "undefined" || this.state.cargaHoraria === "" || this.state.cargaHoraria < 15 ? this.setState({ textocargahoraria: true }) : this.setState({ textocargahoraria: false })) { }
        if (this.state.idcurso !== "" && this.state.nome !== "" && typeof this.state.cargaHoraria !== "undefined" && this.state.msgError === "") {
            if (this.state.textodisciplina === true || this.state.textocargahoraria === true || this.state.msgError === "Campo select obrigatório") {
                return
            }
            await post(`cursos/${this.state.idcurso}/disciplinas/`, {
                nome: this.state.nome,
                cargaHoraria: this.state.cargaHoraria
            }).then(() => {
                this.setState({ modal: true, disabled: true })
                setTimeout(() => {
                    this.setState({ modal: false })
                }, 2000)
                this.listarDisciplinas();
                this.limparDados()
            }
            )
        }

    }
    async apagar(e) {
        await delDisciplinaCurso(`cursos/${this.state.idcurso}/disciplinas/${e}`).then(() => {
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
        if (this.state.disabled) {
            this.setState({ disabled: false })
        }
    }
    limparDados() {
        this.setState({ nome: "", cargaHoraria: "", textocargahoraria: "", textodisciplina: "", msgError: "" })
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
                onErrorMessage={'Campo da disciplina obrigatório'}
            />

            <b />
            <SACEInput tipo="number" id="quantity" name="cargaHoraria" min="15" max=""
                placeholder={'Digite a carga horária da disciplina'}
                label="Carga Horária"
                onChange={(e) => this.setState({ cargaHoraria: e.target.value })}
                onError={this.state.textocargahoraria}
                onErrorMessage={'Campo carga Horária é obrigatório e não pode ser menor que 15 horas'}
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