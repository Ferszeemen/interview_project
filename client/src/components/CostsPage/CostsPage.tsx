import { useEffect, useState, useRef} from 'react';
import { Spinner } from "../Spinner/Spinner";
import { Header } from "./Header/Header"
import { getAuthDataFromLS } from '../../utils/auth';
import { getCostsFx } from "../../api/costsClient";
import { $costs, setCosts } from '../../context/index';
import { useUnit } from "effector-react";
import { CostsList } from './CostsList/CostsList';
import "./styles.css"

export const CostsPage = () => {
    const [spinner, setSpinner] = useState(false);
    const store = useUnit($costs) ?? [];
    const shouldLoadCosts = useRef(true);

    useEffect(() => {
        if (shouldLoadCosts.current) {
            shouldLoadCosts.current = false;
            handleGetCosts();
        }
    }, [])

    const handleGetCosts = async () => {
        setSpinner(true);
        const authData = getAuthDataFromLS();        
        const costs = await getCostsFx({
            url: 'cost',
            token: authData.access_token
        });

        setSpinner(false);
        setCosts(costs);
    }

    return (
       <div className="page">
    <h2 className="page__title">Meine Ausgabenübersicht</h2>

    <Header costs={store} />

    <div className="page__content">
        {spinner && <Spinner top={0} left={0} />}

        {store.length ? (
            <CostsList costs={store} />
        ) : (
            !spinner && <h2 className="empty">Die Ausgabenliste ist leer</h2>
        )}
    </div>
</div>
    )
}