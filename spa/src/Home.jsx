import './Styles/Home.css';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const stairTextContainerStyles = {
        textAlign: 'right', // Выровнять текст по правому краю
        lineHeight: 1.5,
        marginRight: '10px',  // Отступ от правого края
    };

    const musicTextStyles = {
        fontSize: '48px',
        fontWeight: 'bold',
        textShadow: '0 0 5px rgba(0, 255, 0, 0.4), 0 0 10px rgba(0, 255, 0, 0.4)',
        background: 'linear-gradient(90deg, #00aa00, #002200, #00aa00)', // Тусклый зелено-черный градиент
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };
    const redirectTo = (url) => {
        navigate(url);
    };
    return (
        <div>
            <img className="imgBack" src="http://localhost:8080/api/background/1" alt="background"/>
            <div className="text-wrapper" style={stairTextContainerStyles}>
                <div style={{...musicTextStyles, marginRight: '0px'}}>Окунись</div>
                <div style={{...musicTextStyles, marginRight: '40px'}}>в мир</div>
                <div style={{...musicTextStyles, marginLeft: '80px'}}>музыки</div>
                <div style={{...musicTextStyles, marginLeft: '120px'}}>прямо сейчас</div>
            </div>
            y>
            <div className="step-text">
                <p>First step of the ladder</p>
                <p>Second step of the ladder</p>
                <p>Third step of the ladder</p>
                <p>Fourth step of the ladder</p>
            </div>
            <button className="submit-button__button submit" onClick={() => redirectTo('/login')}>Войти или зарегистрироваться</button>
        </div>
    );
};

export default Home;
