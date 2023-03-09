import React, { PropsWithChildren, useEffect, useState } from 'react';
import { filterStringChildren } from './common';
import * as commonmark from 'commonmark';
import { render } from './node-renderer';

export type MarkdownDisplayProps = {
  content?: string;
};

const MarkdownDisplay = (props: PropsWithChildren<MarkdownDisplayProps>) => {
  const [md, setMd] = useState<string>('*NO MARKDOWN FILE*');
  const [ast, setAst] = useState<commonmark.Node | undefined>();
  
  useEffect(() => {
    setMd(filterStringChildren(props.children));
  }, [props.children]);

  useEffect(() => {
    const parser = new commonmark.Parser({ smart: true });
    const ast = parser.parse(md);
    setAst(ast);
  });

  return (
    <div>
      { ast && render(ast) }
    </div>
  );
};

export default MarkdownDisplay;