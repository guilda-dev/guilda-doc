import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { filterStringChildren } from './common';

const _codeSpan = styled.code`
  
`;

const _codeBlock = styled.div`
  
`;

export type CodeSpanProps = {
  lang?: string;
}

export const CodeSpan = (props: PropsWithChildren<CodeSpanProps>) => {
  const code = filterStringChildren(props.children);
  return <pre><_codeSpan>
    { code }
  </_codeSpan></pre>;
};

export const CodeBlock = (props: PropsWithChildren<CodeSpanProps>) => {
  return <_codeBlock>
    <CodeSpan>
      { props.children }
    </CodeSpan>
  </_codeBlock>;
};