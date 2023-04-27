import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";
import {IAutorisation} from "../models";
import {useFormik} from "formik";
import {useAutorisation} from "../hooks/authorisation";

const Autorisation = () => {

    const {id: courriel}= useParams();
    const {loading, error, login} = useAutorisation();
    const navigate = useNavigate();

    const initialValues = {
        password: "",
        email: ""
    }
    const validationSchema = yup.object().shape({
        password: yup.string().required("Entrez le mot de passe"),
        email: yup.string().email().required("Entrez le courriel")
    });
    const onSubmit = (values: IAutorisation) =>{
        login(values);
    }

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema,
        initialValues,
        onSubmit
    });

    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;
    
    return (
        <>
            <Row className={'gx-5 ps-3 pt-5'}>

                <Col className={'col-6 text-start'}>
                    <Row className={'gx-0'}>
                        <h2>Déjà membre?</h2>
                        <p>Saisissez votre adresse courriel et votre mot de passe.</p>
                    </Row>
                    <Row className={'gx-0'}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Row>
                                    <Col className="text-start">
                                        <Form.Label >Courriel :</Form.Label>
                                        <Form.Control
                                            onChange={handleChange}
                                            value={values.email}
                                            autoComplete="email"
                                            type="email"
                                            placeholder="Entrez le courriel" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.email}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Row>
                                    <Col className="text-start">
                                        <Form.Label >Mot de passe :</Form.Label>
                                        <Form.Control
                                            onChange={handleChange}
                                            value={values.password}
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Entrez le mot de passe" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.password}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row className={'gx-0'}>
                                <Col className={'d-flex flex-column justify-content-between'}>
                                    <Button disabled={(!dirty || !isValid)} variant="dark" type="submit">Se connecter</Button>
                                    {error && error.response.status == '401' && <span className={'d-flex px-3 invalid-feedback'}>Courriel ou Mot de passe incorrect !</span>}
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
                <Col className={'col-6 text-start d-flex flex-column justify-content-between'}>
                    <div className="description">
                        <h2>Vous n’êtes pas membre?</h2>
                        <p>Pour accéder à ce site, il faut être membre.</p>
                        <p>Le but de cette application est de permettre à un membre de réserver une salle de laboratoire.</p>
                    </div>
                    <Button onClick={()=>navigate("/NewUser")} variant="dark" type="button">Créer un compte</Button>
                </Col>
            </Row>
            <Row className={'gx-0 ps-3'}>
                <Col className={'text-start'}>
                    <Link to={"/ForgotPassword"}>Mot de passe oublié</Link>
                </Col>
            </Row>
            <Row className={'gx-0 text-start mt-5'}>
                <h2>À propos</h2>
                <p>Ce système est une application permettant de planifier les réservations des salles de laboratoire par le personnel et les étudiants du Cégep. Cette application est accessible à tous les membres du Cégep qui souhaitent vérifier les disponibilités au cégep des salles de laboratoire et demander une réservation, avec une ou plusieurs personnes, une des salles de laboratoire en indiquant la période de réservation et le type d’activité qu’ils vont faire, et ce, parmi la liste d’activités autorisées. Le responsable des laboratoires doit valider cette demande. Chaque utilisateur pourra créer un profil et garder l’historique de ses réservations selon le type d’activité.</p>
            </Row>
            {loading && <Loading />}
            {error && (error.response.status != '401') && navigate("/error", {state: {error: error.message}})}
            {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, isValid, touched, dirty }, null, 2)}</pre>*/}
        </>
    );
}

export default Autorisation;