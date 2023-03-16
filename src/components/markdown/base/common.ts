import { BlockParsingOptions, compileMaybeSpecialRegExp, generalIsCodeBlockCategory, generalIsContainer, generalNeedsInlineParse, GeneralNodeType, NodeTypeDefinition } from 'commonmark';
import { parseInlineEmoji } from './emoji';
import { MathHandler, MathTrigger, parseInlineMathFence } from './math';
import { TableHandler, TableHeadHandler, TableRowHandler, TableCellHandler, TableTrigger } from './table';
import { parseInlineTemplate } from './template';

export type ExtendedNodeType = GeneralNodeType 
  | 'table' | 'table_row' | 'table_head' | 'table_cell' 
  | 'html_paragraph' | 'html_paragraph_text' 
  | 'math_block' | 'math_inline'
  | 'emoji'
  | 'template'
  ;

export const ExtendedNodeDefinition: NodeTypeDefinition<ExtendedNodeType> = {
  isContainer: (n) => {
    if (
      n.type === 'table' || 
      n.type === 'table_row' ||
      n.type === 'table_head' || 
      n.type === 'table_cell'  || 
      n.type === 'html_paragraph'
    )
      return true;
    return generalIsContainer(n);
  },
  isCodeBlockCategory: function (t: ExtendedNodeType): boolean {
    return generalIsCodeBlockCategory(t) || t === 'math_block';
  },
  needsInlineParse: function (t: ExtendedNodeType): boolean {
    return generalNeedsInlineParse(t) || t === 'table_cell';
  }
};


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
    [':', parseInlineEmoji],
  ]
};