import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

export type GlobalStyleDefinition = {
  darkMode: boolean;
}

export type GlobalStyleSetter = (value: Partial<GlobalStyleDefinition>) => void;

export type GlobalStyleContextScheme = GlobalStyleDefinition & {
  setStyle: GlobalStyleSetter;
}

const getDefaultDefinition = (): GlobalStyleDefinition => ({
  darkMode: false,
});

const getDefaultScheme = (): GlobalStyleContextScheme => ({
  ...getDefaultDefinition(),
  setStyle: () => undefined
});

const DEF_KEYS = Object.keys(getDefaultDefinition()) as (keyof GlobalStyleDefinition)[];

export const GlobalStyleContext = createContext<GlobalStyleContextScheme>(getDefaultScheme());

const putToLocalStorage = (obj: GlobalStyleDefinition, prefix?: string) => {
  prefix = prefix ?? '';
  for (const k of DEF_KEYS) {
    const key = prefix + String(k);
    const value = obj[k as keyof GlobalStyleDefinition];
    if (value === undefined)
      localStorage.removeItem(key);
    else 
      localStorage.setItem(key, JSON.stringify(value));
  }
};

const getFromLocalStorage = (prefix?: string) => {
  const ret = getDefaultDefinition();
  for (const k of DEF_KEYS) {
    const key = prefix + String(k);
    const valueStr = localStorage.getItem(key);
    if (valueStr === null)
      continue;
    else 
      ret[k as keyof GlobalStyleDefinition] = JSON.parse(valueStr);
  }
  return ret;
};

export const GlobalStyleProvider = (props: PropsWithChildren<object>) => {
  const [style, setStyle] = useState<GlobalStyleDefinition>(getFromLocalStorage('style.'));
  const updater: GlobalStyleSetter = (value) => {
    const newStyle = Object.assign({}, style, value);
    putToLocalStorage(newStyle, 'style.');
    setStyle(newStyle);
  };
  return <GlobalStyleContext.Provider value={{
    ...style,
    setStyle: updater, 
  }}>
    { props.children }
  </GlobalStyleContext.Provider>;
};


export const useGlobalStyle = () => useContext(GlobalStyleContext);

