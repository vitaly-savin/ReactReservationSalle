import {useEffect, useState} from "react";
import {IInvitation, IReservation} from "../models";
import axios, {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import {useAutorisation} from "./authorisation";

export function useReservations(noReservation?: number){
    const [reservationList, setReservationList] = useState<IReservation[]>([]);
    const [reservationListNonTraiter, setReservationListNonTraiter] = useState<IReservation[]>([]);
    const [reservationListAVenir, setReservationListAVenir] = useState<IReservation[]>([]);
    const [reservation, setReservation] = useState<IReservation>();
    const [arrEtat, setArrEtat] = useState([]);
    const [reservationParNo, setReservationParNo] = useState<IReservation>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const {userEmail} = useAutorisation()

    async function getAllReservations() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Reservations`)
            setReservationList(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function getAllReservationsNonTraiter() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Reservations/NonTraiter`)
            setReservationListNonTraiter(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    async function getAllReservationsByUserAVenir() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Reservations/AVenirMembre/${userEmail()}`)
            setReservationListAVenir(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

       const createReservation = async (reservation: IReservation) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Reservations?lstIntivites=${reservation.lstIntivites?.join("&lstIntivites=")}`, reservation)
            setLoading( false)
            navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    async function getReservationByNo(noReservation: number) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Reservations/${noReservation}`)
            setLoading( false)
            return response
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    async function getReservationByNoSalle(noSalle: number) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Reservations/salle/${noSalle}`)
            setLoading( false)
            return response.data
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
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/Invitations/${noReservation}/${memberEmail}`)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const addInvitationsForMember = async (noReservation: number, memberEmail: string) => {
        const newIntitation = {
            "noReservation": noReservation,
            "membreCourriel": memberEmail,
            "idEtatInvitation": 1
        }
        try {
            setError('')
            setLoading(true)
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Invitations`, newIntitation)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const modifierReservationByNo = async (reservation: IReservation) => {
        reservation.invitationsAjoutee?.forEach((memberCourriel)=>{
            addInvitationsForMember(reservation.noReservation!, memberCourriel)
        });
        reservation.invitationsSupremee?.forEach((memberCourriel)=>{
            deleteInvitationsForMember(reservation.noReservation!, memberCourriel)
        });

        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Reservations/${reservation.noReservation}`, reservation)
            setReservation(response.data)
            setLoading( false)
            navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }
    const annulerReservationByNo = async (noReservation: number, home: boolean = false) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Reservations/Annuler/${noReservation}`)
            setReservation(response.data)
            setLoading( false)
            home ? navigate("/") : navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const refuserReservationByNo = async (noReservation: number, home: boolean = false) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Reservations/Refuser/${noReservation}/${userEmail()}`)
            setReservation(response.data)
            setLoading( false)
            home ? navigate("/") : navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const accepterReservationByNo = async (noReservation: number, home: boolean = false) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Reservations/Accepter/${noReservation}/${userEmail()}`)
            setReservation(response.data)
            setLoading( false)
            home ? navigate("/") : navigate("/ReservationList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const getAllEtats = async () => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/EtatReservation`)
            setArrEtat(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
        }
    }

    const getNomEtatById = (id: number) =>  {
        return arrEtat.find((etat: any) => etat.idEtatReservation === id)?.['nomEtatReservation'];
    }

    useEffect(()=>{
        !!noReservation && getReservationByNo(noReservation)
    },[noReservation])

    useEffect(()=>{
        getAllReservations();
        getAllReservationsByUserAVenir();
        getAllReservationsNonTraiter();
    },[reservation])

    useEffect(() =>{
        getAllEtats();
        getAllReservationsByUserAVenir();
        getAllReservationsNonTraiter();
    },[])
    return {getReservationByNo, refuserReservationByNo, accepterReservationByNo ,reservationListNonTraiter, annulerReservationByNo, reservationList, reservationListAVenir, error, loading, createReservation, reservationParNo, modifierReservationByNo, getNomEtatById, getReservationByNoSalle}
}