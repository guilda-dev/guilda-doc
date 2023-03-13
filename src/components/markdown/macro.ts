

const reHtmlComment = /<!--([\s\S]*?)-->/g;
const reMacroFormat = /(?:([\w-]+)\s*:\s*)?([\w-]+)(?:\$(?:set|restore|one[-_]time|next[-_]line))?/g;

export const parseMacro = (str: string) => {
  const ans: [number, MacroRecord][] = [];
  reHtmlComment.lastIndex = 0;
  reMacroFormat.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = reHtmlComment.exec(str))) {
    const rawMacro = match[1];
    let matchInner: RegExpExecArray | null;
    const kwMacro: MacroRecord = {};
    while ((matchInner = reMacroFormat.exec(rawMacro))) {
      const key = matchInner[1] ?? '';
      const val = matchInner[2];
      const opr = (matchInner[3].replace(/_/g, '-')) as MacroSuffix ?? 'one-time';
      (kwMacro[key] = kwMacro[key] ?? []).push([val, opr]);
    }
    ans.push([match.index, kwMacro]);
  }
  return ans;
};

export type MacroSuffix = 'set' | 'restore' | 'one-time' | 'next-line';

export type MacroRecord = Record<string, [string, MacroSuffix][]>;

export class MacroStateMaintainer{

  readonly record: Map<string, Map<string, MacroSuffix | 'next-line-2'>>;

  constructor() {
    this.record = new Map();
  }

  merge(record: MacroRecord) {
    for (const key in record) {
      if (!this.record.has(key))
        this.record.set(key, new Map());
      const states = this.record.get(key) as Map<string, MacroSuffix | 'next-line-2'>;
      for (const [val, opr] of record[key]) {
        if (opr === 'restore')
          states.delete(val);
        else if (opr === 'next-line' && states.get(val) !== 'set')
          states.set(val, 'next-line-2');
        else if (opr === 'set')
          states.set(val, 'set');
        else if (opr === 'one-time' && states.get(val) !== 'set')
          states.set(val, 'one-time');
      }
    }
  }

  peek(key: string, value: string): MacroSuffix | undefined {
    const ret = this.record.get(key)?.get(value);
    if (ret === 'next-line-2')
      return undefined;
    return ret;
  }

  check(key: string, value: string): MacroSuffix | undefined {
    const ret = this.peek(key, value);
    if (ret === 'one-time')
      this.record.get(key)?.delete(value);
    return ret;
  }

  newLine() {
    this.record.forEach((val) => val.forEach((opr, _val) => {
      if (opr === 'next-line-2')
        val.set(_val, 'next-line');
      else if (opr === 'next-line')
        val.delete(_val);
    }));
  }

}
