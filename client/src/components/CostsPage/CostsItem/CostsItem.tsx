import type { ICostsItemProps } from "../../../types";
import { useState, useRef } from 'react';
import { getAuthDataFromLS, handleAlertMessage } from '../../../utils/auth';
import { deleteCostFx, updateCostFx } from '../../../api/costsClient';
import { removeCost, updatedCost } from '../../../context/index';
import { Spinner } from "../../Spinner/Spinner";
import { formatDate } from '../../../utils/arrayUtils';
import './styles.css';
import { validationInputs } from "../../../utils/validation";
import { isValidDate } from "../../../utils/isValidDate";

export const CostsItem = ({ cost, index}: ICostsItemProps) => {
    const [edit, setEdit] = useState(false);
    const [deleteSpinner, setDeleteSpinner] = useState(false);
    const [editSpinner, setEditSpinner] = useState(false);
    const [newText, setNewText] = useState(cost.text);
    const [newPrice, setNewPrice] = useState<string | number>(cost.price);
    const [newDate, setNewDate] = useState(cost.date);
    const textRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);


    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => setNewText(event.target.value);
    const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => setNewPrice(event.target.value);
    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => setNewDate(event.target.value);

    const allowEditCost = () => setEdit(true);

    const cancelEditCost = () => {
        setEditSpinner(false);
        setEdit(false)
    };

    const handleEditCost = async () => {
        setEditSpinner(true);

        if (
            newText === cost.text &&
            +newPrice === +cost.price &&
            newDate === cost.date
        ) {
            setEditSpinner(false);
            setEdit(false);
            return;
        }

        if (!validationInputs(
            textRef,
            priceRef,
            dateRef
        )) {
            setEditSpinner(false);
            return;
        }

        const authData = getAuthDataFromLS();

        const editedCost = await updateCostFx({
            url: '/cost',
            token: authData.access_token,
            cost: { text: newText, price: +newPrice, date: newDate },
            id: cost._id as string
        });

        if (!editedCost) {
            setEditSpinner(false);
            setEdit(false);
            return;
        }

        setEdit(false);
        setEditSpinner(false);
        updatedCost(editedCost);
        handleAlertMessage({ alertText: 'Erfolgreich aktualisiert', alertStatus: 'success' });
    }

    const deleteCost = async () => {
        setDeleteSpinner(true);

        const authData = getAuthDataFromLS();

        await deleteCostFx({
            url: '/cost',
            token: authData.access_token,
            id: cost._id as string
        });

        setDeleteSpinner(false);
        removeCost(cost._id as string);
        handleAlertMessage({ alertText: 'Erfolgreich gelöscht!', alertStatus: 'success' })
    }

    return (
   <li className={`cost-item`} id={cost._id as string}>
    
    <div className='cost-item__left'>
        <span className='cost-item__index'>{index}</span>

        {edit ? (
            <input
                ref={textRef}
                onChange={handleChangeText}
                value={newText}
                type='text'
                className={`cost-item__input`}
                placeholder="Wofür?"
            />
        ) : (
            <span className='cost-item__text'>{cost.text}</span>
        )}

        {edit ? (
            <input
                ref={dateRef}
                onChange={handleChangeDate}
                value={isValidDate(typeof newDate === 'string' ? newDate : newDate.toISOString()) ? new Date(newDate).toISOString().split('T')[0] : ''}
                type='date'
                className="cost-item__input"
                placeholder="Datum"
            />
        ) : (
            <span className='cost-item__date'>
                {formatDate(cost.date as string)}
            </span>
        )}
    </div>

    <div className='cost-item__right'>
        {edit ? (
            <input
                ref={priceRef}
                onChange={handleChangePrice}
                value={newPrice}
                type='text'
                className="cost-item__input cost-item__price"
                placeholder="Betrag?"
            />
        ) : (
            <span className='cost-item__price'>{cost.price} €</span>
        )}

        {edit ? (
            <div className="cost-item__actions">
                <button className="btn btn-save" onClick={handleEditCost}>
                    {editSpinner ? <Spinner top={5} left={30} /> : 'OK'}
                </button>
                <button className="btn btn-cancel" onClick={cancelEditCost}>
                    ✕
                </button>
            </div>
        ) : (
            <button className="btn btn-edit" onClick={allowEditCost}>
                ✎
            </button>
        )}

        <button className="btn btn-delete" onClick={deleteCost}>
            {deleteSpinner ? <Spinner top={5} left={7} /> : '🗑'}
        </button>
    </div>
</li>
    );
}