import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavNode } from '@/base/nav';
import { SiteConfig } from '@/common/config';
import styled from 'styled-components';

export type NavTreeItemProps = {
  node: NavNode;
  state?: 'active' | 'inactive' | 'default';
  expanded?: boolean;
};

export type NavTreeProps = {
  parseName?: (raw: string) => string;
  parseLink?: (raw: string) => string;
  shouldExpand?: (node: NavNode) => boolean;
  expandClass?: string;
  rootNode: NavNode;
};


const NavTreeContext = createContext<NavTreeProps>({
  rootNode: {
    name: 'ERROR: NO NAV TREE ASSIGNED'
  }
});

const DEFAULT_EXPAND_CLASS = SiteConfig.nav.expandClass;

const NavTreeItemTag = styled.li`
  list-style-type: none;
`;

const NavTreeUnorderedLink = styled.ul`
  & > ${NavTreeItemTag} {
    margin-left: 20px;
  }
`;

const NavTreeItem = (props: NavTreeItemProps) => {
  const { node, state, expanded } = props;
  const { children, name, href } = node;
  const treeProps = useContext(NavTreeContext);


  // monitor class modification
  const [c, _c] = useState<string | undefined>();
  useEffect(() => {
    const classArr = (state ?? '').split('');
    if (expanded)
      classArr.push(treeProps.expandClass ?? DEFAULT_EXPAND_CLASS);
    const cl = classArr.filter(x => x !== '').join(' ');
    _c(cl !== '' ? cl : undefined);
  }, [state, expanded]);

  const nameDisp = treeProps.parseName?.(name) ?? name;
  const hasChildren = children !== undefined && children.length !== 0;

  const label = <>
    {href !== undefined && <a href={treeProps.parseLink?.(href) ?? href}>
      <span className='nav-tag'>{nameDisp}</span>
    </a>}
    {href === undefined && <span className='nav-tag'>{nameDisp}</span>}
  </>;

  return <>
    <NavTreeItemTag className={c}>
      { hasChildren ? 
        <>
          { label } { expanded }
          <NavTreeUnorderedLink className="list-root">
            {children?.map((node) =>
              <NavTreeItem
                key={node.name}
                node={node}
              />)}
          </NavTreeUnorderedLink>
        </> : label
      }
    </NavTreeItemTag>
  </>;
};


const NavTree = (props: NavTreeProps) => {
  return <NavTreeContext.Provider value={props}>
    <NavTreeUnorderedLink id="navlist" className="list-root">
      {props.rootNode.children?.map((node) =>
        <NavTreeItem
          key={node.name}
          expanded={true}
          node={node}
        />)}
    </NavTreeUnorderedLink>
  </NavTreeContext.Provider>;
};

export default NavTree;


