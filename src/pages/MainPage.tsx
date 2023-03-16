import React, { useState } from 'react';

import NavTree from '../components/nav/NavTree';

import { useGlobalSetting } from '../components/common/GlobalSetting';
import { LeftSideFrame } from '../components/page/PageFrame';
import { SiteNavTree } from '../common/config';
import MarkdownDisplay from '@/components/markdown/MarkdownDisplay';
import { useResourceStore } from '@/components/markdown/node/ResourceNode';

const MainPage = () => {
  
  const [resource] = useResourceStore({
    link: '/index', 
    descriptor: { format: ['md', 'html'] }
  });

  return <>
    <LeftSideFrame>
      <NavTree rootNode={SiteNavTree} />
    </LeftSideFrame><div className="App">
      <MarkdownDisplay>{ resource }</MarkdownDisplay>
    </div></>;
};


export default MainPage;