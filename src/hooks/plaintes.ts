import {useEffect, useState} from "react";
import {IPlainte} from "../models";
import axios, {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import {useAutorisation} from "./authorisation";

export function usePlaintes(noReservation?: string){
    const [plainteList, setPlainteList] = useState<IPlainte[]>([]);
    const [plainte, setPlainte] = useState<IPlainte>();
    const [plainteParNom, setPlainteParNom] = useState<IPlainte>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const {userEmail} = useAutorisation()

    async function getAllPlaintes() {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Plaintes`)
            setPlainteList(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const changePlainteStatus = async (noReservation: string) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Plaintes/${noReservation}/${userEmail()}`)
            setPlainte(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const createPlainte = async (plainte: IPlainte) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Plaintes`, plainte)
            navigate("/PlainteList")
            setLoading( false);
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    async function getPlainteByNoReservationEmailMember(noReservation: string) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Plaintes/${noReservation}/${userEmail()}`)
            setPlainteParNom(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const modifierPlainteByNoReservationEmailMember = async (plainte: IPlainte) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/Plaintes/${plainte.noReservation}`, plainte)
            setPlainte(response.data)
            setLoading( false)
            navigate("/PlainteList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    useEffect(()=>{
        !!noReservation && getPlainteByNoReservationEmailMember(noReservation)
    },[noReservation])

    useEffect(()=>{
        getAllPlaintes()
    },[plainte])
    return {plainteList, error, loading, changePlainteStatus, createPlainte, plainteParNom, modifierPlainteByNom: modifierPlainteByNoReservationEmailMember}
}