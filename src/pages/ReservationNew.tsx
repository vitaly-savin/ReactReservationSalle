import React, {useEffect, useState} from 'react';
import {Button, Col, Dropdown, Form, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import { useSalles } from '../hooks/salles';
import CustomDropDown, {EventKey, IDropDownItem} from "../components/CustomDropDown";
import {useAutorisation} from "../hooks/authorisation";
import activiteList from "./ActiviteList";
import {act} from "react-dom/test-utils";
import Moment from 'react-moment';
import moment from "moment";
import {useReservations} from "../hooks/reservation";
import {IMembre, IReservation, ITime} from "../models";
import {useMembres} from "../hooks/membres";

const ReservationNew = () => {
    const {id: noSalle}= useParams();
    const {loading : salleLoading, error : salleError,salleParNoSalle} = useSalles(Number(noSalle));
    const {loading, error, getReservationByNoSalle, createReservation} = useReservations();
    const {membreList} = useMembres();
    const navigate = useNavigate();
    const [ddlMembreList, setDdlMembreList] = useState<IDropDownItem[]>([])
    const [selectedMembreList, setSelectedMembreList] = useState<IDropDownItem[]>([])
    const [salleActivities, setSalleActivities] = useState<IDropDownItem[]>([]);
    const [reservations, setReservations] = useState<IReservation[]>([]);
    const [reservationsByDate, setReservationsByDate] = useState<IReservation[]>([]);
    const {userEmail} = useAutorisation();
    const [activiteTitle, setActiviteTitle] = useState<string>("Activité");
    const [timeTitle, setTimeTitle] = useState<string>("Heure");
    const [availableTimes, setAvailableTimes] = useState<ITime[]>([]);
    const [maxDuration, setMaxDuration] = useState<number>(1);
    const [selectedTime, setSelectedTime] = useState<string>("");

    useEffect(() => {
        membreList.length && setDdlMembreList(membreList.filter(m => m.estActif && m.courriel !== userEmail()).map(membre =>{
            return {
                key: membre.courriel,
                value: membre.courrielNavigation.nom + " " + membre.courrielNavigation.prenom
            }
        }))
    },[membreList])

    useEffect(() => {
        const timeArray =[];
        for (let i = 8; i <= 21; i++) {
            timeArray.push({date: i + ':00', disabled: false});
        }
        setAvailableTimes(timeArray);
        getReservationByNoSalle(Number(noSalle)).then(reservations => setReservations(reservations))
    },[]);

    useEffect(() => {
       formik.validateForm()
    },[selectedTime]);

    useEffect(() => {
        const activ = salleParNoSalle?.nomActivites?.map((activite, index) => ({
            key: `${index}`,
            value: activite.nomActivite
        } as IDropDownItem));
        setSalleActivities(activ ?? []);
    }, [salleParNoSalle]);

    const initialValues = {
        noSalle: salleParNoSalle?.noSalle ?? 0,
        nomActivite: "",
        date: "",
        reservationTime:"",
        creerParMembreCourriel: userEmail(),
        duration: 1
    }
    const validationSchema = yup.object().shape({
        noSalle: yup.number().required("Entrez le numéro de la salle"),
        nomActivite: yup.string().required("Choisissez une activité"),
        date: yup.date().required("Choisissez la date"),
        reservationTime: yup.string().required("Choisissez une heure"),
        duration: yup.number().min(1).max(maxDuration)
    });

    const onSubmit = (values: any) =>{
        const dateHeureDebut = moment.utc(values.date+"T"+selectedTime).toISOString();
        const dateHeureFin = moment.utc(values.date+"T"+selectedTime).add(values.duration, 'hours').toISOString();
        const reservationObj: IReservation = {
            dateHeureDebut: dateHeureDebut,
            dateHeureFin: dateHeureFin,
            idEtatReservation: 1,
            creerParMembreCourriel: values.creerParMembreCourriel,
            noSalle: values.noSalle,
            nomActivite: values.nomActivite,
            lstIntivites: values.membres.map((m:IDropDownItem) => m.key)
        }
        createReservation(reservationObj);
    }

    const formik = useFormik({
        enableReinitialize: true,
        validationSchema,
        initialValues,
        onSubmit
    });
    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;

    const handleActivitySelect = (activite: string) => {
        setActiviteTitle(activite);
        formik.setFieldValue('nomActivite', activite)
    }

    const handleDateSelect = (e: any) => {
        formik.setFieldValue("date", e.target.value)
        const date = moment(e.target.value);
        const filteredReservations = reservations.filter(reservation => {
            return moment(reservation.dateHeureDebut).startOf('day').isSame(date.startOf('day'))
        });
        setReservationsByDate(filteredReservations)
        setAvailableTimes(availableTimes.map(time => {
            time.disabled = filteredReservations.some(reservation => {
                const hour = moment(time.date, 'HH:mm').get('hour');
                const heureDebut = moment(reservation.dateHeureDebut).get('hour');
                const heureFin = moment(reservation.dateHeureFin).get('hour');
                return reservation.idEtatReservation <= 2 && (hour >= heureDebut && hour < heureFin)
            })
            return time;
        })
        )
    }
    const handleTimeSelect = (selectedTime: string) => {
        setSelectedTime(selectedTime);
        formik.setFieldValue('reservationTime', selectedTime);
        setTimeTitle(selectedTime)
        formik.setFieldValue('duration', 1);
        let duration = 0;
        let timeIndex = 13;
        for (let i = 0; i < availableTimes.length; i++) {
            const time = availableTimes[i];
            if(selectedTime === time.date) {
                duration++;
                timeIndex = i;
            }
            if(i > timeIndex && time.disabled) break;
            if(i > timeIndex && !time.disabled) duration++;
        }
        setMaxDuration(duration);
    }

    return(
        <>
            <Row className={'gx-0 ps-3'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>Réservez la salle</h2>
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
                            <Form.Group className="mb-3" controlId="nomActivite">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Activite :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Dropdown onSelect={(key: any) => handleActivitySelect(key)}>
                                            <Dropdown.Toggle className={"w-100"} name={'nomActivite'} variant="secondary" id="dropdown-activite">
                                                {activiteTitle}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {salleActivities && salleActivities.map((a) =>
                                                    <Dropdown.Item key={a.key} eventKey={a.value} >{a.value}</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.nomActivite}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="date">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Date :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control value={values.date} type="date" onChange={(e:any) => handleDateSelect(e)} min={new Date().toISOString().slice(0, 10)}  />
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.date}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="reservationTime">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Heure début :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Dropdown onSelect={(key: any) => handleTimeSelect(key)}>
                                            <Dropdown.Toggle className={"w-100"} name={'reservationTime'} variant="secondary" id="reservationTime">
                                                {timeTitle}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {availableTimes && availableTimes.map((time, index) =>
                                                    <Dropdown.Item disabled={time.disabled} key={index} eventKey={time.date} >{time.date}</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.reservationTime}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="duration">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Durée (heures) :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control
                                            onChange={handleChange}
                                            value={values.duration}
                                            type="number"
                                            min="1"
                                            max={maxDuration}
                                            placeholder="durée de la réservation" />
                                        <span className={'d-flex px-3 invalid-feedback'}>{errors.duration}</span>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="membres">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Invités :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <CustomDropDown
                                            search
                                            name="membres"
                                            title="Ajout d'un membre"
                                            items={ddlMembreList}
                                            onItemSelect={(items) => setSelectedMembreList(items)}
                                            selectedItems={selectedMembreList} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col className="col-3"></Col>
                                <Col className="col-4 d-flex justify-content-evenly">
                                    <Button disabled={(!dirty || !isValid)}  variant="dark" type="submit">Réservez</Button>
                                    <Button onClick={()=>navigate("/OfficeList")} variant="dark" type="button">Annuler</Button>
                                </Col>
                            </Row>
                        </Form>
                    </FormikProvider>
                </Col>
            </Row>
            {(loading || salleLoading) && <Loading />}
            {error && navigate("/error", {state: {error: error}})}
            {salleError && navigate("/error", {state: {error: salleError}})}
            {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, isValid, touched, dirty }, null, 2)}</pre>*/}
        </>
    );
}

export default ReservationNew;