import {useEffect, useState} from "react";
import {IMembre} from "../models";
import axios, {AxiosError} from "axios";
import {useAutorisation} from "./authorisation";

export function useMembres(courriel?: string){
    const [membreList, setMembreList] = useState<IMembre[]>([]);
    const [membre, setMembre] = useState<IMembre>();
    const [membreParNom, setMemberParNom] = useState<IMembre>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {userEmail} = useAutorisation()

    async function getAllMembres() {
        try {
            setError ('')
            setLoading (true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Membres`)
            setMembreList (response. data)
            setLoading ( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading (false)
            setError (error. message)
        }
    }

    async function getMemberByNom(courriel: string) {
        try {
            setError('')
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/Membres/${courriel}`)
            setMemberParNom(response.data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const changeMembreStatus = async (courriel: string) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(encodeURI(`${import.meta.env.VITE_BASE_URL}/api/Membres/${courriel}/ModifierEtat`))
            setMembre(response. data)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    const changeMembreByEmail = async (values: any) => {
        try {
            setError('')
            setLoading(true)
            const response = await axios.put(encodeURI(`${import.meta.env.VITE_BASE_URL}/api/Membres/${values.courriel}`),values)
            setLoading( false)
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error. message)
        }
    }

    useEffect(()=>{
        getAllMembres()
    },[membre])


    useEffect(()=>{
        courriel && getMemberByNom(courriel)
    },[])

    return {membreList, error, loading, changeMembreStatus, membreParNom, changeMembreByEmail}
}