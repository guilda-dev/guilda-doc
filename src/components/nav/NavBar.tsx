import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGlobalSetting } from '../common/GlobalSetting';

const NavBase = styled.nav`
  background-color: var(--navbar-background-color);
  height: var(--navbar-height);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
`;

const NavContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  max-width: var(--navbar-max-width);
  align-items: left;

  & ul {
    width: min-content;
    display: inline-flex;
  }
`;

import './nav.css';




const NavBar = () => {
  const [activeLink, setActiveLink] = useState('');
  const { darkMode } = useGlobalSetting();

  const setting = useGlobalSetting();
  const links = [
    { name: 'Home', url: '/' },
    { name: 'Profile', url: '/profile' },
    { name: 'Settings', url: '/settings' },
  ];

  useEffect(() => {
    // Set active link based on URL
    const pathname = window.location.pathname;
    const link = links.find(link => link.url === pathname);
    setActiveLink(link ? link.name : '');
  }, [links]);

  return (
    <NavBase className={darkMode ? 'dark-mode' : ''}>
      <NavContainer>
        <ul>
          {links.map(link => (
            <li key={link.url} className={link.name === activeLink ? 'active' : ''}>
              <a href={link.url} onClick={() => setActiveLink(link.name)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <span>
          <button onClick={() => {
            setting.setSetting({ language: setting.language === 'en' ? 'ja' : 'en' });
          }}> {setting.language} </button>
        </span>
      </NavContainer>
    </NavBase>
  );
};

export default NavBar;