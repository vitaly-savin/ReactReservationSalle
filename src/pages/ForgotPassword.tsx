import React from 'react';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>Mot de passe oublié</div>
            <Button onClick={()=>navigate("/Autorisation")} variant="dark" type="button">Annuler</Button>
        </>
    );
}

export default ForgotPassword;