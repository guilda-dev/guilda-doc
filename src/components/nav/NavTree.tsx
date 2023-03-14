import React, { useEffect, useState } from 'react';
import * as yaml from 'js-yaml';

export type NavTreeItemProps = NavNode & NavTreeProps & {
  state?: 'active' | 'inactive' | 'default';
  expanded?: boolean;
};

export type NavTreeProps = {
  parseName?: (raw: string) => string;
  parseLink?: (raw: string) => string;
  shouldExpand?: (node: NavNode) => boolean;
  expandClass?: string
};

export const DEFAULT_EXPAND_CLASS = 'expanded';

import nav from '~/nav.yml?raw';
import { useTranslation } from 'react-i18next';
import { compileNavRecordMap, NavNode, NavRecordMap } from '@/base/nav';
const navTreeRaw = yaml.load(nav) as NavRecordMap;
const navTree = compileNavRecordMap(navTreeRaw);
console.log(navTreeRaw);
console.log(navTree);

const parseMarkdownLink = (str: string) => {
  if (str.endsWith('.md'))
    str = str.slice(0, str.length - 3);
  if (!str.startsWith('/'))
    str = '/' + str;
  return str;
};

const NavTreeItem = (props: NavTreeItemProps) => {
  const { children, name, href, state, expanded } = props;
  // monitor class modification
  const [c, _c] = useState<string | undefined>();
  useEffect(() => {
    const classArr = (state ?? '').split('');
    if (expanded)
      classArr.push(props.expandClass ?? DEFAULT_EXPAND_CLASS);
    const cl = classArr.filter(x => x !== '').join(' ');
    _c(cl !== '' ? cl : undefined);
  }, [state, expanded]);

  const nameDisp = props.parseName?.(name) ?? name;
  const hasChildren = children !== undefined && children.length !== 0;

  const label = <>
    {href !== undefined && <a href={props.parseLink?.(href) ?? href}>
      <span className='nav-tag'>{nameDisp}</span>
    </a>}
    {href === undefined && <span className='nav-tag'>{nameDisp}</span>}
  </>;

  return <>
    <li className={c}>
      { hasChildren ? 
        <>
          { label } { expanded }
          <ul className="list-root">
            {children?.map((node) =>
              <NavTreeItem
                key={node.name}
                {...node}
                parseName={props.parseName}
                parseLink={props.parseLink}
                expandClass={props.expandClass}
                shouldExpand={props.shouldExpand}
              />)}
          </ul>
        </> : label
      }
    </li>
  </>;
};


const NavTree = (props: NavTreeProps) => {
  return <>
    <ul id="navlist" className="list-root">
      {navTree.children?.map((node) =>
        <NavTreeItem
          key={node.name}
          expanded={true}
          {...node}
          parseName={props.parseName}
          parseLink={props.parseLink}
          expandClass={props.expandClass}
          shouldExpand={props.shouldExpand}
        />)}
    </ul>
  </>;
};

export default NavTree;


