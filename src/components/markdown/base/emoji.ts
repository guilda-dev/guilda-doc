import { Node, createTextnode, InlineHandler } from 'commonmark';
import { ExtendedNodeType } from './common';
import lib from 'emojilib';

const nameMap: Map<string, string> = new Map();
for (const val in lib) {
  for (const key of lib[val as keyof typeof lib])
    nameMap.set(key, val);
}

const reInlineEmoji = /^:\S+?:/g;

export const parseInlineEmoji: InlineHandler<ExtendedNodeType> = (parser, block) => {
  reInlineEmoji.lastIndex = 0;
  const matched = parser.match(reInlineEmoji);
  if (matched) {
    const stripped = matched.substring(1, matched.length - 1);
    const emoji = nameMap.get(stripped.replace(/-/g, '_'));
    if (emoji === undefined){
      const newChild = new Node<ExtendedNodeType>('emoji', block.sourcepos);
      newChild.literal = stripped;
      block.appendChild(newChild);
    } else
      block.appendChild(createTextnode(emoji ?? matched));
    return true;
  }
  return false;
};