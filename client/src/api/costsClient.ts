import { createEffect } from "effector";
import type { IBaseEffectArgs, ICreateCost, IDeleteCost, IRefreshToken, IUpdateCost } from "../types";
import api from './axiosClient';
import { removeUser } from '../utils/auth';
import { handleAxiosError } from '../utils/errors';

export const createCostFx = createEffect(async ({ url, cost, token }: ICreateCost) => {
    try {
        const { data } = await api.post(url, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'create', createCost: { cost } }); 
         return null;
    }
});

export const updateCostFx = createEffect(async ({ url, cost, token, id }: IUpdateCost) => {
    try {
        const { data } = await api.patch(`${url}/${id}`, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'update', updateCost: { cost, id } }); 
         return null;
    }
});

export const getCostsFx = createEffect(async ({ url, token }: IBaseEffectArgs) => {
    try {
        const { data } = await api.get(url, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'get' });
         return null;
    }
});

export const deleteCostFx = createEffect(async ({ url, token, id }: IDeleteCost) => {
    try {
        await api.delete(`${url}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        return id;
    } catch (error) {
        handleAxiosError(error, { type: 'delete', deleteCost: { id } });
         return null;
    }
});

export const refreshTokenFx = createEffect(async ({ url, token, username }: IRefreshToken) => {
    try {
        const result = await api.post(url, { refresh_token: token, username });

        if (result.status === 200) {
            localStorage.setItem('auth', JSON.stringify({
                ...result.data,
                username
            }));

            return result.data.access_token;
        } else {
            removeUser();
             return null;
        }
    } catch (error) {
         return null;
    }
});