import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './Styles/Audio.css';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { MyContext } from "./HelperModuls/ContextForAudio";
import { Howl, Howler } from 'howler';
import {SiTruenas} from "react-icons/si";
import {Theme} from "./HelperModuls/ThemeContext"; // Импортируем Howler

const AudioPlayer = () => {
    const [userTrack, setUserTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refka, setRefka] = useState();
    const [name, setName] = useState('Track');
    const [currTime, setCurrTime] = useState({ min: '0', sec: '0' });
    const [totalTime, setTotalTime] = useState({ min: '0', sec: '0' });
    const [seconds, setSeconds] = useState(0);
    const [volume, setVolume] = useState(0.2);
    const [tracks, setTracks] = useState([]);
    const animationRef = useRef();
    const progressBarRef = useRef();
    const progressBarBackendRef = useRef();
    const [isActive, setIsActive] = useState(false);
    const [sound, setSound] = useState(null); // Состояние для хранения экземпляра Howl
    const [playOrNo, setPlayOrNo] = useState(null);
    const [duration, setDuration] = useState(0);
    const [author,setAuthor]=useState(null)
    const [isCounterInitialized, setIsCounterInitialized] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const { data, setDat } = useContext(MyContext);
    const { color, setColorTheme } = useContext(Theme);

    const firstCall = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/lastTrack`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const resp = parseInt(await response.text(), 10);
                setUserTrack(resp)
                console.log('2')
            }
        } catch (error) {
            console.error('Error fetching last track:', error);
            setUserTrack(152);
        }

    };

    useEffect(() => {
        firstCall();
        console.log('1')
    }, []);

    const [counter, setCounter] = useState();

    useEffect(() => {
        if (userTrack !== null) {
            setCounter(userTrack);
            setIsCounterInitialized(true)
        }
        console.log('3')
    }, [userTrack]);


    const loadTrack = async newCounter => {
        setIsLoading(true);
        if (sound) {
            sound.unload(); // Разгружаем предыдущий трек перед загрузкой нового
        }
        console.log(counter)
        console.log('4')
        const responseFor = await fetch(`${backendUrl}/api/audio/${counter}`, {
            credentials: 'include' // Включаем куки
        });
        const blob = await responseFor.blob();
        const objectUrl = URL.createObjectURL(blob);

        const newSound = new Howl({
            src: [objectUrl],
            volume: volume,
            format: ['mp3'],
            onend: forward, // Следующий трек при завершении
            onload: () => {
                setDuration(newSound.duration());
                setTotalTime(formatTime(newSound.duration()));
                setIsLoading(false);
            },
            onplay: () => {
                setIsPlaying(true);
                animationRef.current = requestAnimationFrame(updateProgress);
            },
            onpause: () => setIsPlaying(false),


        });
        const response = await fetch(`${backendUrl}/api/audioName/${counter}`,{ credentials: 'include'});
        const trackName = await response.json();
        await setName(trackName.name);
        document.title = trackName.author.replace(/\//g, ', ') +' - '+ trackName.name;
        await setAuthor(trackName.author.replace(/\//g, ', '));
        await setSound(newSound);
        console.log(sound)

    };
    useEffect(() => {
        // Если counter не null и был инициализирован ранее
        if (counter !== null && isCounterInitialized) {
            loadTrack();
            keepTrack();
            likeOrNo();
            setIsActive(true);
        }
        // Устанавливаем флаг, когда counter получает значение впервые
        if (counter !== null && !isCounterInitialized) {
            setIsCounterInitialized(true);
        }
    }, [counter]);

    // Форматирование времени
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return {
            min: minutes,
            sec: seconds < 10 ? `0${seconds}` : seconds
        };
    };



        // Изменение громкости
    const handleVolumeChange = (e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (sound) {
                sound.volume(newVolume);
            }
    };

    const fetchImg = async () => {
        if (name) {
            try {
                const response = await fetch(`${backendUrl}/api/audio/image/${name}`,{ credentials: 'include'});
                if (response.ok) {
                    const buf = await response.json();
                    const buf2 = buf.image;
                    if (buf2) {
                        setRefka(`data:image/jpeg;base64,${buf2}`);
                    } else {
                        console.error('Image data not found in response');
                    }
                } else {
                    console.error('Failed to fetch image:', response.status);
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
    };

    useEffect(() => {
        fetchImg();
    }, [name]);

    const keepTrack = () => {
        fetch(`${backendUrl}/api/lastTrack?id=${counter}`, { method: 'POST', credentials: 'include' });
    };



    useEffect(() => {
        if (data != null) {
            setCounter(data);
            setIsPlaying(false);
        }

    }, [data]);

    const likeOrNo = async () => {
        const response = await fetch(`${backendUrl}/api/likeOrNo?track=${counter}`, { method: 'GET', credentials: 'include' });
        if (response.ok) {
            const isLiked = await response.json();
            setIsActive(isLiked);
        } else {
            console.error('Ошибка запроса:', response.status);
        }
    };

    // Функция для обновления прогресса
    const updateProgress = () => {
        if (sound && isPlaying) {
            const sec = sound.seek();
            setSeconds(sec);
            const min = Math.floor(sec / 60);
            const secRemain = Math.floor(sec % 60);
            setCurrTime({ min, sec: secRemain });

            if (progressBarRef.current) {
                const progressPercentage = (sec / (sound.duration())) * 100;
                progressBarRef.current.style.width = `${progressPercentage}%`;
            }

            animationRef.current = requestAnimationFrame(updateProgress);
        }
    };

    useEffect(() => {

            animationRef.current = requestAnimationFrame(updateProgress);

    }, [isPlaying]);
    useEffect(() => {
        if (!isLoading) {
            sound.play()

        }


    }, [isLoading]);

    // Обработка нажатия на кнопку воспроизведения/паузы
    const playingButton = () => {
        if (!isPlaying) {
            sound.play();
        } else {

            sound.pause();

        }

    };
    const reverse = useCallback(async () => {
        // Если tracks пустой (null) или пустой массив
        if (tracks === null || tracks.length === 0) {
            console.log("No tracks available.");
            return; // Если треков нет, выходим из функции
        }

        console.log(`Reversing from track ID: ${counter}`);

        // Если трек воспроизводился, останавливаем его
        if (isPlaying) {
            sound.stop();
            setIsPlaying(false);
        }

        // Найдем текущий индекс трека по ID (counter)
        const currentTrackIndex = tracks.findIndex(value => value === counter);

        // Переход к предыдущему треку, если это не первый трек
        if (currentTrackIndex > 0) {
            const newCounter = tracks[currentTrackIndex - 1]; // Переход к предыдущему ID трека
            setCounter(newCounter); // Устанавливаем новый ID трека
            await loadTrack(newCounter); // Загружаем трек
        } else {
            // Если текущий трек первый, делаем новый запрос для получения предыдущих треков
            const response = await fetch(`${backendUrl}/api/nextAudios?id=${counter}&direction=reverse`); // Здесь предполагается, что сервер может предоставить предыдущие треки
            const newTracks = await response.json();

            setTracks(newTracks); // Обновляем массив треков
            if (newTracks.length > 0) {
                setCounter(newTracks[newTracks.length - 1]); // Устанавливаем последний трек из нового списка как текущий
                await loadTrack(newTracks[newTracks.length - 1]); // Загружаем последний трек из нового списка
            }
        }
    }, [counter, tracks, isPlaying]);

    const forward = useCallback(async () => {
        if ((tracks === null || tracks.length === 0) && sound !==null) {
            setIsPlaying(false)
            const response = await fetch(`${backendUrl}/api/nextAudios?id=${counter}&direction=forward`,{credentials:'include'});
            const newTracks = await response.json();
            setTracks(newTracks);
            if (newTracks.length > 0) {
                setCounter(newTracks[0]);

            }
        } else if(sound !==null) {
            sound.stop();
            const currentTrackIndex = tracks.findIndex(value => value === counter);
            if (currentTrackIndex !== -1 && currentTrackIndex < tracks.length - 1) {
                setCounter(tracks[currentTrackIndex + 1]);

            } else {
                const response = await fetch(`${backendUrl}/api/nextAudios?id=${counter}&direction=forward`,{credentials:'include'});
                const newTracks = await response.json();
                setTracks(newTracks);
                if (newTracks.length > 0) {
                    setCounter(newTracks[0]);

                }
            }
        }
    }, [counter, tracks, sound, isPlaying]);
    useEffect(() => {
        if (!isLoading && userTrack !== counter) {
            sound.pause()
            sound.play()
            setIsPlaying(true)
        }
    }, [isLoading]);
    const handleProgressClick = (e) => {
        if (progressBarBackendRef.current) {
            const durationInSeconds = sound.duration();
            if (durationInSeconds > 0) {
                const { left, width } = progressBarBackendRef.current.getBoundingClientRect();
                const clickX = e.clientX - left;
                const newTime = (clickX / width) * durationInSeconds;


                    sound.seek(newTime);
                    const actualTime = sound.seek();
                    setSeconds(actualTime);

                    const min = Math.floor(actualTime / 60);
                    const secRemain = Math.floor(actualTime % 60);
                    setCurrTime({ min, sec: secRemain });

                    if (progressBarRef.current) {
                        const progressPercentage = (actualTime / durationInSeconds) * 100;
                        progressBarRef.current.style.width = `${progressPercentage}%`;
                    }

            }
        }
    };

    // Handle volume change

    const toggleHeart = async() => {
        setIsActive(!isActive);
        if(isActive===false) {
            console.log("stop")
            await fetch(`${backendUrl}/api/likedTrack?track=${counter}`, {method: 'POST',credentials:'include'})
            console.log("ready")
        }
        else
        {
            await fetch(`${backendUrl}/api/likedTrackDelete?track=${counter}`, {method: 'DELETE',credentials:'include'})
        }
    };

    return (
        <div id="audioPlayer" className={color ? "component" : "component light"}>

            <div className={'container-attributes'}>{!isLoading ? (
                <img className="musicCover" src={refka} alt="Изображение"/>
            ) : (
                <div className="skeleton-image"></div>
            )}
                <div className={`scattering ${isActive ? 'active' : ''}`} onClick={toggleHeart}>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {!isLoading ? (
                        <>
                            <div className={'audioContainer'}>
                                <h3 className={color ? "titl" : "titl light"}>{name}</h3>
                                <h2 className={color ? "authorName" : "authorName light"}>{author}</h2>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="skeleton-title"/>
                            <div className="skeleton-title"/>
                        </>
                    )}
                </div>
            </div>

            <div className="time">
                <p>{currTime.min}:{currTime.sec < 10 ? "0" + currTime.sec : currTime.sec}</p>
            </div>
            <p className="timeTotal">{totalTime.min}:{totalTime.sec}</p>

            <div
                className="progress-bar-backend"
                ref={progressBarBackendRef}
                onClick={handleProgressClick}
            >
                <div className="progress-bar" ref={progressBarRef}></div>
            </div>

            {/* Volume Control */}
            <div className={color ? "volume-control" : "volume-control light"}>
                <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>


            <div>
                <button className={color ? "playButton" : "playButton light"} onClick={reverse}>
                    <IconContext.Provider value={{size: "3em", color: "#27AE60"}}>
                        <BiSkipPrevious/>
                    </IconContext.Provider>
                </button>

                {!isPlaying ? (
                    <button className={color ? "playButton" : "playButton light"} onClick={playingButton}>
                        <IconContext.Provider value={{size: "3em", color: "#27AE60"}}>
                            <AiFillPlayCircle/>
                        </IconContext.Provider>
                    </button>
                ) : (
                    <button className={color ? "playButton" : "playButton light"} onClick={playingButton}>
                        <IconContext.Provider value={{size: "3em", color: "#27AE60"}}>
                            <AiFillPauseCircle/>
                        </IconContext.Provider>
                    </button>
                )}

                <button className={color ? "playButton" : "playButton light"} onClick={forward}>
                    <IconContext.Provider value={{size: "3em", color: "#27AE60"}}>
                        <BiSkipNext/>
                    </IconContext.Provider>
                </button>
            </div>
        </div>


    );
};

export default AudioPlayer;
