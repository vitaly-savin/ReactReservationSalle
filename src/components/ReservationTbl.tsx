import React, {useEffect, useState} from "react";
import {IReservation} from "../models";
import {Button, Table} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {useAutorisation} from "../hooks/authorisation";
import {useHelper} from "../hooks/helper";
import {useReservations} from "../hooks/reservation";

export interface IReservationTblProps{
    reservationList?: IReservation[]
    onAction?(noReservation: number):void
    onCancel?(noReservation: number):void
}
export function ReservationTbl(props:IReservationTblProps){
    const {isAdmin, isMember, userEmail} = useAutorisation()
    const {getNomEtatById} = useReservations()
    const {formatDate} = useHelper();
    const [reservationList, setReservationList] = useState<IReservation[]>(props.reservationList ?? []);
    const navigate = useNavigate();
    // const [etatButtonTitle, setEtatButtonTitle] = useState<string>("")
    useEffect(() => {
        setReservationList(props.reservationList ?? [])
    }, [props.reservationList]);

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>No</th>
                <th>Date et Heure Debut</th>
                <th>Date et Heure Fin</th>
                {isAdmin() && <th>Traiter Par</th>}
                {isAdmin() && <th>Traiter Le</th>}
                <th>État</th>
                <th>Creer par</th>
                <th>No Salle</th>
                <th>Nom d'activite</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                reservationList?.map((reservation, index) => {
                    let etatButtonTitle = "";
                    if(isAdmin()){
                        if(reservation.idEtatReservation == 1 || reservation.idEtatReservation == 3) {
                            etatButtonTitle = "Accepter"
                        }
                        if(reservation.idEtatReservation == 2) {
                            etatButtonTitle = "Refuser"
                        }
                    } else if(reservation.idEtatReservation != 4) {
                        etatButtonTitle = "Annuler"
                    } else {
                        etatButtonTitle = ""
                    }
                    return (
                        <tr key={index}>
                            <td>{reservation.noReservation}</td>
                            <td className={'text-nowrap'}>{formatDate(reservation.dateHeureDebut)}</td>
                            <td className={'text-nowrap'}>{formatDate(reservation.dateHeureFin)}</td>
                            {isAdmin() && <td>{reservation.traiterParAdministrateurCourriel}</td>}
                            {isAdmin() && <td className={'text-nowrap'}>{reservation.traiterLe && formatDate(reservation.traiterLe!, false)}</td>}
                            <td className={'text-nowrap'}>{getNomEtatById(reservation.idEtatReservation)}</td>
                            <td>{reservation.creerParMembreCourriel}</td>
                            <td>{reservation.noSalle}</td>
                            <td>{reservation.nomActivite}</td>
                            <td className={'d-flex justify-content-evenly gap-2'}>
                                <Button
                                    className={'min-w-120'}
                                    onClick={()=>navigate("/ReservationDetail/salle/" + reservation.noSalle + "/reservation/" + reservation.noReservation)}
                                    variant="dark">Afficher</Button>
                                {isMember() && <Button
                                    className={'min-w-120'}
                                    disabled={userEmail()!=reservation.creerParMembreCourriel}
                                    onClick={()=>navigate("/ReservationModifier/salle/" + reservation.noSalle + "/reservation/" + reservation.noReservation)}
                                    variant="dark">Modifier</Button>}
                                <Button
                                    className={'min-w-120 text-nowrap'}
                                    disabled={reservation.idEtatReservation === 4 || userEmail()!=reservation.creerParMembreCourriel}
                                    onClick={() => props.onAction?.(reservation.noReservation!)}
                                    variant="dark">{etatButtonTitle}</Button>
                                {(isAdmin()) && <Button
                                    className={'min-w-120'}
                                    disabled={reservation.idEtatReservation === 2 || reservation.idEtatReservation === 3 || reservation.idEtatReservation === 4}
                                    onClick={() => props.onCancel?.(reservation.noReservation!)}
                                    variant="dark">{(reservation.idEtatReservation === 2 || reservation.idEtatReservation === 3 || reservation.idEtatReservation === 4) ? "" : "Refuser"}</Button>}
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}
export default ReservationTbl;