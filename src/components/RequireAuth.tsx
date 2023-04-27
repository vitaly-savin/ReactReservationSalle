import {Navigate, useNavigate} from "react-router-dom";
import React, {ReactElement, useEffect} from "react";
import {useAutorisation} from "../hooks/authorisation";
import PageNotFound from "../pages/PageNotFound";
export interface IRequireAuthProps {
    redirectTo: string,
    children: ReactElement,
    admin?: boolean
}

function hasJWT() {
    //check user has JWT token
    return !!localStorage.getItem("token");
}
function RequireAuth({ children, admin, redirectTo }: IRequireAuthProps) {
    const navigate = useNavigate();
    const {isAdmin} = useAutorisation()
    useEffect(()=>{
        if(admin && !isAdmin()) {
            navigate("/PageNotFound");
        }
    },[])
    let isAuthenticated = hasJWT();

    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default RequireAuth;