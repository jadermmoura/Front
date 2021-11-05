import React, { Component } from 'react'
import { baseURL } from '../../enviroment';
import { Alert } from 'react-bootstrap';
import axios from 'axios';


class ImportarCurso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert:"Importado com sucesso",
            showAlert:false
        }
    }

    async enviar() {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const form = new FormData();
        form.append("umArquivo",this.state.umArquivo);
        axios.post(`${baseURL}/anexos/cursos`,form,config).then(()=>{
            this.setState({showAlert:true})
        })
        setTimeout(() => {
            this.setState({showAlert: false})
        }, 3000);   
    }


    render = () => {

        return (
            <div>
                <br />  <br />  <Alert variant={"success"} show={this.state.showAlert}>{this.state.alert}</Alert> <br />
                <h3>Importador para cadastro de Cursos</h3>
                <br />
                <Alert variant={"danger"}>Para importação correta do arquivo com extensão .csv deve estar organizado de modo que, a primeira coluna inclua o nome do curso e a segunda coluna inclua o nome coordenador.</Alert>
                <br /> <br />
                <input type="file" name="umArquivo" onChange={(e)=> this.setState({umArquivo:e.target.files[0]})}/>
                    <input type="button" value="enviar"  onClick={()=>this.enviar()}/>

            </div>


        )
    }
}

export default ImportarCurso;