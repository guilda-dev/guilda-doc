import React from 'react';
import { useActiveLinkContext } from '../ActiveLink';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

export type NavItem = {
  key?: string;
  target: string;
  children?: NavItem[];
};

export type NavLinkProps = {
  item: NavItem;
}

const Link = styled.li`
  display: inline-block;
  font-size: medium;
  &.active {
    font-size: large;
  }
`;

const NavLink = (props: NavLinkProps) => {
  const { setActiveLink, isActiveLink } = useActiveLinkContext();
  const { key, target, children } = props.item;
  const { t } = useTranslation();

  return <Link className={isActiveLink(target) ? 'active' : ''}>
    <a 
      href={target} 
      onClick={() => setActiveLink(target)}
    >
      { t(key ?? ('nav:' + target)) }
    </a>
    { children && <ul className='link-list'>
      { children.map(x => <NavLink key={x.target} item={x} />) }
    </ul> }
  </Link>; 
};

export default NavLink;