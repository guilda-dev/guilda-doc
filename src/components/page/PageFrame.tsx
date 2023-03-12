import React, { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const SideFrame = styled.div`
  flex: 0 0 var(--sidebar-max-width);
  position: sticky;
  top: var(--navbar-height);
  min-height: var(--navbar-height);
  max-height: var(--page-content-min-height);
  width: var(--sidebar-max-width);
`;

const MainFrame = styled.div`
  flex: 1 1 auto;
  max-width: var(--page-content-max-width);
  min-width: var(--page-content-min-width);
`;

export const PageFrame = (props: PropsWithChildren<object>) => {
  return <>
    <SideFrame id='left-sidebar' />
    <MainFrame id='main-page'>
      { props.children }
    </MainFrame>
    <SideFrame id='right-sidebar' />
  </>;
};

export const LeftSideFrame = (props: PropsWithChildren<object>) => {
  const leftSide = document.getElementById('left-sidebar');
  if (leftSide !== null)
    return ReactDOM.createPortal(
      props.children, 
      leftSide
    );
  return <>ERROR: PORTAL TARGET UNDEFINED</>;
};

export const RightSideFrame = (props: PropsWithChildren<object>) => {
  const leftSide = document.getElementById('right-sidebar');
  if (leftSide !== null)
    return ReactDOM.createPortal(
      props.children, 
      leftSide
    );
  return <>ERROR: PORTAL TARGET UNDEFINED</>;
};