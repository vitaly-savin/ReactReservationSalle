import React, {useEffect, useState} from "react";
import {ISalle, IOfficeTableProps, IActivite} from "../models";
import {Button, Col, Dropdown, Row, Table, Form} from "react-bootstrap";
import {useAutorisation} from "../hooks/authorisation";
import {useActivites} from "../hooks/activites";
import {useSalles} from "../hooks/salles";
import {useNavigate} from "react-router-dom";
import {FormikProvider, useFormik} from "formik";
import * as yup from "yup";
import TimePicker from "./TimePicker";
import moment from "moment";

export function OfficeTbl(props: IOfficeTableProps) {
    const {isAdmin,isMember} = useAutorisation()
    const {getSallesByDateTime} = useSalles()
    const [salleList, setSalleList] = useState<ISalle[]>(props.salleList ?? []);
    const [capaciteList, setCapaciteList] = useState<string[]>(props.salleList?.map(s => s.capacite+"") ?? []);
    const [typeTitle, setTypeTitle] = useState<string>("Type d’activité");
    const [capaciteTitle, setCapaciteTitle] = useState<string>("Capacite");
    const [dateTimeDebut, setDateTimeDebut] = useState<string>("");
    const [filtredSalleList, setFiltredSalleList] = useState<ISalle[]>(props.salleList ?? []);
    const [resetTime, setResetTime] = useState<boolean>(false);
    const navigate = useNavigate();
    const {activiteList} = useActivites();
    const initialValues = {
        date: moment().format('YYYY-MM-DD'),
        time: ""
    }
    const validationSchema = yup.object().shape({
        date: yup.string().required("Entrez la date"),
        time: yup.string().required("Entrez l'heure de début")
    });
    const onSubmit = (values: any) =>{
        const dateTime = values.date + "T" + values.time;
        getSallesByDateTime(dateTime).then(sallesDicpon => setFiltredSalleList(sallesDicpon));
    }
    const formik = useFormik({
        validationSchema,
        initialValues,
        onSubmit
    });
    const {handleSubmit, dirty, isValid, values, errors, touched, handleChange} = formik;

    useEffect(() => {
        setSalleList(props.salleList ?? [])
        setFiltredSalleList([...props.salleList ?? []]);
        const capaciteArr = props.salleList?.map(s => s.capacite+"").sort((a, b) =>  +a - +b ) ?? []
        const capaciteSet = new Set(capaciteArr);
        setCapaciteList(Array.from(capaciteSet));
    }, [props.salleList]);

    function handleTypeFilter(activite: IActivite) {
        resetCapaciteFilter();
        resetDateTimeFilter();
        setTypeTitle(activite.nomActivite)
        setFiltredSalleList([...salleList]);
        setFiltredSalleList(salleList.filter(s => s.nomActivites?.some(a => a.nomActivite == activite.nomActivite)));
    }

    function resetDateTimeFilter() {
        formik.setFieldValue('time', initialValues.time);
        formik.setFieldValue('date', initialValues.date);
        setResetTime(prev => !prev);
    }

    function handleCapaciteFilter(capacite: string) {
        resetDateTimeFilter()
        resetTypeFilter();
        setCapaciteTitle(capacite)
        setFiltredSalleList([...salleList]);
        setFiltredSalleList(salleList.filter(s => s.capacite == +capacite));
    }

    function resetTypeFilter() {
        setTypeTitle("Type d’activité");
        setFiltredSalleList([...props.salleList ?? []]);
    }

    function resetCapaciteFilter() {
        setCapaciteTitle("Capacite");
        setFiltredSalleList([...props.salleList ?? []]);
    }

    useEffect(() => {
        if(values.time) {
            formik.submitForm();
        }
    },[values.time, values.date])

    return (
        <>
        <Row className={'mb-2'}>
            <Col className={'d-flex align-content-start gap-2'}>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-nomactivite">
                        {typeTitle}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {resetTypeFilter();resetCapaciteFilter()}}>Select All</Dropdown.Item>
                        {activiteList && activiteList.map((a) =>
                            <Dropdown.Item key={a.nomActivite} onClick={() => handleTypeFilter(a)}>{a.nomActivite}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-capacite">
                        {capaciteTitle}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {resetTypeFilter();resetCapaciteFilter()}}>Select All</Dropdown.Item>
                        {capaciteList && capaciteList.map((c) =>
                            <Dropdown.Item key={c} onClick={() => handleCapaciteFilter(c)}>{c}</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-3 d-flex flex-row gap-2">
                            <Form.Control type="date" onSelect={()=>{resetTypeFilter();resetCapaciteFilter();}} onChange={handleChange} min={new Date().toISOString().slice(0, 10)} value={values.date} placeholder="la date" id={"date"}/>
                            <TimePicker reset={resetTime} onTimeSelect={(selectedTime) => {resetTypeFilter();resetCapaciteFilter();formik.setFieldValue('time', selectedTime)}} />
                        </div>
                    </Form>
                </FormikProvider>
            </Col>
        </Row>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>No</th>
                <th>Description</th>
                <th>Capacité</th>
                {isAdmin() && <th>État</th>}
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                filtredSalleList?.map((salle, index) => {
                    return (
                        <tr key={index}>
                            <td>{salle.noSalle}</td>
                            <td>{salle.description}</td>
                            <td>{salle.capacite}</td>
                            {isAdmin() && <td>{salle.estActif ? 'Actif' : 'Inactif'}</td>}
                            <td className={'d-flex justify-content-evenly gap-2'}>
                                <Button className={'min-w-120'} onClick={()=>navigate("/OfficeDetail/" + salle.noSalle)} variant="dark">Afficher</Button>
                                {isMember() && <Button className={'min-w-120'} onClick={()=>navigate("/ReservationNew/" + salle.noSalle)} variant="dark">Reserver</Button>}
                                {isAdmin() && <Button className={'min-w-120'} onClick={()=>navigate("/OfficeModifier/" + salle.noSalle)} variant="dark">Modifier</Button>}
                                {isAdmin() && <Button className={'min-w-120'} onClick={() => props.onDisable?.(salle.noSalle)} variant="dark">{salle.estActif ? 'Désactiver' : 'Activer'}</Button>}
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
            {/*<pre style={{ margin: '0 auto' }}>{JSON.stringify({ values, errors, dirty,touched, isValid,  }, null, 2)}</pre>*/}
        </>
    )
}

export default OfficeTbl;