import { SiteConfig } from '@/common/config';
import { getStaticResource, ResourceMeta } from '@/common/io';
import { BlockParser, NodeTypeDefinition } from 'commonmark';
import path from 'path-browserify';
import React, { useEffect, useState } from 'react';
import { ExtendedNodeType } from './base/common';

import { compileTemplate, TemplateParams } from './base/template';
import { delay, ExtendedSyntaxOptions } from './common';
import { ReactRenderingOptions, render } from './node-renderer';

import parse from 'html-react-parser';
import { useGlobalSetting } from '../common/GlobalSetting';


export type MarkdownTemplateProps = {
  template: TemplateParams,
  options?: ReactRenderingOptions,
  definiton?: NodeTypeDefinition<ExtendedNodeType>,
};

const MarkdownTemplate = (props: MarkdownTemplateProps) => {

  const [resource, setResource] = useState<string | Error | undefined>(undefined);
  const [meta, setMeta] = useState<ResourceMeta | undefined>(undefined);

  const [md, setMd] = useState<string>('*NO TEMPLATE FILE*');
  // const [ast, setAst] = useState<Node<ExtendedNodeType> | undefined>();
  const [rnd, setRnd] = useState<JSX.Element | undefined>();

  const { name, args, kwargs } = props.template;
  const setting = useGlobalSetting();
  if (name === undefined)
    return <></>;

  useEffect(() => {
    getStaticResource(
      path.join('/md', SiteConfig.template.root, name), 
      { type: SiteConfig.template.fileSuffix, format: ['md', 'html'], },
      setting.language,
    ).then(([data, err, meta]) => {
      if (err)
        setResource(err);
      else {
        setResource(data);
      }
      setMeta(meta);
    }).catch((err => setResource(err)));

  }, [name, setting.language]);

  useEffect(() => {
    if (typeof resource === 'string')
      setMd(compileTemplate(resource, args, kwargs));
    else
      setMd(String(resource));
  }, [resource, args, kwargs]);

  useEffect(() => {
    const parser = new BlockParser(ExtendedSyntaxOptions);
    if (meta?.format === 'md') {
      const ast = parser.parse(md);
      setRnd(
        ast !== undefined ?
          render(ast, props.options, props.definiton) :
          undefined
      );
    } else {
      setRnd(<>{ parse(md) }</>);
    }
  }, [md, meta]);

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