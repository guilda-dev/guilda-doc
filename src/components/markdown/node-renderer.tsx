import { HtmlRenderingOptions, Node } from 'commonmark';
import React from 'react';
import { CodeBlock, CodeSpan } from './CodeBlock';
import { RendererRecord } from './common';
import MathBlock from './MathBlock';
import { isContainer, NodeWalker, NodeWalkerEvent } from './node-walker';
import parse from 'html-react-parser';

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

const potentiallyUnsafe = (url?: string | null) => {
  if (!url)
    return true;
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

type P = React.PropsWithChildren<{
  node: Node;
}>;

export class ReactRenderer implements RendererRecord {

  readonly options: HtmlRenderingOptions;
  readonly esc: (s?: string) => string | undefined;

  constructor(options?: HtmlRenderingOptions) {
    this.options = Object.assign({
      softbreak: '\n',
    }, options);
    this.esc = ((s) => s);
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
    if (this.options.safe)
      return <></>;
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
    const _start = (start !== null && start !== 1) ? start : undefined;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  custom_inline({ node, children }: P) { 
    return <></>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  custom_block({ node, children }: P) { 
    return <></>;
  }

}

export const render = (root: Node) => {
  const stack: React.ReactNode[][] = [[]];
  const walker = new NodeWalker(root);
  const renderers = new ReactRenderer();
  let event: NodeWalkerEvent | null = null;
  while ((event = walker.next())) {
    const { node, entering } = event;
    console.log(node.type, node.literal, entering, stack.length);
    const renderer = (renderers[node.type] ?? (() => <></>)).bind(renderers);

    if (isContainer(node)) {
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