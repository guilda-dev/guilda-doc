import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { filterStringChildren } from './common';

const _codeSpan = styled.code`
  padding: 3px 5px;
  margin: 1px;
  border-radius: 4px;
  background-color: var(--color-bg2);
`;

const _codeBlock = styled.p`
  
`;

export type CodeSpanProps = {
  lang?: string;
}

export const CodeSpan = (props: PropsWithChildren<CodeSpanProps>) => {
  const code = filterStringChildren(props.children);
  return <_codeSpan>
    { code }
  </_codeSpan>;
};

export const CodeBlock = (props: PropsWithChildren<CodeSpanProps>) => {
  return <_codeBlock><pre>
    <CodeSpan>
      { props.children }
    </CodeSpan></pre>
  </_codeBlock>;
};