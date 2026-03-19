import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthClient } from '../../api/authClient';
import { Spinner } from '../Spinner/Spinner';
import { handleAlertMessage } from '../../utils/auth';
import './styles.css';

export const AuthPage = ({ type }: { type: 'login' | 'registration' }) => {
    const [spinner, setSpinner] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();
    const currentAuthTitle = type === 'login' ? 'Einloggen' : 'Registrieren';

    const handleAuthResponse = (
        result: boolean | undefined,
        navigatePath: string,
        alertText: string
    ) => {
        if (!result) {
            setSpinner(false);
            return;
        }

        setSpinner(false);
        navigate(navigatePath);
        handleAlertMessage({ alertText, alertStatus: 'success' });
    }

    const handleLogin = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Bitte alle Felder ausfüllen', alertStatus: 'warning' });
            return;
        }

        const result = await AuthClient.login(username, password);

        handleAuthResponse(result, '/costs', 'Erfolgreich eingeloggt');
    }


    const handleRegistration = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Bitte alle Felder ausfüllen', alertStatus: 'warning' });
            return;
        }


        if (password.length < 6) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Das Passwort muss mindestens 6 Zeichen lang sein', alertStatus: 'warning' });
            return;
        }

        const result = await AuthClient.registration(username, password);

        if (result) {
        if (passwordRef.current) passwordRef.current.value = '';
        if (usernameRef.current) usernameRef.current.value = '';
    }


        handleAuthResponse(result, '/login', 'Registrierung erfolgreich');
    }

    const handleAuth = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        switch (type) {
            case 'login':
                handleLogin(usernameRef.current!.value, passwordRef.current!.value);
                break;
            case 'registration':
                handleRegistration(usernameRef.current!.value, passwordRef.current!.value);
                break;
            default:
                break;
        }
    }

    return (
        <div className='container' style={{marginTop: "30px"}}>
            <h1>{currentAuthTitle}</h1>
            <form onSubmit={handleAuth} className='form-group'>
                <label className='auth-label'>
                Benutzername eingeben
                    <input ref={usernameRef} type="text" className='form-control' minLength={4}/>
                </label>
                <label className='auth-label'>
                 Passwort eingeben
                    <input ref={passwordRef} type="password" className='form-control' minLength={6}/>
                </label>
                <button className='btn btn-primary auth-btn'>
                    {spinner ? <Spinner top={5} left={20}/> : currentAuthTitle}
                </button>
            </form>
            {type === 'login'
            ? <div>
                <span className='question_text'>Noch kein Konto?</span>
                <Link to={'/registration'}>Registrieren</Link>
            </div>
            : <div>
                <span className='question_text'>Schon ein Konto?</span>
                <Link to={'/login'}>Einloggen</Link>
            </div>
            }
        </div>
    );
}