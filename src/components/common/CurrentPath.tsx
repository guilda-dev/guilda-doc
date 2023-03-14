import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

export type CurrentPathContextScheme = {
  activeLink: string;
  setActiveLink: (link: string) => void;
  isActiveLink: (link: string) => boolean;

  currentDir: string;
  setCurrentDir: (link: string) => void;
};

const defaultScheme: CurrentPathContextScheme = Object.freeze({
  activeLink: '',
  setActiveLink: () => undefined,
  isActiveLink: () => false,
  currentDir: '', 
  setCurrentDir: () => undefined,
});

const _context = createContext<CurrentPathContextScheme>(defaultScheme);

export const CurrentPathProvider = (props: PropsWithChildren<object>) => {
  const [activeLink, setActiveLink] = useState('');
  const [currentDir, setCurrentDir] = useState('');
  const [v, _v] = useState<CurrentPathContextScheme>(defaultScheme);
  useEffect(() => {
    _v({
      activeLink: activeLink,
      setActiveLink: setActiveLink,
      isActiveLink: (link) => {
        return link === activeLink;
      },
      currentDir: currentDir, 
      setCurrentDir: setCurrentDir,
    });
  }, [activeLink]);

  return <_context.Provider value={v}>
    { props.children }
  </_context.Provider>;
};

export const useCurrentPath = () => useContext(_context);