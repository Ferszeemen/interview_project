import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        const saved = localStorage.getItem('theme');
        return (saved ? JSON.parse(saved) : 'dark') as 'dark' | 'light';
    });

    const darkTheme = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/bootstrap-dark.min.css';
    const lightTheme = 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css';

    const setCurrentMode = (mode: 'dark' | 'light') => {
        const link = document.getElementById('theme-link') as HTMLLinkElement | null;
        if (link) {
            link.href = mode === 'dark' ? darkTheme : lightTheme;
        }
    };

    const switchTheme = () => {
        const newMode = theme === 'dark' ? 'light' : 'dark';
        setTheme(newMode);
        localStorage.setItem('theme', JSON.stringify(newMode));
    };

    useEffect(() => {
        setCurrentMode(theme);
    }, [theme]);

    return { theme, switchTheme };
};