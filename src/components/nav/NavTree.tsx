import React from 'react';
import * as yaml from 'js-yaml';

export type StringTree = {
  [key: string]: string | StringTree[];
};


import nav from '~/nav.yml?raw';
import { useTranslation } from 'react-i18next';
const navTree = yaml.load(nav);
console.log(navTree);

const iterateOver = (tree: StringTree[]): [string, string | StringTree[]][] => {
  return tree.map(x => [Object.keys(x)[0], x[Object.keys(x)[0]]]);
};

const parseMarkdownLink = (str: string) => {
  if (str.endsWith('.md'))
    str = str.slice(0, str.length - 3);
  if (!str.startsWith('/'))
    str = '/' + str;
  return str;
};

const NavTreeItem = (props: { name: string, tree: string | StringTree[], selected?: boolean }) => {
  const { name, tree, selected } = props;
  const treeIsString = typeof tree === 'string';
  const { t } = useTranslation();

  const treeIter = treeIsString ? undefined : iterateOver(tree);
  const link = treeIter?.filter(x => x[0] === '')[0] as [string, string] ?? ['', ''];
  const treeRemain = treeIter?.filter(x => x[0] !== '');

  return <>
    <li className="list-item">
      <details className={treeIsString ? 'unmarked' : ''} open={selected}>
        { treeIsString ?
          <summary>
            <a href={parseMarkdownLink(tree)}>
              { t(name ?? '') }
            </a>
          </summary> : <>
            <a href={parseMarkdownLink(link[1])}>{ t(name ?? '') }</a>
            <ul className="list-root">
              { treeRemain?.map(([name, tree]) => <NavTreeItem key={name} name={name} tree={tree} />) }
            </ul>
          </>
          
        }
      </details>
    
    </li>
  </>;
};

const NavTree = () => {
  return <>
    <ul id="navlist">
      { iterateOver([navTree as StringTree]).map(([name, tree]) => <NavTreeItem key={name} name={name} tree={tree} />) }
    </ul>    
  </>;
};

export default NavTree;


