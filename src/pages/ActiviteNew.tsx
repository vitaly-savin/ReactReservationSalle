import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import ActiviteTbl from "../components/ActiviteTbl";
import {useActivites} from "../hooks/activites";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useFormik} from "formik";
import { IActivite } from '../models';

const ActiviteNew = () => {
    const {loading, error, createActivity} = useActivites();
    const navigate = useNavigate();
    const initialValues = {
        nomActivite: "",
        description: "",
        estActif: true,
        creerParAdministrateurCourriel: 'dominic.primard@gmail.com'
    }
    const validationSchema = yup.object().shape({
        nomActivite: yup.string().required("Entrez le nom de l'activité"),
        description: yup.string().required("Entrez la description"),
        estActif: yup.bool().required("Choisissez l'etat"),
        creerParAdministrateurCourriel: yup.string()
    });
    const onSubmit = (values: IActivite) =>{
        createActivity(values)
    }

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit
    });

    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;

    return(
    <>
        <Row className={'gx-0 ps-3'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Nouveau type d’activité</h2>
            </Col>
        </Row>
        <Row className={'gx-0 ps-3'}>
            <Col>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="nomActivite">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >Nom de l’activité :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <Form.Control onChange={handleChange} type="text" placeholder="Entrez le nom de l'activité" />
                                <span className={'d-flex px-3 invalid-feedback'}>{errors.nomActivite}</span>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >Description :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <Form.Control onChange={handleChange} type="text" placeholder="Entrez la description" />
                                <span className={'d-flex px-3 invalid-feedback'}>{errors.description}</span>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >Est actif :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <Form.Check
                                    className={'text-start'}
                                    id="actifRadio"
                                    type="radio"
                                    name="estActif"
                                    label="Actif"
                                    checked={values.estActif}
                                    onChange={() => formik.setFieldValue("estActif", true)}
                                />
                                <Form.Check
                                    className={'text-start'}
                                    id="inactifRadio"
                                    type="radio"
                                    name="estActif"
                                    label="Inactif"
                                    checked={!values.estActif}
                                    onChange={() => formik.setFieldValue("estActif", false)}
                                />
                                <span className={'d-flex px-3 invalid-feedback'}>{errors.estActif}</span>

                            </Col>
                        </Row>
                    </Form.Group>
                    <Row>
                        <Col className="col-3"></Col>
                        <Col className="col-4 d-flex justify-content-evenly">
                            <Button disabled={(!dirty || !isValid)} variant="dark" type="submit">Enregistrer</Button>
                            <Button onClick={()=>navigate("/ActiviteList")} variant="dark" type="button">Annuler</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
        {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, isValid, touched, dirty }, null, 2)}</pre>*/}
    </>
    );
}

export default ActiviteNew;