import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ExtendedNodeType } from './base/common';
import { ExtendedSyntaxOptions, filterStringChildren } from './common';
import { ReactRenderingOptions, render } from './node-renderer';
import { BlockParser, common, Node } from 'commonmark';

export type MarkdownDisplayProps = {
  content?: string;
};

const reWithSuffix = /\.[\w]{1,8}$/;

const options: ReactRenderingOptions = {
  esc: common.escapeXml, 
  parseLink: (raw) => {
    const suffix = reWithSuffix.test(raw) ? '' : '.md';
    // TODO temporary solution
    return '/md' + raw + suffix;
  }
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
      { ast && render(ast, options, ExtendedSyntaxOptions.type) }
    </div>
  );
};

export default MarkdownDisplay;