import React from 'react';
import {Container, Row, Col, Spinner} from 'react-bootstrap';

const Loading = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    &nbsp; Loading...
                </Col>
            </Row>
        </Container>
    );
};

export default Loading;