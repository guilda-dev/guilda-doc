import React, { useState } from 'react';

import NavTree from '../components/nav/NavTree';

import { useGlobalSetting } from '../components/common/GlobalSetting';
import { LeftSideFrame } from '../components/page/PageFrame';
import { SiteNavTree } from '../common/config';



const MainPage = () => {
  const [count, setCount] = useState(0);
  const { darkMode, setSetting: setStyle } = useGlobalSetting();

  return <>
    <LeftSideFrame>
      <NavTree rootNode={SiteNavTree} />
    </LeftSideFrame><div className="App">
      <h1>This is a random temporary main page</h1>
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


export default MainPage;