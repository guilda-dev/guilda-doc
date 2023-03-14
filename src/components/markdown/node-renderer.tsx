import { HtmlRenderingOptions, Node, NodeTypeDefinition, NodeWalker, NodeWalkerEvent } from 'commonmark';
import React from 'react';
import { CodeBlock, CodeSpan } from './CodeBlock';
import { deepFilterStringChildren, potentiallyUnsafe, RendererRecord, RenderFunction, replaceChildren } from './common';
import MathBlock, { MathSpan } from './MathBlock';
import parse from 'html-react-parser';
import { ExtendedNodeDefinition, ExtendedNodeType } from './base/common';
import { TableCellContent } from './base/table';
import { generateAnchorFromTitle, HtmlParagraphDefinition, isHtmlRecordNode, mergeHtmlNodes } from './base/html';
import { TemplateParams } from './base/template';
import { MacroStateMaintainer, parseMacro } from './macro';
import MarkdownTemplate from './MarkdownTemplate';
import styled from 'styled-components';
import { NavHashLink } from 'react-router-hash-link';
import { NavNode } from '@/base/nav';
import { RightSideFrame } from '../page/PageFrame';
import NavTree from '../nav/NavTree';


type P = React.PropsWithChildren<{
  node: Node<ExtendedNodeType>;
}>;

export type ReactRendereingContext = {
  macroStore: MacroStateMaintainer;
  rootNode: HierarchicalNavNode;
  nodeStack: HierarchicalNavNode[];
};

export type ReactRenderingOptions = HtmlRenderingOptions & {
  parseLink?: (raw: string) => string;
};

export type HierarchicalNavNode = NavNode & {
  hierarchy: number;
  children?: HierarchicalNavNode[];
};


const TitleAnchor = styled(NavHashLink)`
  
`;

const HEADER_PREFIX = 'md-';

export class ReactRenderer implements RendererRecord {

  readonly options: ReactRenderingOptions;
  readonly context: ReactRendereingContext;

  constructor(options?: ReactRenderingOptions) {
    this.options = Object.assign({
      softbreak: '\n',
    }, options);
    this.context = {
      macroStore: new MacroStateMaintainer(),
      rootNode: {
        name: '',
        hierarchy: 0
      },
      nodeStack: []
    };
    this.context.nodeStack.push(this.context.rootNode);
  }

  // renderers

  text({ node }: P) {
    return <>{node.literal}</>;
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
    return <a href={href} title={title}>{children}</a>;
  }

  // TODO escape XML ...?
  image({ node }: P) {
    if (this.options.safe && potentiallyUnsafe(node.destination)) {
      return <span>[ERROR: POTENTIALLY UNSAFE LINK OMITTED]</span>;
    } else {
      const src = this.options.esc?.(node.destination ?? '') ?? node.destination ?? '';
      return <img src={this.options.parseLink?.(src) ?? src} />;
    }
  }

  emph({ children }: P) {
    return <em>{children}</em>;
  }

  strong({ children }: P) {
    return <strong>{children}</strong>;
  }

  html_inline({ node }: P) {
    // console.log(node.parent?.type, JSON.stringify(node.literal));
    const macros = parseMacro(node.literal ?? '');
    macros.forEach(([, macro]) => this.context.macroStore.merge(macro));
    if (this.options.safe)
      return <>[ERROR: RAW HTML OMITTED]</>;
    return parse(node.literal ?? '');
  }

  html_block({ node, children }: P) {
    return this.html_inline({ node, children });
  }

  code({ node }: P) {
    return <CodeSpan>{node.literal}</CodeSpan>;
  }

  code_block({ node }: P) {
    let lang: string | undefined;
    const info_words = node.info ? node.info.split(/\s+/) : [];
    if (info_words.length > 0 && info_words[0].length > 0) {
      lang = this.options.esc?.(info_words[0]) ?? info_words[0];
    }
    if (lang === 'math' || lang === 'latex')
      return <MathBlock>{node.literal}</MathBlock>;
    return <CodeBlock lang={lang}>{node.literal}</CodeBlock>;
  }



  paragraph({ node, children }: P) {
    const grandparent = node.parent?.parent;
    if (grandparent && grandparent.type === 'list') {
      if (grandparent.listTight) {
        return <>{children}</>;
      }
    }
    return <p>{children}</p>;
  }

  block_quote({ children }: P) {
    return <blockquote>{children}</blockquote>;
  }

  item({ children }: P) {
    return <li>{children}</li>;
  }

  list({ node, children }: P) {
    const start = node.listStart;
    const _start = (start !== undefined && start !== 1) ? start : undefined;
    return node.listType === 'bullet' ?
      (<ul>{children}</ul>) :
      (<ol start={_start}>{children}</ol>);
  }

  heading({ node, children }: P) {
    const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;
    const shouldAlignCenter =
      (this.context.macroStore.check(HeadingTag, 'align-center') ??
        this.context.macroStore.check('heading', 'align-center')) !== undefined;

    const headingString = deepFilterStringChildren(<>{children}</>);
    const headingHash =
      this.context.macroStore.data(HeadingTag, 'use-hash') ??
      this.context.macroStore.data('heading', 'use-hash') ??
      generateAnchorFromTitle(headingString);

    const href = '#' + HEADER_PREFIX + headingHash;

    // process node level
    let currentNode = this.context.nodeStack[this.context.nodeStack.length - 1];
    while (currentNode.hierarchy >= (node.level ?? 1)) {
      this.context.nodeStack.pop();
      currentNode = this.context.nodeStack[this.context.nodeStack.length - 1];
    }
    const thisNode = {
      name: headingString.replace(/\n\r/g, ' ').trim(),
      hierarchy: node.level ?? 1,
      href: href,
    };
    (currentNode.children = currentNode.children ?? [])
      .push(thisNode);
    this.context.nodeStack.push(thisNode);

    return <HeadingTag id={HEADER_PREFIX + headingHash} style={
      shouldAlignCenter ?
        { textAlign: 'center' } :
        undefined
    }>
      {children}
      <TitleAnchor to={href}>
        <svg viewBox="0 0 16 16" version="1.1" fill="currentColor" width="16" height="16" aria-hidden="true" data-v-f4cc3f5d=""><path fillRule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z" data-v-f4cc3f5d=""></path></svg>
      </TitleAnchor>
    </HeadingTag>;
  }

  thematic_break() {
    return <hr />;
  }


  document({ children }: P) {
    return children;
  }

  math_block({ node }: P) {
    return <MathBlock>{node.literal}</MathBlock>;
  }

  math_inline({ node }: P) {
    return <MathSpan>{node.literal}</MathSpan>;
  }

  table({ children }: P) {
    return <table>
      {React.Children.toArray(children)[0]}
      <tbody>
        {React.Children.toArray(children).slice(1)}
      </tbody>
    </table>;
  }

  table_head({ children }: P) {
    return <thead><tr>{children}</tr></thead>;
  }

  table_row({ children }: P) {
    return <tr>{children}</tr>;
  }

  table_cell({ node, children }: P) {
    const content = (node.customData as TableCellContent);
    const CellTag = (content.isHeader ? 'th' : 'td') as keyof JSX.IntrinsicElements;
    return <CellTag align={content.align}>{children}</CellTag>;
  }

  html_paragraph({ node, children }: P) {
    const { startTag, endTag, tagName } = node.customData as HtmlParagraphDefinition;
    const isValidNode = startTag !== undefined || tagName !== undefined;
    if (!isValidNode)
      return <>{children}</>;
    const htmlString = (startTag ?? '') + (endTag ?? '');
    const htmlBlock = parse(htmlString !== '' ? htmlString : (
      (tagName ?? '') !== '' ? `<${tagName}>` : ''
    ));
    if (typeof htmlBlock !== 'string') {
      if (htmlBlock instanceof Array) {
        if (htmlBlock.length === 0)
          return <>{children}</>;
        htmlBlock[0] = replaceChildren(htmlBlock[0], children);
        return htmlBlock.map(x => handleHtmlElementLink(x, this.options.parseLink));
      }
      else
        return handleHtmlElementLink(
          replaceChildren(htmlBlock, children),
          this.options.parseLink
        );
    }
    return <>{children}</>;
  }

  html_paragraph_text(p: P) {
    return this.text(p);
  }

  template({ node }: P) {
    const template = node.customData as TemplateParams;
    if (template !== undefined)
      return <MarkdownTemplate template={template} options={this.options} definiton={ExtendedNodeDefinition} />;
    return <></>;
  }

}

const handleHtmlElementLink = (elem: JSX.Element, parser?: (s: string) => string) => {
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
  } /*else if (
    elem.type === 'a' ||
    elem.type === 'link'
  ) {
    return <elem.type {...{
      ...elem.props,
      href: parser(elem.props.href) ?? ''
    }} />;
  }*/
  return elem;
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
  let lastLine = -1;
  while ((event = walker.next())) {
    const { node, entering } = event;
    const func = (renderers[node.type] ?? (() => <></>)) as RenderFunction;
    const renderer = func.bind(renderers);

    if (ExtendedNodeDefinition.isContainer(node)) {
      if (entering) {
        const linePos = node.sourcepos[0][0];
        if (linePos > lastLine) {
          const diff = linePos - lastLine;
          renderers.context.macroStore.newLine();
          if (diff > 1)
            renderers.context.macroStore.newLine();
          lastLine = linePos;
        }
        stack.push([]);
      }
      else {
        const children = React.Children.map(stack.pop(), (n, i) => (<React.Fragment key={`node_${i}`}>{n}</React.Fragment>));
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
    <RightSideFrame>
      <NavTree rootNode={renderers.context.rootNode} />
    </RightSideFrame>
    {stack[stack.length - 1]}
  </>;
};