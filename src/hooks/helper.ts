import {string} from "yup";

export function useHelper() {
    function formatDate(dateFromBD: string, heure: boolean = true){
        let date: string = dateFromBD.slice(0,10);
        let time: string = dateFromBD.slice(11,16);
        return heure ? (date + " " + time) : date
    }
    return{formatDate}
}
