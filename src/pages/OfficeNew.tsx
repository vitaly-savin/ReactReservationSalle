import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import {IActivite, ISalle} from '../models';
import { useSalles } from '../hooks/salles';
import CustomDropDown, {IDropDownItem} from "../components/CustomDropDown";
import {useActivites} from "../hooks/activites";

const OfficeNew = () => {
    const {loading, error, createSalle} = useSalles();
    const {activiteList: al} = useActivites();
    const [activiteList, setActiviteList] = useState<IActivite[]>(al ?? []);
    useEffect(() => {
        setActiviteList(al ?? [])
    }, [al]);
    const navigate = useNavigate();
    const initialValues = {
        noSalle: 0,
        capacite: 0,
        description: "",
        nomActivites: [],
        estActif: true,
        creerParAdministrateurCourriel: "dominic.primard@gmail.com",
    }
    const validationSchema = yup.object().shape({
        noSalle: yup.number().moreThan(0).required("Entrez le numéro de la salle"),
        capacite: yup.number().moreThan(0).required("Entrez la capacité de la salle"),
        description: yup.string().required("Entrez la description"),
        nomActivites: yup.array(),
        estActif: yup.bool().required("Choisissez l'etat"),
        creerParAdministrateurCourriel: yup.string()
    });
    const onSubmit = (values: any) =>{
        createSalle(values)
    }

    const [selectedActivities, setSelectedActivities] = useState<IDropDownItem[]>([])

    const activityItems: IDropDownItem[] = activiteList.map(activity =>{
        return {
            key: activity.nomActivite,
            value: activity.nomActivite
        }
    })

    const handleActivitySelect = (selectedActivityItems: IDropDownItem[]) => {
        setSelectedActivities(selectedActivityItems)
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
                <h2>Ajouter une salle de laboratoire</h2>
            </Col>
        </Row>
        <Row className={'gx-0 ps-3'}>
            <Col>
                <FormikProvider value={formik}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="noSalle">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >No de la salle :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <Form.Control onChange={handleChange} type="number" placeholder="Entrez le numéro de la salle" />
                                <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.noSalle}</span>
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
                                <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.description}</span>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="capacite">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >Capacité :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <Form.Control onChange={handleChange} type="number" placeholder="Entrez la capacité de la salle" />
                                <span className={'d-flex px-3 invalid-feedback'}>{dirty && errors.capacite}</span>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="activites">
                        <Row>
                            <Col className="col-3 text-start">
                                <Form.Label >Activités :</Form.Label>
                            </Col>
                            <Col className="col-4">
                                <CustomDropDown
                                    search
                                    name="nomActivites"
                                    title="Choisissez l'activité"
                                    items={activityItems}
                                    onItemSelect={handleActivitySelect}
                                    selectedItems={selectedActivities} />
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
                </FormikProvider>
            </Col>
        </Row>
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
        {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, dirty,touched, isValid,  }, null, 2)}</pre>*/}
    </>
    );
}

export default OfficeNew;