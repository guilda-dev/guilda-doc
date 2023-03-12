import { PropsWithChildren, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from '@/components/nav/NavBar';
import { ActiveLinkProvider } from '@/components/common/ActiveLink';
import NavTree from './components/nav/NavTree';
import DocumentReader from './pages/DocumentReader';

import styled from 'styled-components';
import { GlobalStyleProvider, useGlobalStyle } from './components/common/GlobalStyle';
import PageFooter from './components/nav/PageFooter';



const TempApp = () => {
  const [count, setCount] = useState(0);
  const { darkMode, setStyle } = useGlobalStyle();

  return <div className="App">
    <div>
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://reactjs.org" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Vite + React</h1>
    <div className="card">
      <button onClick={() => {
        setCount((count) => count + 1);
        setStyle({ darkMode: !darkMode });
      }}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  </div>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <TempApp />,
  },
  {
    path: '/*',
    element: <DocumentReader />,
  }
]);


const AppContext = (props: PropsWithChildren<object>) => {
  return (
    <ActiveLinkProvider>
      <GlobalStyleProvider>
        {props.children}
      </GlobalStyleProvider>
    </ActiveLinkProvider>
  );
};


const MainContainer = styled.div`
  width: 100vw;
  padding-top: var(--navbar-height);
  min-height: var(--page-content-min-height);
  background-color: var(--color-bg1);
  color: var(--color-txt1);
`;

const StateMaintainer = (props: PropsWithChildren<object>) => {
  const { darkMode } = useGlobalStyle();
  return <MainContainer className={(darkMode ? 'dark-mode' : '')}>
    { props.children }
  </MainContainer>;
};


const App = () => {
  const { darkMode } = useGlobalStyle();

  return <AppContext>
    <NavBar />
    <StateMaintainer>

      <NavTree />
      <RouterProvider router={router} />
    </StateMaintainer>
    <PageFooter />
  </AppContext>;
};

export default App;
