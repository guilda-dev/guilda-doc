import React from 'react';

import { PropsWithChildren } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from '@/components/nav/NavBar';
import { CurrentPathProvider } from '@/components/common/CurrentPath';
import DocumentReader from './pages/DocumentReader';

import styled from 'styled-components';
import { GlobalSettingProvider } from './components/common/GlobalSetting';
import PageFooter from './components/page/PageFooter';
import { PageFrame } from './components/page/PageFrame';
import MainPage from './pages/MainPage';


const AppContext = (props: PropsWithChildren<object>) => {
  return (
    <CurrentPathProvider>
      <GlobalSettingProvider>
        {props.children}
      </GlobalSettingProvider>
    </CurrentPathProvider>
  );
};


const MainContainer = styled.div`
  width: 100vw;
  padding-top: var(--navbar-height);
  min-height: var(--page-content-min-height);
  justify-content: center;
  align-items: flex-start;

  display: flex;
  background-color: var(--color-bg1);
  color: var(--color-txt1);

  & > * {
    text-align: start;
    display: inline-block;
  }
`;


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/*',
    element: <DocumentReader />,
  }
]);

const App = () => {
  return <AppContext>
    <NavBar />
    <MainContainer>
      <PageFrame>
        <RouterProvider router={router} />
      </PageFrame>
    </MainContainer>
    <PageFooter />
  </AppContext>;
};

export default App;
