import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { getCertificacoes } from '../services/RequisicaoService';
import CardCertificacao from '../components/CardCertificacao';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import './tabelarequisicoes.css';

export default function (user) {
  const [requisicoes, setRequisicoes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getCertificacoes(user)
      .then(result => {
        setRequisicoes(result);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, [user]);

  return (
    <Container fluid>
     <Row>
        <Col>
             <h5 className="row d-flex justify-content-center titulo">Certificação de conhecimentos</h5>
             {error && <Alert variant='danger'>Não foi possível carregar suas requisições.</Alert>}
        </Col>
      </Row>
      <Row sm={12} style={{
        height:'200px'
      }}>
              {
                isLoading 
              ? 
                <div style={{ minHeight: '300px' }} className="d-flex justify-content-center align-items-center text-primary">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              :
                requisicoes && requisicoes.map((requisicao) => <CardCertificacao requisicao={requisicao}/>)
              }    
    </Row>   
  </Container>
  );
}