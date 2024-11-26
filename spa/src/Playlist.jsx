import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "./HelperModuls/ContextForAudio";
import { useNavigate } from "react-router-dom";
import './Styles/Playlist.css';
import {Theme} from "./HelperModuls/ThemeContext";

const Playlist = ({ name }) => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTracks, setActiveTracks] = useState({}); // Объект активности треков
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { color, setColorTheme } = useContext(Theme);
    const redirectTo = (url) => {
        navigate(url);
    };

    const responseForTracks = async () => {
        setIsLoading(true);
        const response = await fetch(`${backendUrl}/api/likedPlaylist/names`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        setTracks(data);

        // Устанавливаем начальное состояние активности "активно" для всех треков
        const initialActiveTracks = data.reduce((acc, track) => {
            acc[track.id] = true; // Начальное состояние "активно" (true)
            return acc;
        }, {});
        setActiveTracks(initialActiveTracks);

        setIsLoading(false);
    };

    const { data, setDat } = useContext(MyContext);

    const handleClick = (id) => {
        setDat(id);
    };

    useEffect(() => {
        responseForTracks();
    }, []);

    const toggleHeart = async (id) => {
        const isActive = activeTracks[id];
        const updatedActiveTracks = { ...activeTracks, [id]: !isActive };

        setActiveTracks(updatedActiveTracks);

        if (!isActive) {
            await fetch(`${backendUrl}/api/likedTrack?track=${id}`, {
                method: 'POST',
                credentials: 'include'
            });
        } else {
            await fetch(`${backendUrl}/api/likedTrackDelete?track=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        }
    };

    return (
        <div>
            <div className={'tittlePlaylist'}>Мои любимые треки</div>
        <div className={color ?"menu-items":"menu-items light"}>
            <ul>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className="skeleton-track-item">
                            <div className="skeleton-image1"></div>
                            <div className="skeleton-text1"></div>
                        </li>
                    ))
                ) : tracks && tracks.length > 0 ? (
                    tracks.slice().reverse().map((audio, index) => (
                        <li key={index} className="item">
                            <img className="track-image-playlist" onClick={() => handleClick(audio.id)}
                                 src={`${backendUrl}/api/likedPlaylist/images/${audio.id}`} alt="Track"/>
                            <div className="playlist-container">
                                <div className={color?"name-playlist":"name-playlist light"} onClick={() => handleClick(audio.id)} >{audio.name}</div>
                                <div className={color?"author-playlist":"author-playlist light"}>{audio.author.replace(/\//g, ', ')}</div>
                            </div>
                            <div
                                className={`scatteringPlaylist ${activeTracks[audio.id] ? 'active' : ''}`}
                                onClick={() => toggleHeart(audio.id)}
                            ></div>
                        </li>
                    ))
                ) : (
                    <li>Треки не найдены</li>
                )}
            </ul>
            <button className="back_up" onClick={() => redirectTo('/profile')}></button>
        </div>
        </div>
    );
};

export default Playlist;
