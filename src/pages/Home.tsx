import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import ReservationTbl from "../components/ReservationTbl";
import Loading from "../components/Loading";
import {useReservations} from "../hooks/reservation";
import {useNavigate} from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";
import InvitationTbl from "../components/InvitationTbl";
import {useInvitation} from "../hooks/invitation";
import {IInvitation, IReservation} from "../models";
const Home = () => {
    const {isAdmin, isMember, userEmail} = useAutorisation()
    const {invitationList, loading : loadingInvitation, error : errorInvintation, accepterInvitationsForMember, refuserInvitationsForMember} = useInvitation();
    const {accepterReservationByNo, refuserReservationByNo, reservationListNonTraiter, annulerReservationByNo, loading, error, reservationListAVenir, reservationList} = useReservations();
    const [filteredList, setFilteredList ] = useState<IInvitation[]>([]);
    const [reservationsInviteeAvenir, setReservationsInviteeAvenir ] = useState<IReservation[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const filteredReservations = reservationList.filter(r => {
            return r.invitations?.some(i => i.membreCourriel == userEmail()
                && r.idEtatReservation !== 4
                && new Date(r.dateHeureDebut) >= new Date())
        })
        setReservationsInviteeAvenir(filteredReservations);
    },[reservationList])

    function handleEtat(noReservation: number) {
        if(isAdmin()){
            const reservationEtat = reservationListNonTraiter?.length && reservationListNonTraiter?.find(r => r.noReservation === noReservation)?.idEtatReservation;
            if(reservationEtat == 1 || reservationEtat == 3) {
                accepterReservationByNo(noReservation, true);
            }
            if(reservationEtat == 2) {
                refuserReservationByNo(noReservation, true);
            }
        } else {
            annulerReservationByNo(noReservation);
        }
    }
    useEffect(() =>{
        setFilteredList(invitationList.filter(invitation => invitation.idEtatInvitation == 1 && invitation.membreCourriel == userEmail()));
    },[invitationList])

    return (
        <>
            <Row className={'gx-0 mb-2'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>{isAdmin() ? "Liste des réservations non traitées": "Liste de mes réservations à venir"}</h2>
                    {isMember() && <Button onClick={()=>navigate("/ReservationNew")} variant="dark">Nouvelle reservation</Button>}
                </Col>
            </Row>
            <ReservationTbl
                onAction={noReservation => handleEtat(noReservation)}
                onCancel={(noReservation: number) => refuserReservationByNo(noReservation, true)}
                reservationList={isAdmin() ? reservationListNonTraiter : reservationsInviteeAvenir } />
            {!!filteredList.length && <>
            <Row className={'gx-0 mb-2'}>
                <Col className={'d-flex justify-content-between'}>
                    {isMember() && <h2>Liste de mes invitation non traitées</h2>}
                </Col>
            </Row>
            <InvitationTbl
                invitationList={filteredList}
                onAccepte={(noReservation: number) => accepterInvitationsForMember(noReservation)}
                onRefuse={(noReservation: number) => refuserInvitationsForMember(noReservation)}/></>}
            {loading && <Loading />}
            {error && navigate("/error", {state: {error: error}})}
        </>
    )
}

export default Home;