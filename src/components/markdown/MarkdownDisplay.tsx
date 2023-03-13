import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ExtendedNodeType } from './base/common';
import { ExtendedSyntaxOptions, filterStringChildren } from './common';
import { render } from './node-renderer';
import { BlockParser, Node } from 'commonmark';

export type MarkdownDisplayProps = {
  content?: string;
};

const MarkdownDisplay = (props: PropsWithChildren<MarkdownDisplayProps>) => {
  const [md, setMd] = useState<string>('*NO MARKDOWN FILE*');
  const [ast, setAst] = useState<Node<ExtendedNodeType> | undefined>();
  
  useEffect(() => {
    setMd(filterStringChildren(props.children));
  }, [props.children]);

  useEffect(() => {
    const parser = new BlockParser(ExtendedSyntaxOptions);
    const ast = parser.parse(md);
    setAst(ast);
  }, [md]);

  return (
    <div>
      { ast && render(ast, undefined, ExtendedSyntaxOptions.type) }
    </div>
  );
};

export default MarkdownDisplay;