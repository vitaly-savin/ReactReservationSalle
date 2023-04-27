import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import OfficeTbl from "../components/OfficeTbl";
import {useSalles} from "../hooks/salles";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";

const OfficeList = () => {
    const {loading, error, salleList, changeSalleStatus} = useSalles();
    const {isAdmin, isMember, logout} = useAutorisation()
    const navigate = useNavigate();

    return(
    <>
        <Row className={'gx-0 mb-2'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Liste des salles</h2>
                {isAdmin() && <Button onClick={()=>navigate("/OfficeNew")} variant="dark">Nouvelle salle</Button>}
            </Col>
        </Row>
        <OfficeTbl onDisable={noSalle => changeSalleStatus(noSalle)} salleList={salleList} />
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
    </>
    );
}

export default OfficeList;