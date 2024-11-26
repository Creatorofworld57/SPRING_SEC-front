import React, { useState } from 'react';
import '../Styles/Menu.css';

export const Theme = React.createContext();

const ThemeContext = (props) => {
    const [color, setColor] = useState(true);

    const info = {
        color,
        setColorTheme(d) {
            setColor(d); // Устанавливаем данные
        }
    };

    console.log(color); // Для отладки

    return (
        <Theme.Provider value={info}>
            {props.children}
        </Theme.Provider>
    );
};

export default ThemeContext;