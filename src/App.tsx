import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from '@/components/nav/NavBar';
import { ActiveLinkProvider } from './components/ActiveLink';

const TempApp = () => {
  const [count, setCount] = useState(0);
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
      <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
      </button>
      <p>
          Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
    <p className="read-the-docs">
        Click on the Vite and React logos to learn more
    </p>
  </div>;
};

const router = createBrowserRouter([
  {
    path: '/', 
    element: <TempApp />
  }
]);

const App = () => {

  return (
    <ActiveLinkProvider>
      <NavBar />
      <RouterProvider router={router} />
    </ActiveLinkProvider>
  );
};

export default App;
