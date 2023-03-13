import { HtmlRenderingOptions, Node, NodeTypeDefinition, NodeWalker, NodeWalkerEvent } from 'commonmark';
import React, { Children, createElement, ReactNode } from 'react';
import { CodeBlock, CodeSpan } from './CodeBlock';
import { RendererRecord, RenderFunction } from './common';
import MathBlock, { MathSpan } from './MathBlock';
import parse from 'html-react-parser';
import { ExtendedNodeDefinition, ExtendedNodeType } from './base/common';
import { TableCellContent } from './base/table';
import { HtmlParagraphDefinition, isHtmlRecordNode, mergeHtmlNodes } from './base/html';
import { TemplateParams } from './base/template';

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

const potentiallyUnsafe = (url?: string | null) => {
  if (!url)
    return true;
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

type P = React.PropsWithChildren<{
  node: Node<ExtendedNodeType>;
}>;

export type ReactRendereingContext = {
  heading_tags: string[];
};

export type ReactRenderingOptions = HtmlRenderingOptions & {
  templateHandler?: (template: TemplateParams) => string | undefined;
};

export class ReactRenderer implements RendererRecord {

  readonly options: ReactRenderingOptions;
  readonly esc: (s?: string) => string | undefined;
  readonly context: ReactRendereingContext;

  constructor(options?: ReactRenderingOptions) {
    this.options = Object.assign({
      softbreak: '\n',
    }, options);
    this.esc = ((s) => s);
    this.context = {
      heading_tags: []
    };
  }

  // renderers

  text({ node }: P) {
    return <>{ node.literal }</>;
  }

  softbreak() {
    return <></>;
  }

  linebreak() {
    return <br />;
  }

  link({ node, children }: P) {
    let href: string | undefined = undefined;
    let title: string | undefined = undefined;
    if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
      href = node.destination ?? undefined;
    }
    if (node.title) {
      title = node.title;
    }
    return <a href={href} title={title}>{ children }</a>;
  }

  // TODO escape XML ...?
  image({ node }: P) {
    if (this.options.safe && potentiallyUnsafe(node.destination)) {
      return <img />;
    } else {
      return <img src={this.esc(node.destination ?? undefined)} />;
    }
  }

  emph({ children }: P) { 
    return <em>{ children }</em>;
  }

  strong({ children }: P) { 
    return <strong>{ children }</strong>;
  }

  html_inline({ node }: P) {
    // console.log(node.parent?.type, JSON.stringify(node.literal));
    if (this.options.safe)
      return <>[ERROR: RAW HTML OMITTED]</>;
    return parse(node.literal ?? '');
  }

  html_block({ node, children }: P) {
    return this.html_inline({ node, children }); 
  }

  code({ node }: P) {
    return <CodeSpan>{ node.literal }</CodeSpan>;
  }

  code_block({ node }: P) { 
    let lang: string | undefined;
    const info_words = node.info ? node.info.split(/\s+/) : [];
    if (info_words.length > 0 && info_words[0].length > 0) {
      lang = this.esc(info_words[0]);
    }
    if (lang === 'math') 
      return <MathBlock>{ node.literal }</MathBlock>;
    return <CodeBlock lang={lang}>{ node.literal }</CodeBlock>;
  }



  paragraph({ node, children }: P) { 
    const grandparent = node.parent?.parent;
    if (grandparent && grandparent.type === 'list') {
      if (grandparent.listTight) {
        return <>{ children }</>;
      }
    }
    return <p>{ children }</p>;
  }

  block_quote({ children }: P) { 
    return <blockquote>{ children }</blockquote>;
  }

  item({ children }: P) {
    return <li>{ children }</li>;
  }

  list({ node, children }: P) {
    const start = node.listStart;
    const _start = (start !== undefined && start !== 1) ? start : undefined;
    return node.listType === 'bullet' ? 
      (<ul>{ children }</ul>) : 
      (<ol start={_start}>{ children }</ol>);
  }

  heading({ node, children }: P) { 
    const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;
    return <HeadingTag>{ children }</HeadingTag>;
  }

  thematic_break() {
    return <hr />;
  }


  document({ children }: P) { 
    return children; 
  }

  math_block({ node }: P) { 
    return <MathBlock>{ node.literal }</MathBlock>;
  }

  math_inline({ node }: P) { 
    return <MathSpan>{ node.literal }</MathSpan>;
  }

  table({ children }: P) {
    return <table>
      { React.Children.toArray(children)[0] }
      <tbody>
        { React.Children.toArray(children).slice(1) }
      </tbody>
    </table>;
  }

  table_head({ children }: P) {
    return <thead><tr>{ children }</tr></thead>;
  }

  table_row({ children }: P) {
    return <tr>{ children }</tr>;
  }

  table_cell({ node, children }: P) {
    const content = (node.customData as TableCellContent);
    const CellTag = (content.isHeader ? 'th' : 'td') as keyof JSX.IntrinsicElements;
    return <CellTag align={content.align}>{ children }</CellTag>;
  }

  html_paragraph({ node, children }: P) {
    const { startTag, endTag, tagName } = node.customData as HtmlParagraphDefinition;
    const isValidNode = startTag !== undefined || tagName !== undefined;
    if (!isValidNode)
      return <>{ children }</>;
    const htmlString = (startTag ?? '') + (endTag ?? '');
    const htmlBlock = parse(htmlString !== '' ? htmlString : (
      (tagName ?? '') !== '' ? `<${tagName}>` : ''
    ));
    if (typeof htmlBlock !== 'string') {
      if (htmlBlock instanceof Array){
        if (htmlBlock.length === 0)
          return <>{ children }</>;
        // htmlBlock[0] = replaceChildren(htmlBlock[0], children);
      }
      else
        return replaceChildren(htmlBlock, children);
    }
    return <>{ children }</>;
  }

  html_paragraph_text(p: P) {
    return this.text(p);
  }

  template({ node }: P) {
    const template = this.options.templateHandler?.(node.customData as TemplateParams);
    if (template !== undefined)
      return parse(template);
    return <></>;
  }

}

const isVoidElement = (element: JSX.Element) => {
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

const replaceChildren = (elem: JSX.Element, children: ReactNode | ReactNode[]) => {
  if (elem === undefined || isVoidElement(elem))
    return elem;
  const props = { ...elem.props };
  delete props.children;
  return <elem.type { ... props } >
    { children }
  </elem.type>;
};

export const render = (
  ast: Node<ExtendedNodeType>, 
  options?: ReactRenderingOptions, 
  definition?: NodeTypeDefinition<ExtendedNodeType>
) => {
  const walker = new NodeWalker(ast, definition);
  let event: NodeWalkerEvent<ExtendedNodeType> | undefined = undefined;
  
  // post processing
  while ((event = walker.next())) {
    const { node } = event;
    if (isHtmlRecordNode(node)) {
      const reducedNode = mergeHtmlNodes(node, 'html_paragraph', 'html_paragraph_text');
      walker.resumeAt(reducedNode, true);
    }
  }

  // render
  const stack: React.ReactNode[][] = [[]];
  walker.resumeAt(ast, true);
  const renderers = new ReactRenderer(options);
  while ((event = walker.next())) {
    const { node, entering } = event;
    const func = (renderers[node.type] ?? (() => <></>)) as RenderFunction;
    const renderer = func.bind(renderers);

    if (ExtendedNodeDefinition.isContainer(node)) {
      if (entering)
        stack.push([]);
      else {
        const children = React.Children.map(stack.pop(), (n, i) => (<React.Fragment key={`node_${i}`}>{ n }</React.Fragment>));
        stack[stack.length - 1].push(renderer({
          node: node, 
          children: children
        }));
      }
    } else {
      stack[stack.length - 1].push(renderer({ node: node }));
    }
  }
  return <>
    { stack[stack.length - 1] }
  </>;
};