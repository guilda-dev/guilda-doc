import React from 'react';
import NavTree from '@/components/nav/NavTree';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MarkdownDisplay from '@/components/markdown/MarkdownDisplay';
import { LeftSideFrame } from '@/components/page/PageFrame';

const DOC_PREFIX = '/md';
const DOC_SUFFIX = '.md';

class ResponseError extends Error {

  readonly response: Response;

  constructor(response: Response) {
    super(`HTTP ERROR ${response.status}`);
    this.response = response;
  }
}

const ErrorPage = (props: { error?: Error }) => {
  const { error } = props;
  return <>
    { error?.message }
  </>;
};

const DocumentReader = () => {
  const [resource, setResource] = useState<string | Error | undefined>(undefined);
  const location = useLocation();
  const id = location.pathname;

  useEffect(() => {
    fetch(DOC_PREFIX + id + DOC_SUFFIX)
      .then(response => {
        if (!response.ok) {
          throw new ResponseError(response);
        }
        return response.text();
      })
      .then(data => {
        setResource(data);
      })
      .catch(error => {
        console.error(error);
        setResource(error);
      });
  }, [id]);
  return <>
    <LeftSideFrame>
      <NavTree />
    </LeftSideFrame>
    { resource === undefined && <div>loading...</div> }
    { typeof resource === 'string' && <MarkdownDisplay>{ resource }</MarkdownDisplay> }
    { resource instanceof Error && <ErrorPage error={resource} /> }
  </>;
};

export default DocumentReader;