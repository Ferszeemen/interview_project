import { useUnit } from 'effector-react';
import { $auth, $username } from '../../context/auth';
import { useTheme } from '../../hooks';
import { removeUser } from '../../utils/auth';
import './styles.css';

export const Header = () => {
    const { switchTheme, theme } = useTheme();
    const username = useUnit($username);
    const loggedIn = useUnit($auth);

    return (
        <header className={`header ${theme}`}>
            <div className='header__container'>
                <h1 className='header__title'>Ausgaben-Tracker</h1>

                {username.length ? (
                    <span className='header__user'>Herzlich willkommen, {username}!</span>
                ) : null}

                <div className='header__actions'>
                    <button onClick={switchTheme} className='btn btn-theme'>
                        {theme === 'dark' ? 'Hellmodus' : 'Dunkelmodus'}
                    </button>

                    {loggedIn && (
                        <button onClick={removeUser} className='btn btn-logout'>
                               Abmelden
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};