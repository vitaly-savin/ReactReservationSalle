import {useState} from "react";
import {IAutorisation} from "../models";
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {string} from "yup";

export function useAutorisation(){
    const [error, setError] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const setAuthToken = (token: string) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    function parseJwt(token: string | null) {
        if(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }
        return null;
    }
    function getInfoFromToken() {
        if (localStorage.getItem("token") === null) {
            return null;
        }
        return parseJwt(localStorage.getItem('token'))
    }

    function userEmail() {
        const parsedToken = getInfoFromToken();
        if(parsedToken) {
            const emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
            return parsedToken[emailKey];
        }
        return "";
    }

    function userName() {
        const parsedToken = getInfoFromToken();
        if(parsedToken) {
            const nameKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
            const givenNameKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
            return parsedToken[givenNameKey] + " " + parsedToken[nameKey];
        }
        return "";
    }


    function isMember() {
        const parsedToken = getInfoFromToken();
        if(parsedToken) {
            const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            return parsedToken[roleKey] === "Membre";
        }
        return false;
    }
    function isAdmin() {
        const parsedToken = getInfoFromToken();
        if(parsedToken) {
            const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            return parsedToken[roleKey] === "Admin";
        }
        return false;
    }
    async function login(user:IAutorisation) {
        try {
            setError ('')
            setLoading (true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Account/login`, user)
            const token = response.data
            localStorage.setItem("token", token)
            setAuthToken(token)
            setLoading ( false)
            navigate("/")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error)
            axios.defaults.headers.common['Authorization'] = null
            localStorage.removeItem("token")
        }
    }

    async function signup(user:any) {
        try {
            setError ('')
            setLoading (true)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Account/EnregistrementMembre`, user)
            if(!response.data){
             return false;
            }
            setLoading ( false)
            navigate("/")
        } catch (e: unknown) {
            const error = e as AxiosError
            setLoading(false)
            setError(error.message)
            axios.defaults.headers.common['Authorization'] = null
            localStorage.removeItem("token")
        }
    }

    function logout() {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem("token");
        navigate("/Autorisation")
    }

    return {isAdmin, isMember, userEmail, userName, login, signup, error, loading, logout}
}