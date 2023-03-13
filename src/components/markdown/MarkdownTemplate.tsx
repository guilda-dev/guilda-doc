import { Node, BlockParser, NodeTypeDefinition } from 'commonmark';
import React, { useEffect, useState } from 'react';
import { ResponseError } from '../common/common';
import { ExtendedNodeType } from './base/common';

import { compileTemplate, TemplateParams, TemplateParamsType } from './base/template';
import { filterStringChildren, ExtendedSyntaxOptions } from './common';
import { ReactRenderingOptions, render } from './node-renderer';


export type MarkdownTemplateProps = {
  template: TemplateParams,
  options?: ReactRenderingOptions, 
  definiton?: NodeTypeDefinition<ExtendedNodeType>, 
};

const MarkdownTemplate = (props: MarkdownTemplateProps) => {

  const [resource, setResource] = useState<string | Error | undefined>(undefined);
  const [md, setMd] = useState<string>('*NO TEMPLATE FILE*');
  const [ast, setAst] = useState<Node<ExtendedNodeType> | undefined>();

  const { name, args, kwargs } = props.template;
  if (name === undefined)
    return <></>;
    
  useEffect(() => {
    fetch(`/md/_template/${name}.t.md`)
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
  }, [name]);

  useEffect(() => {
    if (typeof resource === 'string')
      setMd(compileTemplate(resource, args, kwargs));
    else
      setMd(String(resource));
  }, [resource, args, kwargs]);
  
  useEffect(() => {
    const parser = new BlockParser(ExtendedSyntaxOptions);
    const ast = parser.parse(md);
    setAst(ast);
  }, [md]);
  

  return <>
    { ast && render(ast, props.options, props.definiton) }
  </>;
};

export default MarkdownTemplate;