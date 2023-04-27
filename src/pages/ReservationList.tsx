import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import ReservationTbl from "../components/ReservationTbl";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import {useReservations} from "../hooks/reservation";
import {useAutorisation} from "../hooks/authorisation";
import {IReservation} from "../models";

const ReservationList = () => {
    const {isAdmin, isMember, userEmail} = useAutorisation()
    const {accepterReservationByNo, refuserReservationByNo, annulerReservationByNo, loading, error, reservationList} = useReservations();
    const [reservationsInvitee, setReservationsInvitee ] = useState<IReservation[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const filteredReservations = reservationList.filter(r => {
            return r.invitations?.some(i => i.membreCourriel == userEmail())
        })
        setReservationsInvitee(filteredReservations);
    },[reservationList])

    function handleEtat(noReservation: number) {
        if(isAdmin()){
            const reservationEtat = reservationList?.length && reservationList?.find(r => r.noReservation === noReservation)?.idEtatReservation;
            if(reservationEtat == 1 || reservationEtat == 3) {
                accepterReservationByNo(noReservation);
            }
            if(reservationEtat == 2) {
                refuserReservationByNo(noReservation);
            }
        } else {
            annulerReservationByNo(noReservation);
        }
    }

    return (
        <>
            <Row className={'gx-0 mb-2'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>{isAdmin() ? "Liste des réservations": "Liste de mes réservations"}</h2>
                    {isMember() && <Button onClick={()=>navigate("/ReservationNew")} variant="dark">Nouvelle reservation</Button>}
                    {isAdmin() && <Button onClick={()=>navigate("/")} variant="dark">Liste des réservations non traitées</Button>}
                </Col>
            </Row>
            <ReservationTbl
                onAction={noReservation => handleEtat(noReservation)}
                onCancel={(noReservation: number) => refuserReservationByNo(noReservation, false)}
                reservationList={isAdmin() ? reservationList : reservationsInvitee } />
            {loading && <Loading />}
            {error && navigate("/error", {state: {error: error}})}
        </>
    )
}

export default ReservationList;