import React, {useEffect, useState} from "react";
import {IMembre, IMembreTableProps} from "../models";
import {Button, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export function MembreTbl(props: IMembreTableProps) {
    const navigate = useNavigate();
    const [membreList, setMembreList] = useState<IMembre[]>(props.membreList ?? []);
    useEffect(() => {
        setMembreList(props.membreList ?? [])
    }, [props.membreList]);

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>Nom</th>
                <th>Prenom</th>
                <th>État</th>
                <th>Courriel</th>
                <th>Telephone</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                membreList?.map((membre, index) => {
                    return (
                        <tr key={index}>
                            <td>{membre.courrielNavigation.nom}</td>
                            <td>{membre.courrielNavigation.prenom}</td>
                            <td>{membre.estActif ? 'Actif' : 'Inactif'}</td>
                            <td>{membre.courriel}</td>
                            <td>{membre.telephone}</td>
                            <td className={'d-flex justify-content-evenly gap-2'}>
                                <Button className={'min-w-120'} onClick={()=>navigate("/UserDetail/" + membre.courriel)} variant="dark">Afficher</Button>
                                <Button className={'min-w-120'} onClick={() => props.onDisable?.(membre.courriel)} variant="dark">{membre.estActif ? 'Désactiver' : 'Activer'}</Button>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}


export default MembreTbl;