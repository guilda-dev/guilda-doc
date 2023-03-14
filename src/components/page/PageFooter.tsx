import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGlobalSetting } from '../common/GlobalSetting';

const PageFooterBase = styled.div`
  background-color: var(--footer-background-color);
  height: var(--footer-height);
  color: var(--footer-foreground-color);
`;

const FooterContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  max-width: var(--navbar-max-width);
  align-items: left;
`;


const PageFooter = () => {
  const { darkMode } = useGlobalSetting();

  return <PageFooterBase className={darkMode ? 'dark-mode' : ''}>
    <FooterContainer>
      test footer
    </FooterContainer>
  </PageFooterBase>;
};

export default PageFooter;
