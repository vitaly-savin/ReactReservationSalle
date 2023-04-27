import {Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ITime} from "../models";

export interface ITimePickerProps {
    title: string,
    reset: boolean
    onTimeSelect(time: string): void;
}

function TimePicker({reset, title, onTimeSelect}: ITimePickerProps) {
    const [availableTimes, setAvailableTimes] = useState<ITime[]>([]);
    const [timeTitle, setTimeTitle] = useState<string>(title ?? "");

    useEffect(() => {
        setTimeTitle('Heure')
    },[reset])

    useEffect(() => {
        const timeArray =[];
        for (let i = 8; i <= 21; i++) {
            const zero = i < 10 ? "0" : "";
            timeArray.push({date: zero + i + ':00', disabled: false});
        }
        setAvailableTimes(timeArray);
    },[]);

    function handleTimeSelect(selectedTime: string){
        setTimeTitle(selectedTime);
        onTimeSelect(selectedTime);
    }
    return(
        <Dropdown onSelect={(key: any) => handleTimeSelect(key)}>
            <Dropdown.Toggle className={"w-100"} name={'reservationTime'} variant="secondary" id="reservationTime">
                {timeTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {availableTimes && availableTimes.map((time, index) =>
                    <Dropdown.Item disabled={time.disabled} key={index} eventKey={time.date} >{time.date}</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
        )
}
TimePicker.defaultProps = {
    title: 'Heure',
};
export default TimePicker;
