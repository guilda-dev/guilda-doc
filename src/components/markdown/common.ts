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

export type RenderFunction = (props: PropsWithChildren<{ node: Node<ExtendedNodeType> }>) => React.ReactNode;

export type RendererRecord = Record<ExtendedNodeType, RenderFunction>;