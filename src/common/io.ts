
import { ResponseError } from '@/base/common';
import path from 'path-browserify';
import { SiteConfig } from './config';

export type ResourceSuffix = {
  lang?: string,
  type?: string,
  format?: string | string[],
};

export type ResourceMeta = {
  lang: string,
  type?: string,
  format: string,
  time: number,
}

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



export const compileSuffix = ({ lang, type, format }: ResourceSuffix, currentLang?: string): ResourceMeta[] => {
  const now = Date.now();
  const _ext = typeof format === 'string' ? [format.trim()] : format?.map(x => x.trim());
  type = type?.trim();
  lang = (lang ?? currentLang)?.trim();
  const ans: ResourceMeta[] = [];
  const exts = _ext === undefined ? SiteConfig.format.hierarchy : _ext;
  const langs = lang === undefined ? [...SiteConfig.lang.hierarchy, ''] : [lang, '', ...SiteConfig.lang.hierarchy];
  for (const e of exts)
    for (const l of langs) {
      ans.push({ lang: l, type: type, format: e, time: now });
    }
  return ans;
};


const concatWithDot = (...strs: (string | undefined)[]) => {
  const ret = strs.filter(x => !!x).join('.');
  return (ret) ? '.' + ret : '';
};


const fpMap: Map<string, object> = new Map();
const FP_MAX_SIZE = 1024;
const DEFAULT_TIME_REFRESH = 1000 * 600; // 10 min.
const resMap: WeakMap<object, [string, ResourceMeta]> = new WeakMap();

const getFingerprint = (path: string, descriptor?: ResourceSuffix, currentLang?: string) => 
  `${path} + ${JSON.stringify(descriptor)} + ${currentLang}`;

const getCachedResource = (fp: string, timeRefresh?: number) 
  : [string, ResourceMeta] | undefined => {
  const fpObj = fpMap.get(fp);
  if (fpObj !== undefined){
    const ret = resMap.get(fpObj);
    if (ret === undefined)
      return undefined;
    if (timeRefresh !== undefined && timeRefresh >= 0 && Date.now() - timeRefresh > ret[1].time) {
      fpMap.delete(fp);
      return undefined;
    }
    return ret;
  } 
  return undefined;
};

const putCachedResource = (fp: string, val: string, meta: ResourceMeta) => {
  while (fpMap.size >= FP_MAX_SIZE)
    fpMap.delete(fpMap.keys().next().value);
  let fpObj = fpMap.get(fp);
  if (fpObj === undefined) {
    fpObj = { fp: fp };
    fpMap.set(fp, fpObj);
  }
  resMap.set(fpObj, [val, meta]);
};


export const getStaticResource = async (path: string, descriptor?: ResourceSuffix, currentLang?: string, timeRefresh?: number)
  : Promise<[undefined, ResponseError, ResourceMeta] | [string, undefined, ResourceMeta]> => {
  const fp = getFingerprint(path, descriptor, currentLang);
  const cache = getCachedResource(fp, timeRefresh ?? DEFAULT_TIME_REFRESH);
  if (cache !== undefined) {
    return [cache[0], undefined, cache[1]];
  }

  const metas = compileSuffix(descriptor ?? {}, currentLang);

  let lastErr: ResponseError | undefined = undefined;
  let lastMeta: ResourceMeta | undefined = undefined;
  for (const meta of metas) {
    const resPath = path + concatWithDot(meta.lang, meta.type, meta.format);
    const response = await fetch(resPath);
    if (response.ok) {
      const txt = await response.text();
      putCachedResource(fp, txt, meta);
      return [txt, undefined, meta];
    } else if (response.status === 404) {
      lastErr = new ResponseError(response);
      lastMeta = meta;
      continue;
    } else {
      return [undefined, new ResponseError(response), meta];
    }
  }
  return [undefined, lastErr ?? new ResponseError(undefined), lastMeta ?? { lang: '', format: '', time: Date.now() }];
};


