import { ResponseError } from '@/base/common';
import { getStaticResource, ResourceMeta, ResourceSuffix } from '@/common/io';
import { useGlobalSetting } from '@/components/common/GlobalSetting';
import { useEffect, useState } from 'react';


export type ResourceStoreProps = {
  link: string,
  descriptor?: ResourceSuffix,
  lang?: string,
};


export type ResourceStore = [string | undefined, Error | undefined, ResourceMeta | undefined];


export const useResourceStore = (props: ResourceStoreProps): ResourceStore => {

  const [resource, setResource] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [meta, setMeta] = useState<ResourceMeta | undefined>(undefined);

  const setting = useGlobalSetting();

  const { link, descriptor, lang } = props;

  const getResHttp = async () => {
    let ret = false;
    const response = await fetch(link);
    if (response.ok) {
      setResource(await response.text());
      setError(undefined);
      ret = true;
    } else {
      setResource(undefined);
      setError(new ResponseError(response));
    }
    setMeta(undefined);
    return ret;
  };

  const getResStatic = async () => {
    let ret = false;
    const [data, err, meta] = await getStaticResource(link, descriptor, lang ?? setting.language);
    if (err) {
      setError(err);
      setResource(undefined);
    } else {
      setResource(data);
      setError(undefined);
      ret = true;
    }
    setMeta(meta);
    return ret;
  };

  useEffect(() => {
    const f = async () => {
      const retStatic = getResStatic();
      if (!retStatic)
        getResHttp();
    };
    f().catch((err => setResource(err)));
  }, [link, descriptor, lang, setting.language]);

  return [resource, error, meta];
};