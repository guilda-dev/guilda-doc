import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGlobalSetting } from '../common/GlobalSetting';

import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';

import './PageFooter.module.css';

const PageFooterBase = styled.div`
  background-color: var(--footer-background-color);
  height: var(--footer-height);
  color: var(--footer-foreground-color);

  & a {
    color: var(--footer-foreground-color);
  }

  & a:hover {
    background-color: var(--footer-foreground-color-trs);
  }
`;

const FooterContainer = styled.div`
  margin: 0 auto;
  padding: 12px 30px;
  height: 100%;
  width: 100%;
  max-width: var(--navbar-max-width);
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
`;

const ContentDiv = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-self: flex-start;
`;

const LinkDiv = styled(ContentDiv)`
  width: 100%;
  align-items: flex-end;
  & > p {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }
`;

const LogoAnchor = styled.a`
  background-color: transparent;
  display: flex;
  &:hover {
    background-color: transparent !important ;
  }
  justify-content: center;
  align-items: center;
  flex-direction: column;


  margin: 0 5px;
  padding: 0;

  & > span {
    padding: 0;
    margin: 0;
  }
`;

const LogoImg = styled.img`

  height: 32px;
  will-change: filter;
  transition: filter 300ms;

  &:hover {
    filter: drop-shadow(0 0 0.75em #646cff);
  }
  &.react:hover {
    filter: drop-shadow(0 0 0.75em #61dafb);
  }
`;

const ReactLogoImg = styled(LogoImg)`
  
@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  & {
    animation: logo-spin infinite 8s linear;
  }
}
`;


const PageFooter = () => {
  const { darkMode } = useGlobalSetting();

  return <PageFooterBase className={darkMode ? 'dark-mode' : ''}>
    <FooterContainer>
      <ContentDiv>
        <p>
          GUILDA Documentation
        </p>
        <p>
          Copyright © 2020-
          <a href="https://www.titech.ac.jp/">Tokyo Tech</a>
          ,
          <a href="https://www.ishizaki-lab.jp/">Ishizaki Lab.</a>
        </p>
      </ContentDiv>
      <LinkDiv>
        <p>
          <span>Made with </span>
          <LogoAnchor href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <LogoImg src={viteLogo} alt="Vite logo" />
            <span>Vite</span>
          </LogoAnchor>
          and
          <LogoAnchor href="https://reactjs.org" target="_blank" rel="noreferrer">
            <ReactLogoImg src={reactLogo} className="react" alt="React logo" />
            <span>React</span>
          </LogoAnchor>
        </p>
      </LinkDiv>
    </FooterContainer>
  </PageFooterBase>;
};

export default PageFooter;
