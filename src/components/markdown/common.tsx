import { Node, BlockParsingOptions, compileMaybeSpecialRegExp, HtmlRenderingOptions } from 'commonmark';
import React, { PropsWithChildren } from 'react';
import { ExtendedNodeType, ExtendedNodeDefinition } from './base/common';
import { MathHandler, MathTrigger, parseInlineMathFence } from './base/math';
import { TableHandler, TableHeadHandler, TableRowHandler, TableCellHandler, TableTrigger } from './base/table';
import { parseInlineTemplate } from './base/template';


export const ExtendedSyntaxOptions: BlockParsingOptions<ExtendedNodeType> = {
  type: ExtendedNodeDefinition,
  blockHandlers: {
    table: TableHandler,
    table_head: TableHeadHandler,
    table_row: TableRowHandler,
    table_cell: TableCellHandler,
  
    math_block: MathHandler,
  },
  blockStartHandlers: {
    [-1]: [TableTrigger],
    [2]: [MathTrigger],
  },
  reMaybeSpecial: compileMaybeSpecialRegExp('$', '|', true),
  // reNonSpecialChars: compileNonSpecialCharRegExp('$', true),
  inlineHandlers: [
    ['$', parseInlineMathFence], 
    ['@', parseInlineTemplate],
  ]
};

export const renderingOptions: HtmlRenderingOptions<ExtendedNodeType> = {
  type: ExtendedNodeDefinition,
};


export const filterStringChildren = (children: React.ReactNode | React.ReactNode[]) => {
  return React.Children.toArray(children)
    .filter(x => typeof x === 'string')
    .join('');
};

export const deepFilterStringChildren = (node: JSX.Element): string => {
  if (typeof node !== 'object') {
    return node == undefined ? '' : String(node);
  }
  if (!node.props?.children) {
    return '';
  }
  if (Array.isArray(node.props?.children)) {
    return node.props.children.map((child: JSX.Element) => deepFilterStringChildren(child)).join('');
  }
  return deepFilterStringChildren(node.props?.children);
};

export const isVoidElement = (element: JSX.Element) => {
  const elementType = element.type;
  if (typeof elementType === 'string') {
    const elementTypeLower = elementType.toLowerCase();
    if (
      elementTypeLower === 'input' || 
      elementTypeLower === 'img' ||
      elementTypeLower === 'br'
    ) {
      return true;
    }
  }

  return false;
};

export const replaceChildren = (elem: JSX.Element, children: React.ReactNode | React.ReactNode[]) => {
  if (elem === undefined || isVoidElement(elem))
    return elem;
  const props = { ...elem.props };
  delete props.children;
  return <elem.type { ... props } >
    { children }
  </elem.type>;
};

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

export const potentiallyUnsafe = (url?: string | null) => {
  if (!url)
    return true;
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

export function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export type RenderFunction = (props: PropsWithChildren<{ node: Node<ExtendedNodeType> }>) => React.ReactNode;

export type RendererRecord = Record<ExtendedNodeType, RenderFunction>;