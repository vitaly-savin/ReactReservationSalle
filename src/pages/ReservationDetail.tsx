import React, {useEffect, useState} from 'react';
import {Button, Col, Dropdown, Form, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";
import {FormikProvider, useFormik} from "formik";
import { useSalles } from '../hooks/salles';
import CustomDropDown, {IDropDownItem} from "../components/CustomDropDown";
import {useAutorisation} from "../hooks/authorisation";
import moment from "moment";
import {useReservations} from "../hooks/reservation";
import {IPlainte, IReservation, ISalle, ITime} from "../models";
import {faPlusSquare} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useMembres} from "../hooks/membres";
import {useInvitation} from "../hooks/invitation";
import PlainteTbl from "../components/PlainteTbl";
import {usePlaintes} from "../hooks/plaintes";

const ReservationDetail = () => {
    const {noReservation, noSalle}= useParams();
    const {getSalleByNoSalle, loading: salleLoading, error: salleError} = useSalles();
    const {loading, error, createReservation, getReservationByNo, getReservationByNoSalle, modifierReservationByNo} = useReservations();
    const {membreList} = useMembres();
    const {createPlainte} = usePlaintes();
    const {invitationsParReservation} = useInvitation(+noReservation!)
    const navigate = useNavigate();
    error && navigate("/error", {state: {error: error}})
    salleError && navigate("/error", {state: {error: salleError}})
    const [salleActivities, setSalleActivities] = useState<IDropDownItem[]>([]);
    const [reservation, setReservation] = useState<IReservation>();
    const [reservations, setReservations] = useState<IReservation[]>([]);
    const [reservationsByDate, setReservationsByDate] = useState<IReservation[]>([]);
    const [ddlMembreList, setDdlMembreList] = useState<IDropDownItem[]>([])
    const [selectedMembreList, setSelectedMembreList] = useState<IDropDownItem[]>([])
    const [initialMembreList, setInitialMembreList] = useState<IDropDownItem[]>([])
    const {userEmail, isMember} = useAutorisation();
    const [activiteTitle, setActiviteTitle] = useState<string>("Activité");
    const [timeTitle, setTimeTitle] = useState<string>("Heure");
    const [availableTimes, setAvailableTimes] = useState<ITime[]>([]);
    const [maxDuration, setMaxDuration] = useState<number>(15);
    const [duration, setDuration] = useState<number>(1);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [salleParNoSalle, setSalleParNoSalle] = useState<ISalle>();
    const {loading: loadingPlainte, error: errorPlainte, plainteList, changePlainteStatus} = usePlaintes();
    const [filteredList, setFilteredList ] = useState<IPlainte[]>([]);
    const [message, setMessage ] = useState<string>();

    useEffect(() => {
        const timeArray =[];
        for (let i = 8; i <= 21; i++) {
            timeArray.push({date: i + ':00', disabled: false});
        }
        setMaxDuration(15);
        setAvailableTimes(timeArray);
        getReservationByNo(Number(noReservation)).then(response => {response?.data && setReservation(response.data)})
        getReservationByNoSalle(Number(noSalle)).then(response => {response && setReservations(response)})
        getSalleByNoSalle(Number(noSalle), true).then(response => response?.data && setSalleParNoSalle(response.data))
    },[]);

    useEffect(() => {
        membreList.length && setDdlMembreList(membreList.filter(m => m.estActif && m.courriel !== userEmail()).map(membre =>{
            return {
                key: membre.courriel,
                value: membre.courrielNavigation.nom + " " + membre.courrielNavigation.prenom
            }
        }))
    },[membreList])
    useEffect(() => {
        membreList.length && invitationsParReservation.length && setSelectedMembreList(invitationsParReservation.map(i => {
            const membre = membreList.find(m => m.courriel == i.membreCourriel);
            const name = membre ? membre.courrielNavigation.nom + " " + membre.courrielNavigation.prenom + " ( " + i.nomEtatInvitation + " )" : "";
            return {
                key: i.membreCourriel,
                value: name,
                disabled: i.membreCourriel == userEmail()
            }
        }))
    }, [invitationsParReservation, membreList])

    useEffect(() => {
        setTimeTitle(selectedTime)
        availableTimes.length && formik.dirty && handleTimeSelect(selectedTime);
    },[selectedTime])

    useEffect(() => {
        if(reservation) {
            setActiviteTitle(reservation.nomActivite ?? "Activité")
            setSelectedTime(reservation.dateHeureDebut.slice(11, 16) ?? "08:00")
            const heureDebut = moment(reservation.dateHeureDebut).get('hour');
            const heureFin = moment(reservation.dateHeureFin).get('hour');
            setDuration(heureFin - heureDebut);
            handleDateSelect(reservation.dateHeureDebut.slice(0,10))
            setInitialMembreList(selectedMembreList)
        }
    }, [reservation])

    useEffect(() => {
        const activ = salleParNoSalle?.nomActivites?.map((activite, index) => ({
            key: `${index}`,
            value: activite.nomActivite
        } as IDropDownItem));
        setSalleActivities(activ ?? []);
    }, [salleParNoSalle]);

    useEffect(() =>{
        setFilteredList(plainteList.filter(plainte => plainte.noReservation == reservation?.noReservation));
    },[plainteList, reservation])

    const initialValues = {
        noSalle:reservation?.noSalle ?? 0,
        nomActivite: reservation?.nomActivite ?? "",
        date: reservation?.dateHeureDebut.slice(0,10) ?? "",
        reservationTime: reservation?.dateHeureDebut.slice(11,16) ?? "",
        creerParMembreCourriel: userEmail(),
        duration: duration,
        membres: initialMembreList
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
        const invitations = values.membres.map((m:IDropDownItem) => m.key);
        const invitationsPrev = invitationsParReservation.map(i => i.membreCourriel);
        const invitationsAjoutee = [...new Set([...invitations, ...invitationsPrev])].filter(item => !invitationsPrev.includes(item));
        const invitationsSupremee = invitationsPrev.filter(item => !invitations.includes(item));
        const reservationObj: IReservation = {
            noReservation: Number(noReservation),
            dateHeureDebut: dateHeureDebut,
            dateHeureFin: dateHeureFin,
            idEtatReservation: 1,
            creerParMembreCourriel: values.creerParMembreCourriel,
            noSalle: values.noSalle,
            nomActivite: values.nomActivite,
            lstIntivites: values.membres.map((m:IDropDownItem) => m.key),
            invitationsAjoutee,
            invitationsSupremee
        }
        modifierReservationByNo(reservationObj);
    }

    const formik = useFormik({
        enableReinitialize: true,
        validateOnMount: false,
        isInitialValid: true,
        validationSchema,
        initialValues,
        onSubmit
    });
    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange, handleBlur} = formik;


    const handleActivitySelect = (activite: string) => {
        setActiviteTitle(activite);
        formik.setFieldValue('nomActivite', activite)
    }

    const handleDateSelect = (selectedDate: string) => {
        formik.setFieldValue("date", selectedDate)
        const date = moment(selectedDate);
        const filteredReservations = reservations.filter(reservation => {
            return moment(reservation.dateHeureDebut).startOf('day').isSame(date.startOf('day'))
        });
        setReservationsByDate(filteredReservations)
        setAvailableTimes(availableTimes.map(time => {
            time.disabled = filteredReservations.some(reservation => {
                if(reservation.noReservation == noReservation) return false;
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

    function handleMembreSelect(items: IDropDownItem[]) {
        setSelectedMembreList(items)
    }

    function ajouterPlainte(){
        const newPlainte: IPlainte = {
            noReservation: +noReservation!,
            membreCourriel: userEmail(),
            datePlainte: new Date().toISOString(),
            description: message!,
            administrateurCourriel: null
        }
        createPlainte(newPlainte)
    }

    return(
        <>
            <Row className={'gx-0 ps-3'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>Detail d'une réservation #{reservation?.noReservation} de salle :</h2>
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
                                            <Dropdown.Toggle disabled className={"w-100"} name={'nomActivite'} variant="secondary" id="dropdown-activite">
                                                {activiteTitle}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {salleActivities && salleActivities.map((a) =>
                                                    <Dropdown.Item key={a.key} eventKey={a.value} >{a.value}</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="date">
                                <Row>
                                    <Col className="col-3 text-start">
                                        <Form.Label >Date :</Form.Label>
                                    </Col>
                                    <Col className="col-4">
                                        <Form.Control disabled onBlur={handleBlur} value={values.date} type="date" onChange={(e:any) => handleDateSelect(e.target.value)} min={new Date().toISOString().slice(0, 10)}  />
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
                                            <Dropdown.Toggle disabled className={"w-100"} name={'reservationTime'} variant="secondary" id="reservationTime">
                                                {timeTitle}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {availableTimes && availableTimes.map((time, index) =>
                                                    <Dropdown.Item disabled={time.disabled} key={index} eventKey={time.date} >{time.date}</Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
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
                                            disabled
                                            onChange={handleChange}
                                            value={values.duration}
                                            type="number"
                                            min="1"
                                            max={maxDuration}
                                            placeholder="durée de la réservation" />
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
                                            disabled
                                            search
                                            onBlur={handleBlur}
                                            name="membres"
                                            title="Ajout d'un membre"
                                            items={ddlMembreList}
                                            onItemSelect={handleMembreSelect}
                                            selectedItems={selectedMembreList} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col className="col-3"></Col>
                                <Col className="col-4 d-flex justify-content-evenly gap-2">
                                    {(isMember() && userEmail()==reservation?.creerParMembreCourriel) && <Button onClick={()=>navigate("/ReservationModifier/salle/" + reservation!.noSalle + "/reservation/" + reservation!.noReservation)}  variant="dark" type="button">Modifier</Button>}
                                    <Button onClick={()=>navigate("/ReservationList")} variant="dark" type="button">Annuler</Button>
                                </Col>
                            </Row>
                        </Form>
                    </FormikProvider>
                    {isMember() && !filteredList.some(p => p.membreCourriel == userEmail()) && <>
                        <Form.Group className="mb-3" controlId="plainte">
                            <Row className={'gx-0 pt-5'}>
                                <Col className="col-5">
                                    <Form.Control as="textarea"
                                        type="text"
                                        onChange={(e) => setMessage(e.target.value)}
                                        maxLength={255}
                                        placeholder="Plainte de la réservation" />
                                </Col>
                                <Col className="col-2 d-flex align-items-center justify-content-evenly gap-2">
                                    <Button
                                        className={'text-nowrap h-fit-content'}
                                        disabled={!!!message}
                                        onClick={()=>ajouterPlainte()}
                                        variant="dark" type="button">
                                        <FontAwesomeIcon icon={faPlusSquare} /> Plainte</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </>}
                </Col>
            </Row>
            {!!filteredList.length && <>
                <Row className={'gx-0 pt-5'}>
                    <Col className={'d-flex flex-column'}>
                        <h2>Plainte pour réservation #{reservation?.noReservation} :</h2>
                        <PlainteTbl
                            onDisable={noPlainte => changePlainteStatus(noPlainte)}
                            plainteList={filteredList} />
                    </Col>
                </Row>
            </>}
            {(loading || loadingPlainte || salleLoading) && <Loading />}
            {errorPlainte && navigate("/error", {state: {error: error}})}
            {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, isValid, touched, dirty }, null, 2)}</pre>*/}
        </>
    );
}

export default ReservationDetail;