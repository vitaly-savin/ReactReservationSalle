import React, {useEffect, useState} from "react";
import {IPlainte, IPlainteProps} from "../models";
import { Table} from "react-bootstrap";
import {useAutorisation} from "../hooks/authorisation";
import {useHelper} from "../hooks/helper";
export function PlainteTbl(props:IPlainteProps){
    const {isAdmin, userEmail} = useAutorisation()
    const {formatDate} = useHelper();
    const [plainteList, setPlainteList] = useState<IPlainte[]>(props.plainteList ?? []);
    useEffect(() => {
        setPlainteList(props.plainteList ?? [])
    }, [props.plainteList]);

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Numéro de réservation</th>
                <th>Créateur</th>
                <th>Date de plainte</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {
                plainteList?.map((plainte, index) => {
                    return (
                        <tr key={index}>
                            <td>{plainte.noReservation}</td>
                            <td>{plainte.membreCourriel}</td>
                            <td className={'text-nowrap'}>{formatDate(plainte.datePlainte, false)}</td>
                            <td>{plainte.description}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}
export default PlainteTbl;