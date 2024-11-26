import React, {useContext, useEffect, useState} from 'react'
import '../Styles/Menu.css'
import {useNavigate} from "react-router-dom";
import {Theme} from "./ThemeContext";

const Menu = ({active,setActive}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const navigate=useNavigate()
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { color, setColorTheme } = useContext(Theme);

    const toggleToolbar = () => {
        setIsOpen(!isOpen);
        setIsRotated(!isRotated);
    };
    const redirectTo=(url)=>{

        navigate(url);
    }
    const redirectToLogout = () => {
        window.location.replace(`${backendUrl}/logout`);
    };


    useEffect(() => {
        const initialBackgroundColor = getComputedStyle(document.body).backgroundColor;
        setIsChecked(initialBackgroundColor === 'rgb(46, 46, 46)'); // Проверка на темный цвет
        getUser();
        userInfo();
    }, []);
    const userInfo = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/userInfo`, {
                method: 'GET',
                credentials: 'include'
            });
            const user = await response.text();
            setUserImage(user);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getUser = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/infoAboutUser`, {
                method: 'GET',
                credentials: 'include'
            });

            const userok = await response.json();
            setUser(userok);

        } catch (error) {
            console.error('Error fetching user info', error);
        }


    };

    const redirectToDelete = async () => {
        try {
            if (window.confirm('Вы уверены, что хотите удалить свою учетную запись?')) {
                const response = await fetch(`${backendUrl}/api/user`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok)
                    window.location.replace(`${backendUrl}/logout`);
            }
        } catch (error) {
            console.error('Error deleting', error);
            alert('Error deleting.');
        }
    };
    const handleChange = (event) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        setColorTheme(!color);
        const initialBackgroundColor = document.body.style;
        color ? initialBackgroundColor.backgroundColor="lightgrey" :  initialBackgroundColor.backgroundColor="black"
        color ? initialBackgroundColor.color="black" :  initialBackgroundColor.color="white"

        const liColor = document.querySelectorAll('li');
        liColor.forEach(li => {
            li.style.color = color?"black":"white"; // Устанавливаем новый цвет
        });

    };
    return (
        <div className={`${color ? (active ? 'menu active' : 'menu') : (active ? 'menu active light' : 'menu light')}`}>

    <div className={active?'blur active':'blur'}/>
            <div className="menu-content">
                <ul>
                    {user && (
                        <>
                            <li className={'li-menu'}><img id="myImage" src={`${backendUrl}/api/images/${userImage}`} alt="Profile"/>
                            </li>
                            <li className={'li-menu'}>Name: {user.name}</li>
                            <li className={'li-menu'}>Created: {new Date(user.created).toLocaleDateString()}</li>
                            <li className={'li-menu'}>Updated: {new Date(user.updated).toLocaleDateString()}</li>
                            <li className={'li-menu'}>Role: {user.roles}</li>
                        </>
                    )}
                    <li className="delete"><a onClick={redirectToDelete}>Удалить учетную запись</a></li>
                    <li><a onClick={() => redirectTo('/update')}>Обновить мои данные</a></li>
                    <li className='exit'><a className="exit" onClick={redirectToLogout}>Выйти</a></li>
                    <li className={'li-menu'}>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="toggle"
                                className="toggle-input"
                                checked={isChecked}
                                onChange={handleChange}
                            />
                            <label htmlFor="toggle" className="toggle-label"></label>
                        </div>
                    </li>
                </ul>
            </div>


        </div>)


}
export default Menu;