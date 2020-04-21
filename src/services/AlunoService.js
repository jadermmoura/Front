import {retornaPerfil} from '../auxiliares/retornaPerfil';
import { post } from './ServicoCrud';
import axios from 'axios';
import { baseURL } from '../enviroment';
const postCadastroUsuario = async (usuario) => {
    if (!usuario) return;
    return  post("usuarios/alunos/",{
        password: usuario.password,
        userName: usuario.userName,
        permissao:usuario.permissao,
        perfil :retornaPerfil(usuario)
    });
    
}
        const delAluno = async (end, id) => {
            try {
                await axios.delete(`${baseURL}/${end}/${id}`).then((resp) => {
                    return resp;
                })
            } catch (error) {
                console.log(`${end.toUpperCase()}Service/delete${end}:`, error);
            }
        }

        const putAluno = async (end, id,dados) => {
            
            try {
                await axios.put(`${baseURL}/${end}/${id}`,dados).then((resp) => {
                    console.log(resp);
                    return resp;
                })
            } catch (error) {
                console.log(`${end.toUpperCase()}Service/atualizar${end}:`, error);
            }
        }
export  { postCadastroUsuario,delAluno ,putAluno};

