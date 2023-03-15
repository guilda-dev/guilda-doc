import React from 'react';
import NavTree from '@/components/nav/NavTree';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MarkdownDisplay from '@/components/markdown/MarkdownDisplay';
import { LeftSideFrame } from '@/components/page/PageFrame';
import { SiteNavTree } from '@/common/config';
import { getStaticResource, ResourceMeta } from '@/common/io';
import path from 'path-browserify';
import { useGlobalSetting } from '@/components/common/GlobalSetting';

const DOC_PREFIX = '/md';


const ErrorPage = (props: { error?: Error }) => {
  const { error } = props;
  return <>
    { error?.message }
  </>;
};

const DocumentReader = () => {
  const [resource, setResource] = useState<string | Error | undefined>(undefined);
  const [, setMeta] = useState<ResourceMeta | undefined>(undefined);

  const location = useLocation();
  const id = location.pathname;
  const setting = useGlobalSetting();

  useEffect(() => {
    getStaticResource(
      path.join(DOC_PREFIX, id),
      { format: ['md', 'html'] },
      setting.language
    ).then(([data, err, meta]) => {
      if (err)
        setResource(err);
      else {
        setResource(data);
      }
      setMeta(meta);
    }).catch((err => setResource(err)));
    
  }, [id, setting.language]);
  return <>
    <LeftSideFrame>
      <NavTree rootNode={SiteNavTree} />
    </LeftSideFrame>
    { resource === undefined && <div>loading...</div> }
    { typeof resource === 'string' && <MarkdownDisplay>{ resource }</MarkdownDisplay> }
    { resource instanceof Error && <ErrorPage error={resource} /> }
  </>;
};

export default DocumentReader;