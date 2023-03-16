import { Node } from 'commonmark';
import React, { PropsWithChildren } from 'react';
import { ExtendedNodeType } from './base/common';


export const handleHtmlElementLink = (elem: JSX.Element, parser?: (s: string) => string) => {
  if (parser === undefined)
    return elem;
  if (
    elem.type === 'img' ||
    elem.type === 'audio' ||
    elem.type === 'video' ||
    elem.type === 'source'
  ) {
    return <elem.type {...{
      ...elem.props,
      src: parser(elem.props.src) ?? ''
    }} />;
  } else if (
    elem.type === 'a' ||
    elem.type === 'link'
  ) {
    const props = { ...elem.props };
    delete props.isActive;
    return <elem.type {...props} />;
  }
  return elem;
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


