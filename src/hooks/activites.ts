import {useEffect, useState} from "react";
import {IActivite} from "../models";
import axios, {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import {useAutorisation} from "./authorisation";

export function useActivites(nomActivite?: string){
    const {isAdmin, userEmail,} = useAutorisation()
    const [activiteList, setActiviteList] = useState<IActivite[]>([]);
    const [activite, setActivite] = useState<IActivite>();
    const [status, setStatus] = useState<Boolean>(true);
    const [activiteParNom, setActiviteParNom] = useState<IActivite>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function getAllActivites() {
        try {
            setError('')
            setLoading(true)
            let response;
            if(!!isAdmin()) {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites`)
            } else {
                response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites/Actifs`)
            }
            setActiviteList(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const changeActivityStatus = async (nomActivite: string) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites/ModifierEtat/${nomActivite}`)
            setStatus(prev => !prev)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const createActivity = async (activity: IActivite) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites`, activity)
            setLoading( false)
            navigate("/ActiviteList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    async function getActiviteByNom(nomActivite: string) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites/${nomActivite}`)
            setActiviteParNom(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const modifierActivityByNom = async (activity: IActivite) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/TypeActivites/${activity.nomActivite}`, activity)
            setActivite(response.data)
            setLoading( false)
            navigate("/ActiviteList")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    useEffect(()=>{
        !!nomActivite && getActiviteByNom(nomActivite)
    },[nomActivite])

    useEffect(()=>{
        getAllActivites()
    },[activite, status])
    return {activiteList, error, loading, changeActivityStatus, createActivity, activiteParNom, modifierActivityByNom}
}