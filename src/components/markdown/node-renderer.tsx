import { HtmlRenderingOptions, Node, NodeTypeDefinition, NodeWalker, NodeWalkerEvent } from 'commonmark';
import React from 'react';
import { CodeBlock, CodeSpan } from './CodeBlock';
import { potentiallyUnsafe, RendererRecord, RenderFunction, replaceChildren } from './common';
import MathBlock, { MathSpan } from './MathBlock';
import parse from 'html-react-parser';
import { ExtendedNodeDefinition, ExtendedNodeType } from './base/common';
import { TableCellContent } from './base/table';
import { HtmlParagraphDefinition, isHtmlRecordNode, mergeHtmlNodes } from './base/html';
import { TemplateParams } from './base/template';
import { MacroStateMaintainer, parseMacro } from './macro';
import MarkdownTemplate from './MarkdownTemplate';


type P = React.PropsWithChildren<{
  node: Node<ExtendedNodeType>;
}>;

export type ReactRendereingContext = {
  macroStore: MacroStateMaintainer
};

export type ReactRenderingOptions = HtmlRenderingOptions & {
  parseLink?: (raw: string) => string;
};

export class ReactRenderer implements RendererRecord {

  readonly options: ReactRenderingOptions;
  readonly context: ReactRendereingContext;

  constructor(options?: ReactRenderingOptions) {
    this.options = Object.assign({
      softbreak: '\n',
    }, options);
    this.context = {
      macroStore: new MacroStateMaintainer(),
    };
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
    const shouldAlignCenter = this.context.macroStore.check(HeadingTag, 'align-center') !== undefined;
    return <HeadingTag style={
      shouldAlignCenter ?
        { textAlign: 'center' } :
        undefined
    }>{children}</HeadingTag>;
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
    {stack[stack.length - 1]}
  </>;
};