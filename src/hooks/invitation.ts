import {IInvitation, } from "../models";
import axios, {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAutorisation} from "./authorisation";

export function useInvitation(noReservation?: number) {

    const [invitationList, setInvitationList] = useState<IInvitation[]>([]);
    const [invitationsParReservation, setInvitationsParReservation] = useState<IInvitation[]>([]);
    const [invitation, setInvitation] = useState<IInvitation>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const {userEmail} = useAutorisation()

    const getNomEtatById: any = {
        1 : "Non-traitée",
        2 : "Acceptée",
        3 : "Refusée"
    }

    async function getAllInvitations() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Invitations/`)
            setInvitationList(ajouteNomEtat(response.data))
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    async function getAllInvitationsForMember() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Invitations/membre/${userEmail()}`)
            setInvitationList(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function accepterInvitationsForMember(noReservation: number) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Invitations/Accepter/${noReservation}/${userEmail()}`)
            setInvitation(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function refuserInvitationsForMember(noReservation: number) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Invitations/Refuser/${noReservation}/${userEmail()}`)
            setInvitation(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function deleteInvitationsForMember(noReservation: number, memberEmail: string) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Invitations/${noReservation}/${memberEmail}`)
            setInvitation(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function  getInvitationsParReservation(noReservation: number) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Invitations/reservation/${noReservation}`)
            setInvitationsParReservation(ajouteNomEtat(response.data))
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const createInvitation = async (invitation: IInvitation) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Invitations`, invitation)
            setLoading( false)
            navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    function ajouteNomEtat(invitationList: IInvitation[]) {
        return invitationList.map((i: IInvitation) => {
            i.nomEtatInvitation = getNomEtatById[i.idEtatInvitation];
            return i;
        })
    }

    useEffect(() =>{
        noReservation && getInvitationsParReservation(noReservation);
    },[])

    useEffect(()=>{
        getAllInvitations()
    },[invitation])

    return{createInvitation, error, loading, invitationList, accepterInvitationsForMember, refuserInvitationsForMember, deleteInvitationsForMember, invitationsParReservation}
}