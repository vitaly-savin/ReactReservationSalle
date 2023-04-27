import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import Loading from "../components/Loading";
import * as yup from "yup";
import {useAutorisation} from "../hooks/authorisation";

const NewUser = () => {
    const {loading, error, signup} = useAutorisation();
    const navigate = useNavigate();
    const initialValues = {
        email: "",
        adresse: "",
        province: "",
        codePostal: "",
        telephone: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    }
    const validationSchema = yup.object().shape({
        email: yup.string().email().max(50).required("Entrez le courriel"),
        adresse: yup.string().max(50),
        province: yup.string().max(25),
        codePostal: yup.string().max(7),
        telephone: yup.string().max(10).required("Entrez le telephone"),
        firstName: yup.string().max(30).required("Entrez le prenom"),
        lastName: yup.string().max(30).required("Entrez le nom"),
        password: yup.string().required("Entrez le mot de pass"),
        confirmPassword: yup.string().oneOf([yup.ref('password')],"Confirmez le mot de pass")
    });
    const onSubmit = (values: any) =>{
        signup(values)
    }

    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit
    });

    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;

    return (
        <>
            <Row className={'gx-0 ps-3'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>Créer un profil pour un nouvel utilisateur</h2>
                </Col>
            </Row>
            <Row className={'gx-0 ps-3'}>
                <Col>
                    <FormikProvider value={formik}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="email">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Courriel :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="email" autoComplete="email" placeholder="Entrez le courriel" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.email}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Mot de passe  :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="password" autoComplete="new-password" placeholder="Entrez le Mot de passe" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.password}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="confirmPassword">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Confirmer mot de passe:</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="password" autoComplete="new-password" placeholder="Confirmez mot de passe" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.confirmPassword}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <h3 className={'text-start'}>Adresse</h3>
                            <Form.Group className="mb-3" controlId="lastName">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Nom :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez le Nom" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.lastName}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Prénom  :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez le Prénom" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.firstName}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="adresse">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Adresse  :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez l'adresse" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.adresse}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="codePostal">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Code postal :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez Code postal" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.codePostal}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="province">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Province :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez Province" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.province}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="telephone">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Téléphone :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="text" placeholder="Entrez le Téléphone" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.telephone}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col className="col-3"></Col>
                                <Col className="col-4 d-flex justify-content-evenly">
                                    <Button disabled={(!dirty || !isValid)} variant="dark" type="submit">Enregistrer</Button>
                                    <Button onClick={()=>navigate("/")} variant="dark" type="button">Annuler</Button>
                                </Col>
                            </Row>
                        </Form>
                    </FormikProvider>
                </Col>
            </Row>
            {loading && <Loading />}
            {error && navigate("/error", {state: {error: error}})}
            {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, dirty,touched, isValid,  }, null, 2)}</pre>*/}
        </>
);
}

export default NewUser;