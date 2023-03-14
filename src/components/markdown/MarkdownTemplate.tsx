import { BlockParser, NodeTypeDefinition } from 'commonmark';
import React, { useEffect, useState } from 'react';
import { ResponseError } from '../../base/common';
import { ExtendedNodeType } from './base/common';

import { compileTemplate, TemplateParams } from './base/template';
import { delay, ExtendedSyntaxOptions } from './common';
import { ReactRenderingOptions, render } from './node-renderer';



export type MarkdownTemplateProps = {
  template: TemplateParams,
  options?: ReactRenderingOptions,
  definiton?: NodeTypeDefinition<ExtendedNodeType>,
};

const MarkdownTemplate = (props: MarkdownTemplateProps) => {

  const [resource, setResource] = useState<string | Error | undefined>(undefined);
  const [md, setMd] = useState<string>('*NO TEMPLATE FILE*');
  // const [ast, setAst] = useState<Node<ExtendedNodeType> | undefined>();
  const [rnd, setRnd] = useState<JSX.Element | undefined>();

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

    setRnd(
      ast !== undefined ?
        render(ast, props.options, props.definiton) :
        undefined
    );
  }, [md]);

  useEffect(() => {
    delay(10).then(() => {
      const element = document.querySelector(location.hash || '#null');
      element?.scrollIntoView({ block: 'start' });
    }).catch(console.error);
  }, [rnd, resource, md]);

  return <>
    {rnd}
  </>;
};

export default MarkdownTemplate;