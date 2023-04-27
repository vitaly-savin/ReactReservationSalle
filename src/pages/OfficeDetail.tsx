import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import ActiviteTbl from "../components/ActiviteTbl";
import Loading from "../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import {IActivite, ISalle} from '../models';
import { useSalles } from '../hooks/salles';
import {types} from "sass";
import List = types.List;
import {useAutorisation} from "../hooks/authorisation";
import CustomDropDown, {IDropDownItem} from "../components/CustomDropDown";
import activiteList from "./ActiviteList";
import {useActivites} from "../hooks/activites";

const OfficeNew = () => {
    const {id: noSalle}= useParams();
    const {isAdmin, isMember, logout} = useAutorisation()
    const {loading, error, createSalle, salleParNoSalle} = useSalles(Number(noSalle));
    const [selectedActivities, setSelectedActivities] = useState<IDropDownItem[]>([]);
    const navigate = useNavigate();
    const {activiteList: al} = useActivites();
    useEffect(() => {
        setActiviteList(al ?? [])
    }, [al]);
    useEffect(() => {
        const activ = salleParNoSalle?.nomActivites?.map(a => ({
            key: a.nomActivite,
            value: a.nomActivite
        } as IDropDownItem));
        setSelectedActivities(activ ?? []);
    }, [salleParNoSalle]);
    const [activiteList, setActiviteList] = useState<IActivite[]>(al ?? []);
    const activityItems: IDropDownItem[] = activiteList.map(activity =>{
        return {
            key: activity.nomActivite,
            value: activity.nomActivite
        }
    })

    const initialValues = {
        noSalle: salleParNoSalle?.noSalle ?? 0,
        capacite: salleParNoSalle?.capacite ?? 0,
        description: salleParNoSalle?.description ?? "",
        nomActivites: salleParNoSalle?.nomActivites ?? [],
        estActif: salleParNoSalle?.estActif ?? true,
        creerParAdministrateurCourriel: "dominic.primard@gmail.com",
    }
    const validationSchema = yup.object().shape({
        noSalle: yup.number().required("Entrez le numéro de la salle"),
        capacite: yup.number().required("Entrez la capacité de la salle"),
        description: yup.string().required("Entrez la description"),
        nomActivites: yup.array(),
        estActif: yup.bool().required("Choisissez l'etat"),
        creerParAdministrateurCourriel: yup.string()
    });
    const onSubmit = (values: ISalle) =>{}

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema,
        initialValues,
        onSubmit
    });

    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;
    const arrActivetes = values.nomActivites?.map(activite => activite.nomActivite).join('; ');

    return(
    <>
        <Row className={'gx-0 ps-3'}>
            <Col className={'d-flex justify-content-between'}>
                <h2>Détail de la salle de laboratoire</h2>
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
                                    <Form.Control
                                        onChange={handleChange}
                                        value={values.noSalle}
                                        disabled
                                        type="number"
                                        placeholder="Entrez le numéro de la salle" />
                                    <span className={'d-flex px-3 invalid-feedback'}>{errors.noSalle}</span>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Row>
                                <Col className="col-3 text-start">
                                    <Form.Label >Description :</Form.Label>
                                </Col>
                                <Col className="col-4">
                                    <Form.Control
                                        onChange={handleChange}
                                        value={values.description ?? ""}
                                        disabled
                                        type="text"
                                        placeholder="Entrez la description" />
                                    <span className={'d-flex px-3 invalid-feedback'}>{errors.description}</span>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="capacite">
                            <Row>
                                <Col className="col-3 text-start">
                                    <Form.Label >Capacité :</Form.Label>
                                </Col>
                                <Col className="col-4">
                                    <Form.Control
                                        onChange={handleChange}
                                        value={values.capacite ?? 0}
                                        disabled
                                        type="number"
                                        placeholder="Entrez la capacité de la salle" />
                                    <span className={'d-flex px-3 invalid-feedback'}>{errors.capacite}</span>
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
                                        disabled
                                        search
                                        name="nomActivites"
                                        title="L'activité"
                                        items={activityItems}
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
                                        disabled
                                        id="actifRadio"
                                        type="radio"
                                        name="estActif"
                                        label="Actif"
                                        checked={values.estActif}
                                        onChange={() => formik.setFieldValue("estActif", true)}
                                    />
                                    <Form.Check
                                        className={'text-start'}
                                        disabled
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
                                {isAdmin() && <Button onClick={()=>navigate("/OfficeModifier/" + noSalle)}  variant="dark" type="button">Modifier</Button>}
                                <Button onClick={()=>navigate("/OfficeList")} variant="dark" type="button">Annuler</Button>
                            </Col>
                        </Row>
                    </Form>
                </FormikProvider>
            </Col>
        </Row>
        {loading && <Loading />}
        {error && navigate("/error", {state: {error: error}})}
        {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, isValid, touched, dirty }, null, 2)}</pre>*/}
    </>
    );
}

export default OfficeNew;