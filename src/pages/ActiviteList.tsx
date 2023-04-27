import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import ActiviteTbl from "../components/ActiviteTbl";
import {useActivites} from "../hooks/activites";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";

const ActiviteList = () => {
    const {loading, error, activiteList, changeActivityStatus} = useActivites();
    const navigate = useNavigate();

    return(
    <>
        <Row className={'gx-0 mb-2'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Liste des activités</h2>
                <Button onClick={()=>navigate("/ActiviteNew")} variant="dark">Nouvelle activité</Button>
            </Col>
        </Row>
        <ActiviteTbl onDisable={nomActivite => changeActivityStatus(nomActivite)} activiteList={activiteList} />
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
    </>
    );
}

export default ActiviteList;