import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

export type ActiveLinkContextScheme = {
  activeLink: string;
  setActiveLink: (link: string) => void;
  isActiveLink: (link: string) => boolean;
};

export const ActiveLinkContext = createContext<ActiveLinkContextScheme>({
  activeLink: '',
  setActiveLink: () => undefined,
  isActiveLink: () => false,
});

export const ActiveLinkProvider = (props: PropsWithChildren<object>) => {
  const [activeLink, setActiveLink] = useState('');
  const [v, _v] = useState<ActiveLinkContextScheme>({
    activeLink: '',
    setActiveLink: () => undefined,
    isActiveLink: () => false,
  });
  useEffect(() => {
    _v({
      activeLink: activeLink,
      setActiveLink: setActiveLink,
      isActiveLink: (link) => {
        return link === activeLink;
      }
    });
  }, [activeLink]);

  return <ActiveLinkContext.Provider value={v}>
    { props.children }
  </ActiveLinkContext.Provider>;
};

export const useActiveLinkContext = () => useContext(ActiveLinkContext);