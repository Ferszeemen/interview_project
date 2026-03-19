import { setAuth, setUsername } from '../context/auth';
import { handleAxiosError } from '../utils/errors';
import api from './axiosClient';

export class AuthClient {
    static async login(username: string, password: string) {
        try {
            const { data, status } = await api.post('/auth/login', { username, password });

const authTokens = {
  access_token: data.access_token,
  refresh_token: data.refresh_token,
};


            if (status == 200) {
                setAuth(true);
                setUsername(data.username);
         
    localStorage.setItem('auth', JSON.stringify(authTokens));

        
                return data;
            }

            return null;
        } catch (error) {
            handleAxiosError(error, { type: 'get' });
             return null;
        }
    }

    static async registration(username: string, password: string) {
        try {
            const { data, status } = await api.post('/auth/registration', { username, password });

            if (status === 201) {
                return data;
            }

            return null;
        } catch (error) {
            handleAxiosError(error);
             return null;
        }
    }
}