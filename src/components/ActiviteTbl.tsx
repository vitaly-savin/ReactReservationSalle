import React, {useEffect, useState} from "react";
import {IActivite, IActiviteProps} from "../models";
import {Button, Table} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export function ActiviteTbl(props:IActiviteProps){
    const [activiteList, setActiviteList] = useState<IActivite[]>(props.activiteList ?? []);
    const navigate = useNavigate();
    useEffect(() => {
        setActiviteList(props.activiteList ?? [])
    }, [props.activiteList]);

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>État</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                activiteList?.map((activite, index) => {
                    return (
                        <tr key={index}>
                            <td>{activite.nomActivite}</td>
                            <td>{activite.description}</td>
                            <td>{activite.estActif ? 'Actif' : 'Inactif'}</td>
                            <td className={'d-flex justify-content-evenly gap-2'}>
                                <Button className={'min-w-120'} onClick={()=>navigate("/ActiviteModifier/" + activite.nomActivite)} variant="dark">Modifier</Button>
                                <Button className={'min-w-120'} onClick={() => props.onDisable?.(activite.nomActivite)} variant="dark">{activite.estActif ? 'Désactiver' : 'Activer'}</Button>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}
export default ActiviteTbl;