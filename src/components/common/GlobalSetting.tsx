import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

export type GlobalSettingDefinition = {
  darkMode: boolean;
}

export type GlobalSettingSetter = (value: Partial<GlobalSettingDefinition>) => void;

export type GlobalSettingContextScheme = GlobalSettingDefinition & {
  setSetting: GlobalSettingSetter;
}

const getDefaultDefinition = (): GlobalSettingDefinition => ({
  darkMode: false,
});

const getDefaultScheme = (): GlobalSettingContextScheme => ({
  ...getDefaultDefinition(),
  setSetting: () => undefined
});

const DEF_KEYS = Object.keys(getDefaultDefinition()) as (keyof GlobalSettingDefinition)[];

const _context = createContext<GlobalSettingContextScheme>(getDefaultScheme());

const putToLocalStorage = (obj: GlobalSettingDefinition, prefix?: string) => {
  prefix = prefix ?? '';
  for (const k of DEF_KEYS) {
    const key = prefix + String(k);
    const value = obj[k as keyof GlobalSettingDefinition];
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
      ret[k as keyof GlobalSettingDefinition] = JSON.parse(valueStr);
  }
  return ret;
};

const SETTING_PREFIX = 'setting.';

export const GlobalSettingProvider = (props: PropsWithChildren<object>) => {
  const [s, _s] = useState<GlobalSettingDefinition>(getFromLocalStorage(SETTING_PREFIX));
  const updater: GlobalSettingSetter = (value) => {
    const newSetting = Object.assign({}, s, value);
    putToLocalStorage(newSetting, SETTING_PREFIX);
    _s(newSetting);
  };
  return <_context.Provider value={{
    ...s,
    setSetting: updater, 
  }}>
    { props.children }
  </_context.Provider>;
};


export const useGlobalSetting = () => useContext(_context);

