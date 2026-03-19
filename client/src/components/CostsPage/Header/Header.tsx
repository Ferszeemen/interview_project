import React, { useEffect, useRef, useState} from 'react';
import type { ICostsHeaderProps } from "../../../types/index";
import { Spinner } from "../../Spinner/Spinner";
import { countTotalPrice } from '../../../utils/arrayUtils';
import { useUnit } from 'effector-react';
import { $totalPrice } from "../../../context";
import './styles.css'
import { validationInputs } from '../../../utils/validation';
import { getAuthDataFromLS, handleAlertMessage } from '../../../utils/auth';
import { createCostFx } from '../../../api/costsClient';
import { createCost } from '../../../context/index';

export const Header = ({ costs }: ICostsHeaderProps) => {
    const [spinner, setSpinner] = useState(false);
    const textRef = useRef<HTMLInputElement>(null) ;
    const priceRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const totalPrice = useUnit($totalPrice);

    useEffect(() => {
        countTotalPrice(costs);
    }, [costs])

    const formSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        const textInputValue = textRef.current!.value;
        const priceInputValue = priceRef.current!.value;
        const dateInputValue = dateRef.current!.value; 

        if (!validationInputs(
            textRef,
            priceRef,
            dateRef
        )) {
            setSpinner(false);
            return;
        }

        const authData = getAuthDataFromLS();

        const cost = await createCostFx({
            url: '/cost',
            cost: {
                text: textInputValue,
                price: parseInt(priceInputValue),
                date: dateInputValue
            },
            token: authData.access_token
        });

        if (!cost) {
            setSpinner(false);
            return;
        }

        setSpinner(false);
        createCost(cost);
        handleAlertMessage({ alertText: 'Erfolgreich erstellt', alertStatus: 'success' });
    }

    return (
        <div className="costs-header">
            <form className="d-flex mb-3" onSubmit={formSubmit}>
                <div className="form-item">
                    <span className="mb-3">Wofür ausgegeben:</span>
                    <input ref={textRef} type="text" className="form-control" />
                </div>
                <div className="form-item">
                    <span className="mb-3">Wie viel ausgegeben:</span>
                    <input ref={priceRef} type="text" className="form-control" />
                </div>
                <div className="form-item">
                    <span className="mb-3">Wann ausgegeben:</span>
                    <input ref={dateRef} type="date" className="form-control" />
                </div>
                <button className='btn btn-primary add-btn'>
                    {spinner ? <Spinner top={5} left={20}/> : 'Hinzufügen'}
                </button>
            </form>
            <div style={{ textAlign: 'end', marginBottom: 10 }}>
                  Gesamt:
                <span> {isNaN(parseInt(String(totalPrice))) ? 0 : parseInt(String(totalPrice))}</span>
                €
            </div>
        </div>
    );
}