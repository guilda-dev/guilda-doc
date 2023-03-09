import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from '@/components/nav/NavBar';
import { ActiveLinkProvider } from '@/components/common/ActiveLink';
import MarkdownDisplay from '@/components/markdown/MarkdownDisplay';
import NavTree from './components/nav/NavTree';


const TempApp = () => {
  const [count, setCount] = useState(0);

  const [s, _s] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await fetch('md/aboutPowerSystem/0TopPage.md');
      _s(await res.text());
    })().catch(console.error);
  }, []);

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
    <MarkdownDisplay>
      { s }
    </MarkdownDisplay>
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
      <NavTree />
      <RouterProvider router={router} />
    </ActiveLinkProvider>
  );
};

export default App;
