import React from 'react';
import {ISalle} from "../models";
import {useLocation} from "react-router-dom";

const Error = () => {
    const location = useLocation();
    return <div>{location.state.error}</div>;
}

export default Error;