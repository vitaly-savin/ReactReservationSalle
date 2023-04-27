import React, {useEffect, useState} from "react";
import {IInvitation, } from "../models";
import {Button, Table} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";
import {useHelper} from "../hooks/helper";

export interface IInvitationTblProps{
    invitationList?: IInvitation[]
    onAccepte(noReservation: number):void
    onRefuse(noReservation: number):void
}
export function InvitationTbl(props:IInvitationTblProps){
    const {isAdmin, isMember, userEmail} = useAutorisation();
    const {formatDate} = useHelper();
    const [invitationList, setInvitationList] = useState<IInvitation[]>(props.invitationList ?? []);
    const navigate = useNavigate();
    useEffect(() => {
        setInvitationList(props.invitationList ?? [])
    }, [props.invitationList]);
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>No Reservation</th>
                <th>Membre</th>
                <th>État</th>
                <th>Date de reponse</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                invitationList.length > 0 && invitationList.map((invitation, index) => {
                    return (
                        <tr key={index}>
                            <td>{invitation.noReservation}</td>
                            <td>{invitation.membreCourriel}</td>
                            <td className={'text-nowrap'}>{invitation.nomEtatInvitation}</td>
                            <td className={'text-nowrap'}>{formatDate(invitation.dateReponse ?? "", false)}</td>
                            <td className={'d-flex justify-content-evenly gap-2'}>
                                {(invitation.idEtatInvitation == 1 || invitation.idEtatInvitation == 3) && <Button className={'min-w-120 text-nowrap'} onClick={() => props.onAccepte(invitation.noReservation)} variant="dark">Accepter</Button>}
                                {(invitation.idEtatInvitation == 1 ||  invitation.idEtatInvitation == 2) && <Button className={'min-w-120 text-nowrap'} onClick={() => props.onRefuse(invitation.noReservation)} variant="dark">Refuser</Button>}
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}
export default InvitationTbl;