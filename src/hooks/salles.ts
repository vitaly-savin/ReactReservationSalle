import {useEffect, useState} from "react";
import {IActivite, ISalle} from "../models";
import axios, {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import {IDropDownItem} from "../components/CustomDropDown";
import {useAutorisation} from "./authorisation";

export function useSalles(noSalle?: number){
    const {isAdmin, userEmail,} = useAutorisation()
    const [salleList, setSalleList] = useState<ISalle[]>([]);
    const [salle, setSalle] = useState<ISalle>();
    const [salleParNoSalle, setSalleParNoSalle] = useState<ISalle>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function getAllSalles() {
        try {
            setError ('')
            setLoading (true)
            let response;
            if(!!isAdmin()) {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires`)
            } else {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/pourReservation`)
            }
            setSalleList (response. data)
            setLoading ( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading (false)
            setError (error. message)
        }
    }

    const changeSalleStatus = async (noSalle: number) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/modifierEtat/${noSalle}`)
            setSalle(response. data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const createSalle = async (salle: any) => {
        try {
            setError('')
            setLoading(true)
            const params = salle.nomActivites?.map((item: IDropDownItem) => `lstTypeActivite=${item.value}`).join("&");
            delete salle['nomActivites'];
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires?${params}`, salle)
            setLoading( false)
            navigate("/OfficeList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    async function getSalleByNoSalle(noSalle: number, promise: boolean = false ) {
        try {
            setError('')
            setLoading(true)
            let response;
            if(!!isAdmin()) {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/${noSalle}`)
            } else {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/pourReservation/${noSalle}`)
            }
            if(!promise){
                setSalleParNoSalle(response.data)
            } else {
                setLoading( false)
                return response;
            }
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    async function getSallesByDateTime(dateTime: string) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/pourReservationDateHeure/${dateTime}`)
            setLoading( false)
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const modifierSalleByNoSalle = async (activity: ISalle) => {
        try {
            setError('')
            setLoading(true)
            const params = activity.nomActivites?.map((item: IActivite) => `lstTypeActivite=${item.nomActivite}`).join("&");
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/SalleLaboratoires/${activity.noSalle}?${params}`, activity)
            setSalle(response.data)
            setLoading( false)
            navigate("/OfficeList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    useEffect(()=>{
        !!noSalle && getSalleByNoSalle(noSalle)
    },[noSalle])

    useEffect(()=>{
        getAllSalles()
    },[salle])
    return {getSalleByNoSalle, salleList, error, loading, changeSalleStatus, createSalle, salleParNoSalle, modifierSalleByNoSalle, getSallesByDateTime}
}