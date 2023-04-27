import React from 'react';
import {Col, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import {usePlaintes} from "../hooks/plaintes";
import PlainteTbl from "../components/PlainteTbl";

const PlainteList = () => {
    const {loading, error, plainteList, changePlainteStatus} = usePlaintes();
    const navigate = useNavigate();

    return(
    <>
        <Row className={'gx-0 mb-2'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Liste des plaintes</h2>
            </Col>
        </Row>
        <PlainteTbl
            onDisable={noPlainte => changePlainteStatus(noPlainte)}
            plainteList={plainteList} />
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
    </>
    );
}

export default PlainteList;