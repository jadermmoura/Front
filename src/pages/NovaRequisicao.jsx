import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import TituloPagina from '../components/TituloPagina';
import CertificacaoConhecimentosForm from '../components/forms/CertificacaoConhecimentosForm';
import AproveitamentoEstudosForm from '../components/forms/AproveitamentoEstudosForm';

const CERTIFICACAO = 'CERTIFICACAO';
const APROVEITAMENTO = 'APROVEITAMENTO';

const getFormulario = (tipo) => {
    switch(tipo){
        case CERTIFICACAO:
            return <CertificacaoConhecimentosForm />;
        case APROVEITAMENTO:
            return <AproveitamentoEstudosForm />;
        default:
            return null;
    }
}

export default function NovaRequisicao(){
    const [tipoRequisicao, setTipoRequisicao] = useState('');

    return(
        <>
            <TituloPagina titulo={'Nova requisição'} />
            <Form.Group className="mx-auto col-6 mb-4 mt-3">
                <Form.Label className="mb-1">
                    {'Selecione o tipo'}
                </Form.Label>
                <Form.Control 
                    as="select"
                    onChange={({target}) => setTipoRequisicao(target.value)}
                >
                    <option value=''>...</option>
                    <option value={APROVEITAMENTO}>Aproveitamento de Estudos</option>
                    <option value={CERTIFICACAO}>Certificação de Conhecimentos</option>
                </Form.Control>
            </Form.Group>

            {tipoRequisicao && 
                <Form className="col-10 bg-light mx-auto rounded p-4">
                    {getFormulario(tipoRequisicao)}
                </Form> 
            }
        </>
    );
}