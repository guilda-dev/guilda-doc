
import path from 'path-browserify';
import { SiteConfig } from './config';

export type ResourceSuffix = {
  lang?: string,
  type?: string, 
  format?: string | string[],
};

/**
 * returns an absolute path
 * @param path 
 */
export const normalizePath = (pathIn: string, currentDir: string): string => {
  let pathAbs = pathIn;
  if (!path.isAbsolute(pathIn))
    pathAbs = path.join(currentDir, pathIn);
  return path.normalize(pathAbs);
};


const concatWithDot = (...strs: (string | undefined)[]) => {
  const ret = strs.filter(x => !!x).join('.');
  return (ret) ? '.' + ret : '';
};


export const compileSuffix = ({ lang, type, format }: ResourceSuffix): string[] => {
  const _ext = typeof format === 'string' ? [format.trim()] : format?.map(x => x.trim());
  type = type?.trim();
  lang = lang?.trim();
  const ans: string[] = [];
  const exts = _ext === undefined ? SiteConfig.format.hierarchy : _ext;
  const langs = lang === undefined ? [...SiteConfig.lang.hierarchy, ''] : [lang, ''];
  for (const e in exts) 
    for (const l in langs) {
      ans.push(concatWithDot(l, type, e));
    }
  return ans;
};