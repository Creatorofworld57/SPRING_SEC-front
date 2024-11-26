import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Styles/Welcome.css';

import SlidingMenu from "./HelperModuls/SlidingMenu";
import {IconContext} from "react-icons";
import {AiFillPlayCircle} from "react-icons/ai";
import {MyContext} from "./HelperModuls/ContextForAudio";


const Welcome = () => {
    const navigate = useNavigate();
    const [isButtonVisible, setButtonVisible] = useState(true);
    const [inputValue, setInputValue] = useState('');  // Значение из поля ввода
    const [track, setTrack] = useState([]);
    const {data, setDat} = useContext(MyContext);
    const {isPlaying, setIsPlaying} = useState(false)

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Функция для поиска треков по названию
    const searchTracks = async (query) => {
        try {
            const response = await fetch(`${backendUrl}/api/searchOfTrack/${query}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setTrack(null)
                setTrack(data);  // Устанавливаем найденные треки в состояние
            } else {
                setTrack([]);  // Если ничего не найдено, очищаем список
            }
        } catch (error) {
            console.error('Error fetching track info', error);
        }
    };

    // Отправка запроса на сервер при изменении inputValue
    useEffect(() => {
        if (inputValue) {
            searchTracks(inputValue);  // Вызываем функцию поиска, если есть текст в поле
        } else {
            setTrack([]);  // Если поле ввода пустое, очищаем список треков
        }
    }, [inputValue]);

    useEffect(() => {
        loginButton();
    }, []);

    const loginButton = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/authorization`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.status === 200) {
                setButtonVisible(false);
            } else {
                setButtonVisible(true);
            }
            console.log(isButtonVisible)
        } catch (error) {
            console.error('Failed to fetch authorization:', error);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const redirectToLogin = () => {
        navigate('/login');
    };


    const redirectToProfile = () => {
        navigate('/profile');
    };

    const redirectToAudioList = () => {
        navigate('/audio_playlist');
    };
    const random_audio = async () => {
        const responseForId = await fetch(`${backendUrl}/api/random_audio`, {
            method: 'GET',
            credentials: 'include'
        })
        const id = parseInt(await responseForId.json(), 10)
        if (responseForId.ok) {
            setDat(id)
        }

    }


    return (
        <div>
            <button
                className={isButtonVisible ? "top" : "top active"}

                onClick={redirectToLogin}
            >
                Sign in or sign up
            </button>
            <div className="formContainer">
                <h1>
                    Enter name of track
                </h1>
                <input
                    className={"inputForTracks"}
                    type="text"
                    id="userId"
                    autoComplete="off"
                    placeholder="Enter name"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>
            <div className="audio-animation__fallback">
                <video muted loop autoPlay playsInline>
                    <source src="https://music.yandex.ru/blocks/audio-animation/i/mv-black.mp4" type="video/mp4"/>
                    Ваш браузер не поддерживает видео.
                </video>
                <div className="audio-animation__fallback-fade">
                    <div className="audio-animation__fallback-fade-left"></div>
                    <div className="audio-animation__fallback-fade-right"></div>
                </div>
            </div>
            <div className="rup__content-button">
                <button className="playButtonWelcome" onClick={() => random_audio()}>
                    <IconContext.Provider value={{size: "3em", color: "white"}}>
                        <AiFillPlayCircle/>
                    </IconContext.Provider>
                </button>

                <p className="rup__content-button-caption">Моя волна</p></div>


            {/* Вставляем SlidingMenu и передаем туда список треков */}
            <SlidingMenu tracks={track} val={inputValue}/>

            <button className="top-left-button5" onClick={redirectToProfile}>
                Профиль
            </button>
            <button className="top-left-button3" onClick={redirectToAudioList}>
                Музон
            </button>
        </div>
    );
};

export default Welcome;
