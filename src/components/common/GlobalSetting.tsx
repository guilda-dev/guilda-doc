import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type GlobalSettingDefinition = {
  darkMode: boolean;
  language: string;
}

export type GlobalSettingSetter = (value: Partial<GlobalSettingDefinition>) => void;

export type GlobalSettingContextScheme = GlobalSettingDefinition & {
  setSetting: GlobalSettingSetter;
}

const getDefaultDefinition = (): GlobalSettingDefinition => ({
  darkMode: false,
  language: window.navigator?.language ?? 'ja'
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
    else {
      const val = JSON.parse(valueStr);
      ret[k] = val as never;
    }
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

  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(s.language);
  }, [s.language]);

  useEffect(() => {
    if (s.darkMode){
      document.getElementById('root')?.classList?.add('dark-mode');
      document.body.classList.add('dark-mode');
    }
    else {
      document.getElementById('root')?.classList?.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [s.darkMode]);

  return <_context.Provider value={{
    ...s,
    setSetting: updater, 
  }}>
    { props.children }
  </_context.Provider>;
};


export const useGlobalSetting = () => useContext(_context);

