import { Navbar, Nav, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { NavLink, Link } from "react-router-dom";
import { logout } from '../services/TokenService';
import React, { useState, useEffect } from 'react';
import { get } from '../services/ServicoCrud'


function SACELink({ to, label }) {
    return (
        <NavLink
            to={to}
            style={{
                marginRight: '20px',
                whiteSpace: 'nowrap',
                fontSize: "18px",
                color: "black",
                fontFamily: "verdana",
            }}
            activeStyle={{
                fontWeight: "bold",
                color: "white"
            }}
        >
            {label}
        </NavLink>
    );

}
function retornaLinks(user) {


    if (user.permissao === "ALUNO") {
        return <>
            <SACELink to={'/nova-requisicao'} label={'Criar requisição'} />
            <SACELink to={`/aluno-requisicoes/`} label={'Requisições'} />
            <SACELink to={'/dados-aluno'} label={'Informações pessoais'} />
        </>
    } else if (user.permissao === "SERVIDOR") {
        return <>
            <SACELink to={'/minhas-requisicoes'} label={'Listar Requisições'} />

            <DropdownButton id="dropdown-basic-button" title="CADASTRAR" >
                <Dropdown.Item><Link to="/cadastrar-curso">Curso</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/cadastro-servidor">Servidor</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/cadastro-professor">Professor</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/cadastrar-disciplina">Disciplina</Link></Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="LISTAR" style={{}}>
                <Dropdown.Item ><Link to="/lista-alunos">Alunos</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/lista-professor">Professores</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/lista-servidor">Servidores</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/listar-curso">Cursos</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/lista-disciplina">Disciplinas</Link></Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="PESQUISAS" style={{}}>
                <Dropdown.Item ><Link to="/pesquisa-usuario">Pesquisas Usuários </Link></Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="RELATÓRIOS" style={{}}>
                <Dropdown.Item ><Link to="/relatorio-aproveitamento">Solicitações de Aproveitamento de Estudos </Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/relatorio-certificacao">Solicitações de Certificação de conhecimento </Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/relatorio-final">Final de Processo</Link></Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="CONFIGURAÇÕES DO SISTEMA" >
                <Dropdown.Item ><Link to="/configuracao-data">Configurar abertura Edital</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/troca-senha">Alterar senha</Link></Dropdown.Item>
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="IMPORTAR DADOS" >
                <Dropdown.Item ><Link to="/importador-cursos">Importar CURSOS</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/importador-disciplinas">Importar DISCIPLINAS</Link></Dropdown.Item>
                <Dropdown.Item ><Link to="/importador-professores">Importar USUÁRIOS</Link></Dropdown.Item>
            </DropdownButton>
        </>
    } else {
        return <>

            <SACELink to={'/minhas-requisicoes'} label={'Requisições do Professor'} />
        </>
    }
}


export default function SACENavbar({ setUserData, user }) {

    const [coordenador, setCoordenador] = useState([]);
    const [escolha, setEscolha] = useState([]);


    useEffect(() => {
        get("usuarios/auth/").then((r) => {
            console.log(r);
            
            setCoordenador(r && r.perfil.coordenador)
        })

    }, [])
    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            retornaLinks(user)
                        }
                        {escolha === "coordenador" ?
                            <Link style={{ color: "black",fontSize:"115%" }} to={'/requisicoes-coordenador'}>Requisições do Coordenador </Link> : ""
                        }
                    </Nav>
                </Navbar.Collapse>

            Usuário :&nbsp;
            <strong variant="outline-light" >{user.login}</strong>&nbsp;&nbsp;
            {coordenador === true ? <select
                    id={escolha}
                    value={escolha}
                    onChange={(e) => {
                        setEscolha(e.target.value)
                    }}
                >
                    <option value="professor">Professor</option>
                    <option value="coordenador">Coordenador</option>
                </select> : ""}
                &nbsp;&nbsp;

                <Button
                    variant="danger" className="btn btn-primary m-1"
                    onClick={() => {
                        logout();
                        setUserData(null);
                        window.location.href = ("/")
                    }}
                >
                    Logout
                </Button>

            </Navbar></>
    );
}
