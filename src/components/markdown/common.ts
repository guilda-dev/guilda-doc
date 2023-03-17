import React from 'react';

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