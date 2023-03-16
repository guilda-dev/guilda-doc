import React from 'react';

import { SiteConfig } from '@/common/config';
import { BlockParser, NodeTypeDefinition } from 'commonmark';
import path from 'path-browserify';
import { useEffect, useState } from 'react';
import { ExtendedNodeType, ExtendedSyntaxOptions } from '../base/common';

import { compileTemplate, TemplateParams } from '../base/template';
import { ReactRenderingOptions, render } from '../node-renderer';

import { useResourceStore } from './ResourceNode';
import { delay } from '@/base/common';


export type MarkdownTemplateProps = {
  template: TemplateParams,
  options?: ReactRenderingOptions,
  definition?: NodeTypeDefinition<ExtendedNodeType>,
};

const MarkdownTemplate = (props: MarkdownTemplateProps) => {

  const { name, args, kwargs } = props.template;
  const [link, setLink] = useState<string>(path.join(SiteConfig.template.root, name));
  useEffect(() => {
    setLink(path.join(SiteConfig.template.root, name));
  }, [name]);

  const [resource, , meta] = useResourceStore({
    link: link, 
    descriptor: { type: SiteConfig.template.fileSuffix, format: ['md', 'html'], },
  });

  const [rnd, setRnd] = useState<JSX.Element | undefined>();

  useEffect(() => {
    const template = resource !== undefined ? 
      compileTemplate(resource, args, kwargs) : 
      '';

    if (meta?.format === 'md') {
      const parser = new BlockParser(ExtendedSyntaxOptions);
      const ast = parser.parse(template);
      setRnd(
        ast !== undefined ?
          render(ast, props.options, props.definition) :
          undefined
      );
    } else {
      setRnd(<>{ template }</>);
    }
  }, [resource, meta, args, kwargs]);

  useEffect(() => {
    delay(10).then(() => {
      const element = document.querySelector(location.hash || '#null');
      element?.scrollIntoView({ block: 'start' });
    }).catch(console.error);
  }, [rnd]);

  return <>
    {rnd}
  </>;
};

export default MarkdownTemplate;