import React, { PropsWithChildren } from 'react';
import * as commonmark from 'commonmark';

export const filterStringChildren = (children: React.ReactNode | React.ReactNode[]) => {
  return React.Children.toArray(children)
    .filter(x => typeof x === 'string')
    .join('');
};

export type RendererRecord = Record<
  commonmark.NodeType,
  (props: PropsWithChildren<{ node: commonmark.Node }>) => React.ReactNode
>;