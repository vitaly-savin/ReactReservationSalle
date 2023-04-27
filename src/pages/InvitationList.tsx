import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import Loading from "../components/Loading";
import {useNavigate} from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";
import InvitationTbl from "../components/InvitationTbl";
import {useInvitation} from "../hooks/invitation";

const InvitationList = () => {
    const {isAdmin, isMember, userEmail} = useAutorisation()
    const {invitationList, loading, error, accepterInvitationsForMember, refuserInvitationsForMember} = useInvitation();
    const navigate = useNavigate();

    return (
        <>
            <Row className={'gx-0 mb-2'}>
                <Col className={'d-flex justify-content-between'}>
                    <h2>{isAdmin() ? "Liste des invitations": "Liste de mes invitations"}</h2>
                    {/*{isMember() && <Button onClick={()=>navigate("/InvitationNew")} variant="dark">Nouvelle invitation</Button>}*/}
                </Col>
            </Row>
            <InvitationTbl invitationList={invitationList.filter(invitation => isAdmin() || invitation.membreCourriel == userEmail()) }
                           onAccepte={(noReservation: number) => accepterInvitationsForMember(noReservation)}
                           onRefuse={(noReservation: number) => refuserInvitationsForMember(noReservation)}/>
            {loading && <Loading />}
            {error && navigate("/error", {state: {error: error}})}
        </>
    )
}

export default InvitationList;