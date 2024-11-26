// LoginPage.jsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Loginpage.css';
import {FaGithub} from "react-icons/fa";

const Loginpage = () => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const loginUrl = `${backendUrl}/perform_login`;
  const redirectTo = (url) => {
    navigate(url);
  };

    const close = () => {
       window.close();
    };

  return (
    <div className="container">
      <button className="top-left-button" onClick={() => redirectTo('/')}>
        Назад
      </button>

      <form action={loginUrl} method="post" content="application/x-www-form-urlencoded">
          <div className="naming">
              <img
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  alt="GitHub Logo"
                  className="logo"
              />
              <h1>Sign in to Base</h1>

              <input
                  className='inputLog'
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your Name"
                  required
              />

              <input
                  className='inputLog'
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
              />
              <div className="imgEntry"><a  href="https://localhost:8080/oauth2/authorization/github" target="_blank"
                                           rel="noopener noreferrer">
                  Continue with     <FaGithub/>
              </a></div>

              <button className="buttonSubmit" type="submit">
                  Login
              </button>
          </div>
      </form>

        <a className="reg_ref" onClick={() => redirectTo('/reg')}>I haven't account</a>
    </div>
  );
};

export default Loginpage;
