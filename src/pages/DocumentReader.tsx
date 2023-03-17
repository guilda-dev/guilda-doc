import React from 'react';
import NavTree from '@/components/nav/NavTree';
import { useLocation } from 'react-router-dom';
import MarkdownDisplay from '@/components/markdown/MarkdownDisplay';
import { LeftSideFrame } from '@/components/page/PageFrame';
import { SiteNavTree } from '@/common/config';
import { useResourceStore } from '@/components/markdown/node/ResourceNode';


const ErrorPage = (props: { error?: Error }) => {
  const { error } = props;
  return <>
    { error?.message }
  </>;
};

const DocumentReader = () => {

  const location = useLocation();
  const [resource, error] = useResourceStore({
    link: location.pathname, 
    descriptor: { format: ['md', 'html'] },
  });

  return <>
    <LeftSideFrame>
      <NavTree rootNode={SiteNavTree} />
    </LeftSideFrame>
    { resource === undefined && <div>loading...</div> }
    { typeof resource === 'string' && <MarkdownDisplay>{ resource }</MarkdownDisplay> }
    { error instanceof Error && <ErrorPage error={error} /> }
  </>;
};

export default DocumentReader;