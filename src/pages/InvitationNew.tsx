import React, {useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import Loading from "../components/Loading";
import * as yup from "yup";
import {useInvitation} from "../hooks/invitation";

const InvitationNew = () => {
    const {noReservation}= useParams();
    const navigate = useNavigate();
    const {loading, error, createInvitation} = useInvitation();
    const initialValues = {
        membreCourriel: ""
    }
    const validationSchema = yup.object().shape({
        membreCourriel: yup.string().email().max(50).required("Entrez le courriel")
    });
    const onSubmit = (values: any) =>{
        createInvitation({
            noReservation: +noReservation!,
            membreCourriel: values.membreCourriel,
            idEtatInvitation: 1
        })
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
                    <h2>Invité un membre à reservation #{noReservation} :</h2>
                </Col>
            </Row>
            <Row className={'gx-0 ps-3'}>
                <Col>
                    <FormikProvider value={formik}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="membreCourriel">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Courriel du membre :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control onChange={handleChange} type="email" autoComplete="email" placeholder="Entrez le courriel" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.membreCourriel}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col className="col-3"></Col>
                                <Col className="col-4 d-flex justify-content-evenly">
                                    <Button disabled={(!dirty || !isValid)} variant="dark" type="submit">Inviter</Button>
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

export default InvitationNew;