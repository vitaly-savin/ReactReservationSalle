import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import MembreTbl from "../components/MembreTbl";
import {useMembres} from "../hooks/membres";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";

const MembreList = () => {
    const {loading, error, membreList, changeMembreStatus} = useMembres();
    const navigate = useNavigate();

    return(
    <>
        <Row className={'gx-0 mb-2'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Liste des membres</h2>
            </Col>
        </Row>
        <MembreTbl onDisable={courriel => changeMembreStatus(courriel)} membreList={membreList} />
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
    </>
    );
}

export default MembreList;