import { PropsWithChildren, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from '@/components/nav/NavBar';
import { CurrentPathProvider } from '@/components/common/CurrentPath';
import NavTree from './components/nav/NavTree';
import DocumentReader from './pages/DocumentReader';

import styled from 'styled-components';
import { GlobalSettingProvider, useGlobalSetting } from './components/common/GlobalSetting';
import PageFooter from './components/page/PageFooter';
import { LeftSideFrame, PageFrame } from './components/page/PageFrame';



const TempApp = () => {
  const [count, setCount] = useState(0);
  const { darkMode, setSetting: setStyle } = useGlobalSetting();

  return <>
    <LeftSideFrame>
      <NavTree />
    </LeftSideFrame><div className="App">
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
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
          Edit <code>src/App.tsx</code> and save to test HMR<br></br>
        </p>
      </div>
    </div></>;
};


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
  background-color: var(--color-bg1);
  color: var(--color-txt1);
  justify-content: center;
  align-items: flex-start;

  display: flex;

  & > * {
    text-align: start;
    display: inline-block;
  }
`;

const StateMaintainer = (props: PropsWithChildren<object>) => {
  const { darkMode } = useGlobalSetting();
  return <MainContainer className={(darkMode ? 'dark-mode' : '')}>
    {props.children}
  </MainContainer>;
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

const App = () => {
  const { darkMode } = useGlobalSetting();

  return <AppContext>
    <NavBar />
    <StateMaintainer>
      <PageFrame>
        <RouterProvider router={router} />
      </PageFrame>
    </StateMaintainer>
    <PageFooter />
  </AppContext>;
};

export default App;
